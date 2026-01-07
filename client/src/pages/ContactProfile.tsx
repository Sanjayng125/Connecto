import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Phone,
  Trash2,
  Star,
  ArrowLeft,
  UserPlus,
  Pencil,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { contactApi } from "../api/contact";
import { formatDate, formatTime } from "../utils";
import type { Contact } from "../types";
import { useWebRTC } from "../context/WebRTCContext";

const ContactProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState("");
  const { initiateCall } = useWebRTC();

  const {
    data: contact,
    isLoading,
    error,
  } = useQuery<Contact>({
    queryKey: ["contact", id],
    queryFn: () => contactApi.getContact(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: contactApi.deleteContact,
    onSuccess: () => {
      toast.success("Contact removed successfully");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      navigate("/contact");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove contact");
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (isFavorite: boolean) =>
      contactApi.updateContact(contact?._id!, { isFavorite }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact", id] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contact updated");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update");
    },
  });

  const updateNicknameMutation = useMutation({
    mutationFn: (nickname: string) =>
      contactApi.updateContact(contact?._id!, { nickname }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact", id] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Nickname updated");
      setIsEditingNickname(false);
    },
    onError: (error: any) => {
      if (error?.response?.status === 422) {
        toast.error("Invalid nickname");
        return;
      }

      toast.error(error.response?.data?.message || "Failed to update nickname");
    },
  });

  const handleDelete = () => {
    if (contact?.contactId) {
      deleteMutation.mutate(contact.contactId);
    }
  };

  const handleCall = () => {
    if (!contact) return;
    initiateCall({
      userId: contact.contactId,
      username: contact.contactUser.username,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact...</p>
        </div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-red-600" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Contact Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            This contact doesn't exist or has been removed
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const contactUser = contact.contactUser;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="w-full border-b border-gray-200 flex items-center p-3 gap-2">
        <button
          onClick={() => navigate("/contact")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>

        <h1 className="text-lg font-semibold text-gray-800 text-center">
          Contact Profile
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-5xl shadow-lg">
                {contactUser.avatar ? (
                  <img
                    src={contactUser.avatar.url}
                    alt="Avatar"
                    className="w-full aspect-square rounded-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
              {contact.isFavorite && (
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
                  <Star size={20} className="text-white fill-white" />
                </div>
              )}
            </div>

            <div className="mt-3">
              {isEditingNickname ? (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Enter nickname"
                    className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    autoFocus
                  />
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateNicknameMutation.mutate(nickname)}
                      disabled={updateNicknameMutation.isPending}
                      className="px-4 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingNickname(false)}
                      className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    {contact.nickname || contactUser.username}
                  </h2>
                  <button
                    onClick={() => {
                      setNickname(contact.nickname || "");
                      setIsEditingNickname(true);
                    }}
                    className="text-yellow-600 hover:text-yellow-700"
                  >
                    <Pencil size={20} />
                  </button>
                </div>
              )}

              {contact.nickname && (
                <p className="text-gray-500 mt-1">@{contactUser.username}</p>
              )}
              <p className="text-gray-400 text-sm mt-1">{contactUser.email}</p>
            </div>
          </div>

          <div className="w-full flex justify-center mb-4">
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-3 p-3 px-8 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors shadow-md"
            >
              <Phone size={24} />
              <span className="font-semibold">Call</span>
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <InfoCard
              label="Added On"
              value={formatDate(contact.addedAt || contact.createdAt)}
            />

            <InfoCard
              label="Last Seen"
              value={
                contactUser.lastSeen
                  ? formatTime(contactUser.lastSeen)
                  : "Unknown"
              }
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={() => toggleFavoriteMutation.mutate(!contact.isFavorite)}
              disabled={toggleFavoriteMutation.isPending}
              className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Star
                  size={20}
                  className={
                    contact.isFavorite
                      ? "text-yellow-600 fill-yellow-600"
                      : "text-gray-600"
                  }
                />
                <span className="font-medium text-gray-800">
                  {contact.isFavorite
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </span>
              </div>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between px-6 py-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={20} className="text-red-600" />
                <span className="font-medium text-red-600">Remove Contact</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} className="text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Remove Contact?
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to remove{" "}
              <strong>{contactUser.username}</strong> from your contacts? This
              action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:bg-gray-400"
              >
                {deleteMutation.isPending ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-6 py-4 bg-gray-50 rounded-xl">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
}

export default ContactProfile;
