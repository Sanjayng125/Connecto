import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { useWebRTC } from "../context/WebRTCContext";
import { useState, useEffect } from "react";

export const ActiveCallIndicator = () => {
  const { activeCall, endCall, toggleMute, isMuted } = useWebRTC();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (activeCall?.state === "connected") {
      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setDuration(0);
    }
  }, [activeCall?.state]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (
    !activeCall ||
    activeCall.state === "idle" ||
    activeCall.state === "ended"
  ) {
    return null;
  }

  const getStateInfo = () => {
    switch (activeCall.state) {
      case "ringing":
        return {
          text: "Ringing...",
          color: "bg-blue-500",
          animate: "animate-pulse",
        };
      case "connecting":
        return {
          text: "Connecting...",
          color: "bg-yellow-500",
          animate: "animate-pulse",
        };
      case "connected":
        return {
          text: formatDuration(duration),
          color: "bg-green-500",
          animate: "animate-pulse",
        };
      default:
        return { text: "", color: "bg-gray-500", animate: "" };
    }
  };

  const stateInfo = getStateInfo();

  return (
    <div className="fixed top-4 right-4 z-9998 animate-slideDown">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden min-w-70 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-500 to-purple-600 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${stateInfo.color} ${stateInfo.animate}`}
              />
              <span className="text-white font-semibold text-sm">
                {activeCall.isIncoming ? "Incoming Call" : "Outgoing Call"}
              </span>
            </div>
            <Phone className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {activeCall.participant.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">
                {activeCall.participant.username}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stateInfo.text}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {activeCall.state === "connected" && (
              <button
                onClick={toggleMute}
                className={`flex-1 px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 font-medium ${
                  isMuted
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {isMuted ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span className="text-sm">Unmute</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span className="text-sm">Mute</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={endCall}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              <PhoneOff className="w-4 h-4" />
              <span className="text-sm">End Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
