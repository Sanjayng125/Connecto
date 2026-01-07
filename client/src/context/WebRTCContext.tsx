import { createContext, useContext, useRef, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import { toast } from "react-toastify";
import type { ActiveCall, CallParticipant } from "../types";

interface IncomingCall {
  from: string;
  fromUsername: string;
}

interface WebRTCContextValue {
  initiateCall: (participant: CallParticipant) => void;
  answerCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  incomingCall: IncomingCall | null;
  isIncomingCall: boolean;
  activeCall: ActiveCall | null;
  toggleMute: () => void;
  isMuted: boolean;
}

interface WebRTCProviderProps {
  children: React.ReactNode;
}

const WebRTCContext = createContext<WebRTCContextValue | null>(null);

export const WebRTCProvider = ({ children }: WebRTCProviderProps) => {
  const { socket } = useSocket();

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const pendingICE = useRef<RTCIceCandidateInit[]>([]);

  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const createPC = (peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("call:ice-candidate", {
          to: peerId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    pc.ontrack = (event) => {
      if (!remoteAudioRef.current) {
        remoteAudioRef.current = new Audio();
        remoteAudioRef.current.autoplay = true;
      }
      remoteAudioRef.current.srcObject = event.streams[0];
    };

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === "connected") {
        setActiveCall((prev) =>
          prev ? { ...prev, state: "connected" } : null
        );
        toast.success("Call connected!");
      } else if (pc.iceConnectionState === "disconnected") {
        toast.info("Connection interrupted...");
      } else if (["failed", "closed"].includes(pc.iceConnectionState)) {
        toast.error("Call disconnected");
        endCall(true);
      }
    };

    pcRef.current = pc;
    return pc;
  };

  const initiateCall = async (participant: CallParticipant) => {
    if (!socket) {
      toast.error("No connection to server");
      return;
    }

    if (activeCall) {
      toast.error("Already in a call");
      return;
    }

    try {
      setActiveCall({
        participant,
        state: "ringing",
        isIncoming: false,
      });

      socket.emit("call:initiate", { to: participant.userId });
      toast.info(`Calling ${participant.username}...`);
    } catch (error) {
      console.error("❌ Failed to initiate call:", error);
      toast.error("Failed to start call");
      setActiveCall(null);
    }
  };

  const answerCall = async () => {
    if (!socket || !incomingCall) {
      toast.error("Cannot answer call");
      return;
    }

    try {
      setIsIncomingCall(false);
      setActiveCall({
        participant: {
          username: incomingCall.fromUsername,
          userId: incomingCall.from,
        },
        state: "connecting",
        isIncoming: true,
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = stream;

      socket.emit("call:accept", {
        to: incomingCall.from,
      });

      setIncomingCall(null);
      toast.success("Call answered!");
    } catch (error: any) {
      console.error("❌ Failed to answer call:", error);

      if (error.name === "NotAllowedError") {
        toast.error("Microphone access denied");
      } else if (error.name === "NotFoundError") {
        toast.error("No microphone found");
      } else {
        toast.error("Failed to answer call");
      }

      setActiveCall(null);
      setIsIncomingCall(false);
      setIncomingCall(null);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    }
  };

  const rejectCall = () => {
    if (!socket || !incomingCall) return;

    socket.emit("call:reject", {
      to: incomingCall.from,
    });

    setIncomingCall(null);
    setIsIncomingCall(false);
    pendingICE.current = [];
    toast.info("Call rejected");
  };

  const endCall = (shouldNotifyOther = true) => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    if (
      socket &&
      activeCall &&
      shouldNotifyOther &&
      activeCall.state !== "idle" &&
      activeCall.state !== "ended"
    ) {
      socket.emit("call:end", { to: activeCall.participant.userId });
    }

    pendingICE.current = [];

    if (activeCall) {
      setActiveCall((prev) => (prev ? { ...prev, state: "ended" } : null));
      setTimeout(() => {
        setActiveCall(null);
      }, 1000);
    }
    setIncomingCall(null);
    setIsIncomingCall(false);
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("call:contact-offline", () => {
      toast.error("User is offline");
      endCall(false);
    });

    socket.on("call:incoming", (data: IncomingCall) => {
      if (activeCall) {
        socket.emit("call:reject", { to: data.from });
        return;
      }

      setIncomingCall(data);
      setIsIncomingCall(true);
    });

    socket.on("call:accepted", async ({ by }: { by: string }) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        localStreamRef.current = stream;

        const pc = createPC(by);

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
        });
        await pc.setLocalDescription(offer);

        socket.emit("call:offer", { to: by, offer });

        setActiveCall((prev) =>
          prev
            ? { ...prev, state: "connecting" }
            : {
                participant: {
                  username: by,
                  userId: by,
                },
                state: "connecting",
                isIncoming: false,
              }
        );
      } catch (error: any) {
        console.error("❌ Failed to create offer:", error);

        if (error.name === "NotAllowedError") {
          toast.error("Microphone access denied");
        } else if (error.name === "NotFoundError") {
          toast.error("No microphone found");
        } else {
          toast.error("Failed to connect");
        }

        endCall();
      }
    });

    socket.on("call:rejected", () => {
      toast.info("Call rejected");
      endCall(false);
    });

    socket.on(
      "call:offer",
      async ({
        from,
        offer,
      }: {
        from: string;
        offer: RTCSessionDescriptionInit;
      }) => {
        try {
          const pc = createPC(from);

          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
              pc.addTrack(track, localStreamRef.current!);
            });
          }

          await pc.setRemoteDescription(new RTCSessionDescription(offer));

          for (const candidate of pendingICE.current) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          pendingICE.current = [];

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socket.emit("call:answer", { to: from, answer });

          setActiveCall((prev) =>
            prev ? { ...prev, state: "connecting" } : null
          );
        } catch (error) {
          console.error("❌ Failed to handle offer:", error);
          toast.error("Failed to connect");
          endCall(true);
        }
      }
    );

    socket.on(
      "call:answer",
      async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
        if (!pcRef.current) {
          console.error("❌ No peer connection");
          return;
        }

        try {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );

          for (const candidate of pendingICE.current) {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
          pendingICE.current = [];

          setActiveCall((prev) =>
            prev ? { ...prev, state: "connecting" } : null
          );
        } catch (error) {
          console.error("❌ Failed to set remote description:", error);
          toast.error("Failed to connect");
          endCall(true);
        }
      }
    );

    socket.on(
      "call:ice-candidate",
      async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
        if (pcRef.current?.remoteDescription) {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {
            console.error("❌ Failed to add ICE candidate:", error);
          }
        } else {
          pendingICE.current.push(candidate);
        }
      }
    );

    socket.on("call:ended", () => {
      toast.info("Call ended");
      endCall(false);
    });

    return () => {
      socket.off("call:contact-offline");
      socket.off("call:incoming");
      socket.off("call:accepted");
      socket.off("call:rejected");
      socket.off("call:offer");
      socket.off("call:answer");
      socket.off("call:ice-candidate");
      socket.off("call:ended");
    };
  }, [socket, activeCall]);

  useEffect(() => {
    return () => {
      endCall(false);
    };
  }, []);

  return (
    <WebRTCContext.Provider
      value={{
        initiateCall,
        answerCall,
        rejectCall,
        endCall,
        incomingCall,
        activeCall,
        isIncomingCall,
        toggleMute,
        isMuted,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = (): WebRTCContextValue => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error("useWebRTC must be used within WebRTCProvider");
  }
  return context;
};
