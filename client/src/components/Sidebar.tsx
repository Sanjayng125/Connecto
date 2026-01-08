import { Bell, LogOut, Phone, Settings, User, UserPlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation, Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import { useState } from "react";

export const Sidebar = () => {
  const navigate = useNavigate();
  const { clearAuth, user } = useAuthStore();
  const queryClient = useQueryClient();
  const pathname = useLocation().pathname;
  const hideSideBar = ["/contact/", "/add-contact/"].some((path) =>
    pathname.startsWith(path)
  );
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    navigate("/login");
    toast.success("Logged from this device successfully.");
  };

  return (
    <div
      className={`bg-linear-to-b from-yellow-700 to-yellow-800 flex flex-col items-center px-1 sm:px-2 md:px-3 py-6 space-y-8 ${
        hideSideBar && "max-md:hidden"
      }`}
    >
      <button
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl cursor-pointer disabled:cursor-default"
        onClick={() => setShowAvatarModal(true)}
        disabled={!user?.avatar}
      >
        {user?.avatar ? (
          <img
            src={user.avatar.url}
            alt="Avatar"
            className="w-full aspect-square rounded-full object-cover"
          />
        ) : (
          <User size={26} />
        )}
      </button>

      <div className="flex flex-col space-y-4 flex-1">
        <Link
          to="/contact"
          className={`text-white cursor-pointer hover:scale-110 transition-transform p-2 ${
            pathname.startsWith("/contact") && "bg-black/30 rounded-full"
          }`}
        >
          <Phone />
        </Link>
        <Link
          to="/add-contact"
          className={`text-white cursor-pointer hover:scale-110 transition-transform p-2 ${
            pathname.startsWith("/add-contact") && "bg-black/30 rounded-full"
          }`}
        >
          <UserPlus />
        </Link>
        <Link
          to="/notifications"
          className={`text-white cursor-pointer hover:scale-110 transition-transform p-2 ${
            pathname.startsWith("/notifications") && "bg-black/30 rounded-full"
          }`}
        >
          <Bell />
        </Link>
      </div>

      <Link
        to="/settings"
        className={`text-white cursor-pointer hover:scale-110 transition-transform p-2 ${
          pathname.startsWith("/settings") && "bg-black/30 rounded-full"
        }`}
      >
        <Settings />
      </Link>
      <button
        onClick={handleLogout}
        className="text-white cursor-pointer hover:scale-110 transition-transform p-2 hover:text-red-500"
      >
        <LogOut />
      </button>

      {showAvatarModal && user?.avatar && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4"
          onClick={() => setShowAvatarModal(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md p-4">
            <img
              src={user?.avatar?.url}
              alt="Avatar"
              className="w-full aspect-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
