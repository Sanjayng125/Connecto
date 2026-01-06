import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  UserPlus,
  User,
  Clock,
  Mail,
  AtSign,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { contactApi } from "../api/contact";
import type { Contact, User as UserType } from "../types";
import { useAuthStore } from "../store/useAuthStore";
import { formatDate } from "../utils";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: me } = useAuthStore();

  const { data: user, isLoading: userLoading } = useQuery<UserType>({
    queryKey: ["user", id],
    queryFn: () => contactApi.getUser(id!),
    enabled: !!id,
  });

  const {
    data: contactStatus,
    isLoading: statusLoading,
    error,
  } = useQuery<Contact>({
    queryKey: ["contactStatus", id],
    queryFn: () => contactApi.getContact(id!),
    enabled: !!id,
  });

  const sendRequestMutation = useMutation({
    mutationFn: contactApi.sendContactRequest,
    onSuccess: () => {
      toast.success("Contact request sent");
      queryClient.invalidateQueries({ queryKey: ["contactStatus", id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send request");
    },
  });

  const respondToRequestMutation = useMutation({
    mutationFn: (action: "accepted" | "blocked") =>
      contactApi.respondToContactRequest(id!, action),
    onSuccess: () => {
      toast.success("Contact request updated");
      queryClient.invalidateQueries({ queryKey: ["contactStatus", id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update request");
    },
  });

  const handleSendRequest = () => {
    if (id) {
      sendRequestMutation.mutate(id);
    }
  };

  const handleRespondToRequest = (action: "accepted" | "blocked") => {
    if (id) {
      respondToRequestMutation.mutate(action);
    }
  };

  const isLoading = userLoading || statusLoading;

  if (isLoading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-yellow-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-red-600" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-6">This user doesn't exist</p>
          <button
            onClick={() => navigate("/add-contact")}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="w-full border-b border-gray-200 flex items-center p-3 gap-2">
        <button
          onClick={() => navigate("/add-contact")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>

        <h1 className="text-lg font-semibold text-gray-800">User Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-2 sm:px-6 py-8">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-5xl shadow-lg">
                {user.avatar ? (
                  <img
                    src={user.avatar.url}
                    alt="Avatar"
                    className="w-full aspect-square rounded-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>

              {contactStatus?.status === "accepted" && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <CheckCircle size={20} className="text-white" />
                </div>
              )}
              {contactStatus?.status === "pending" && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
                  <Clock size={20} className="text-white" />
                </div>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                {user.username}
              </h2>
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <InfoCard
              icon={<AtSign size={20} className="text-gray-600" />}
              label="Username"
              value={user.username}
            />

            <InfoCard
              icon={<Mail size={20} className="text-gray-600" />}
              label="Email"
              value={user.email}
            />

            <InfoCard
              icon={<Clock size={20} className="text-gray-600" />}
              label="Member Since"
              value={formatDate(user.createdAt)}
            />
          </div>

          <div className="space-y-3">
            {(error || !contactStatus) && (
              <button
                onClick={handleSendRequest}
                disabled={sendRequestMutation.isPending}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl transition-colors shadow-md disabled:bg-gray-400"
              >
                {sendRequestMutation.isPending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span className="font-semibold">Sending...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span className="font-semibold">Send Contact Request</span>
                  </>
                )}
              </button>
            )}

            {contactStatus?.status === "pending" &&
              contactStatus.initiatedBy === me?._id.toString() && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                  <Clock className="mx-auto mb-2 text-yellow-600" size={24} />
                  <p className="font-medium text-yellow-900">Request Pending</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Waiting for {user.username} to accept
                  </p>
                </div>
              )}

            {contactStatus?.status === "pending" &&
              contactStatus.initiatedBy !== me?._id.toString() && (
                <>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                    <UserPlus
                      className="mx-auto mb-2 text-blue-600"
                      size={24}
                    />
                    <p className="font-medium text-blue-900">
                      Incoming Request
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {user.username} wants to add you as a contact
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      Check your contact requests to respond
                    </p>
                  </div>

                  <div className="flex items-center gap-2 max-sm:flex-wrap">
                    <button
                      onClick={() => handleRespondToRequest("accepted")}
                      disabled={respondToRequestMutation.isPending}
                      className="w-full px-6 py-3 bg-green-50 hover:bg-green-100 text-green-600 font-medium rounded-lg transition-colors disabled:bg-gray-200"
                    >
                      {statusLoading ? "Accepting..." : "Accept Request"}
                    </button>
                    <button
                      onClick={() => handleRespondToRequest("blocked")}
                      disabled={respondToRequestMutation.isPending}
                      className="w-full px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors disabled:bg-gray-200"
                    >
                      {statusLoading ? "Blocking..." : "Block User"}
                    </button>
                  </div>
                </>
              )}

            {contactStatus?.status === "accepted" && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                <CheckCircle
                  className="mx-auto mb-2 text-green-600"
                  size={24}
                />
                <p className="font-medium text-green-900">
                  Already in Contacts
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {user.username} is already in your contact list
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span>ℹ️</span> About Contact Requests
            </h3>
            <p className="text-sm text-gray-600">
              Once {user.username} accepts your request, you'll be able to call
              them and they'll appear in your contacts list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
      <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}

export default UserProfile;
