import { memo } from "react";
import { useLocation, useNavigate } from "react-router";
import type { User } from "../types";
import { formatDate } from "../utils";

interface UserItemProps {
  user: User;
}

export const UserItem = memo(function UserItem({ user }: UserItemProps) {
  const navigate = useNavigate();
  const isSelected = useLocation().pathname === `/add-contact/${user._id}`;

  const handleUserClick = (contactId: string) => {
    navigate(`/add-contact/${contactId}`);
  };

  return (
    <div
      onClick={() => {
        handleUserClick(user._id);
      }}
      className={`p-2 rounded-xl cursor-pointer transition-all ${
        isSelected ? "bg-white shadow-md" : "hover:bg-white hover:shadow-sm"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-lg text-white font-semibold">
            {user.avatar ? (
              <img
                src={user.avatar.url}
                alt="Avatar"
                className="w-full aspect-square rounded-full object-cover"
              />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-800 text-sm truncate">
              {user.username}
            </h4>
            <span className="text-xs text-gray-500">
              {formatDate(user.createdAt)}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
      </div>
    </div>
  );
});
