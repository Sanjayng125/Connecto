import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Contact } from "../types";
import { contactApi } from "../api/contact";
import { toast } from "react-toastify";
import { Calendar, Check, Clock, Loader2, Mail, User, X } from "lucide-react";
import { formatDate, formatTime } from "../utils";

export function IncomingRequestCard({ request }: { request: Contact }) {
  const queryClient = useQueryClient();
  const user = request.contactUser;

  const respondMutation = useMutation({
    mutationFn: (action: "accepted" | "blocked") =>
      contactApi.respondToContactRequest(request.contactId, action),
    onSuccess: (_, action) => {
      toast.success(
        action === "accepted" ? "Request accepted" : "Request blocked"
      );
      queryClient.invalidateQueries({ queryKey: ["incoming-requests"] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: () => {
      toast.error("Failed to respond to request");
    },
  });

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shrink-0">
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

      <div className="flex items-center gap-1 text-xs text-gray-400 mb-3 pl-0.5">
        <Clock size={12} />
        <span>{formatTime(request.createdAt)}</span>
      </div>

      <div className="flex gap-2 max-sm:flex-wrap">
        <button
          onClick={() => respondMutation.mutate("accepted")}
          disabled={respondMutation.isPending}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
        >
          {respondMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Check size={16} />
          )}
          Accept
        </button>

        <button
          onClick={() => respondMutation.mutate("blocked")}
          disabled={respondMutation.isPending}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
        >
          {respondMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <X size={16} />
          )}
          Block
        </button>
      </div>
    </div>
  );
}
