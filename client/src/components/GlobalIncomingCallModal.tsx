import { Phone, PhoneOff } from "lucide-react";
import { useWebRTC } from "../context/WebRTCContext";

export const GlobalIncomingCallModal = () => {
  const { isIncomingCall, incomingCall, answerCall, rejectCall } = useWebRTC();

  if (!isIncomingCall || !incomingCall) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-9999 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-slideUp">
        <div className="text-center">
          <div className="w-24 h-24 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <div className="text-4xl font-bold text-white">
              {incomingCall.fromUsername.charAt(0).toUpperCase()}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {incomingCall.fromUsername}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8 flex items-center justify-center gap-2">
            <Phone className="w-5 h-5 animate-bounce" />
            Incoming voice call...
          </p>

          <div className="flex gap-6 justify-center">
            <button
              onClick={rejectCall}
              className="group flex flex-col items-center gap-2 transition-transform hover:scale-110"
            >
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-600 transition-colors">
                <PhoneOff className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Decline
              </span>
            </button>

            <button
              onClick={answerCall}
              className="group flex flex-col items-center gap-2 transition-transform hover:scale-110"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:bg-green-600 transition-colors animate-pulse">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Answer
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
