import { Loader2, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { contactApi } from "../api/contact";
import type { Contact } from "../types";
import { SentRequestCard } from "./SentRequestCard";
import { IncomingRequestCard } from "./IncomingRequestCard";

const NotificationsList = () => {
  const { data: inReqs, isPending: isIncomingReqsPending } = useQuery({
    queryKey: ["incoming-requests"],
    queryFn: async () => {
      return await contactApi.getIncomingRequests();
    },
  });

  const { data: sentReqs, isPending: isSentReqsPending } = useQuery({
    queryKey: ["sent-requests"],
    queryFn: async () => {
      return await contactApi.getSentRequests();
    },
  });

  const incomingRequests: Contact[] = inReqs?.requests || [];
  const sentRequests: Contact[] = sentReqs?.requests || [];

  const isPending = isIncomingReqsPending || isSentReqsPending;

  return (
    <div className="bg-gray-50 border-r border-gray-200 flex flex-col w-full md:w-[40%]">
      {/* Header */}
      <div className="flex items-center gap-2 p-2 pt-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <circle cx="6" cy="12" r="2" />
            <circle cx="18" cy="12" r="2" />
            <path d="M8.5 12h7" />
          </svg>
        </div>
        <h1 className="font-bold text-xl tracking-tight">Connecto</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isPending && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
          </div>
        )}

        {!isPending && incomingRequests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-yellow-700">
                  {incomingRequests.length}
                </span>
              </div>
              Incoming Requests
            </h3>
            <div className="space-y-3">
              {incomingRequests.map((request) => (
                <IncomingRequestCard key={request._id} request={request} />
              ))}
            </div>
          </div>
        )}

        {!isPending && sentRequests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-700">
                  {sentRequests.length}
                </span>
              </div>
              Sent Requests
            </h3>
            <div className="space-y-3">
              {sentRequests.map((request) => (
                <SentRequestCard key={request._id} request={request} />
              ))}
            </div>
          </div>
        )}

        {!isPending &&
          incomingRequests.length === 0 &&
          sentRequests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-600 font-medium mb-2">No Requests</p>
              <p className="text-gray-500 text-sm text-center mb-4">
                You don't have any pending contact requests
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Click on the</span>
                <UserPlus className="text-yellow-600" size={16} />
                <span>button to add contacts</span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default NotificationsList;
