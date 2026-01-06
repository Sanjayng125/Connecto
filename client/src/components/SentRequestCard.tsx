import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Contact } from "../types";
import { contactApi } from "../api/contact";
import { toast } from "react-toastify";
import { Calendar, Clock, Loader2, Mail, User, X } from "lucide-react";
import { formatDate, formatTime } from "../utils";

export function SentRequestCard({ request }: { request: Contact }) {
  const queryClient = useQueryClient();
  const user = request.contactUser;

  const cancelMutation = useMutation({
    mutationFn: () => contactApi.deleteContact(request.contactId),
    onSuccess: () => {
      toast.success("Request cancelled");
      queryClient.invalidateQueries({ queryKey: ["sent-requests"] });
    },
    onError: () => {
      toast.error("Failed to cancel request");
    },
  });

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar.url}
              alt="Avatar"
              className="w-full aspect-square rounded-full object-cover"
            />
          ) : (
            <User size={20} className="text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 truncate">
            {user.username}
          </h4>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <Mail size={12} />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <Calendar size={12} />
            <span>Joined {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-yellow-700">Pending</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock size={12} />
          <span>{formatTime(request.createdAt)}</span>
        </div>
      </div>

      <button
        onClick={() => cancelMutation.mutate()}
        disabled={cancelMutation.isPending}
        className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        {cancelMutation.isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Cancelling...
          </>
        ) : (
          <>
            <X size={16} />
            Cancel Request
          </>
        )}
      </button>
    </div>
  );
}
