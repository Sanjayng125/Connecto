import { useState, useRef } from "react";
import {
  User,
  Mail,
  Calendar,
  Camera,
  Pencil,
  Save,
  X,
  Loader2,
  LogOut,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";

const Settings = () => {
  const { user, clearAuth, setUser } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      setUser(data.user);
      setIsEditingUsername(false);
      setAvatarPreview(null);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      navigate("/login");
      toast.success("Logged out successfully");
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // max 2MB
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUsername = () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    if (newUsername === user?.username) {
      setIsEditingUsername(false);
      return;
    }

    updateProfileMutation.mutate({ username: newUsername });
  };

  const handleSaveAvatar = () => {
    if (selectedFile) {
      updateProfileMutation.mutate({
        avatar: selectedFile,
        username: newUsername,
      });
    }
  };

  const handleCancelAvatar = () => {
    setAvatarPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full flex justify-center bg-linear-to-br from-gray-50 to-gray-100 md:p-4 overflow-y-auto">
      <div className="w-full h-fit md:max-w-2xl bg-white md:rounded-2xl shadow-xl p-2 sm:p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-5xl shadow-lg overflow-hidden">
              {avatarPreview || user.avatar ? (
                <img
                  src={avatarPreview || user.avatar?.url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={48} className="text-white" />
              )}
            </div>

            <button
              onClick={handleAvatarClick}
              className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="text-white" size={32} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {selectedFile && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveAvatar}
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Avatar
              </button>
              <button
                onClick={handleCancelAvatar}
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors disabled:bg-gray-100"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Click to upload • Max 2MB • JPG, PNG, GIF
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <User size={16} />
                Username
              </label>
              {!isEditingUsername && (
                <button
                  onClick={() => {
                    setIsEditingUsername(true);
                    setNewUsername(user.username);
                  }}
                  className="text-yellow-600 hover:text-yellow-700"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>

            {isEditingUsername ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Enter username"
                  autoFocus
                />
                <button
                  onClick={handleSaveUsername}
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                </button>
                <button
                  onClick={() => setIsEditingUsername(false)}
                  disabled={updateProfileMutation.isPending}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <p className="text-gray-800 font-medium">{user.username}</p>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
              <Mail size={16} />
              Email
            </label>
            <p className="text-gray-800 font-medium">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-2">
              <Calendar size={16} />
              Member Since
            </label>
            <p className="text-gray-800 font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-gray-400 font-medium"
        >
          {logoutMutation.isPending ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut size={20} />
              Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Settings;
