import { memo } from "react";
import { useLocation, useNavigate } from "react-router";
import type { Contact } from "../types";
import { formatTime } from "../utils";
import { Star } from "lucide-react";

interface ContactItemProps {
  contact: Contact;
}

export const ContactItem = memo(function ContactItem({
  contact,
}: ContactItemProps) {
  const navigate = useNavigate();
  const isSelected = useLocation().pathname === `/contact/${contact.contactId}`;

  const handleContactClick = (contactId: string) => {
    navigate(`/contact/${contactId}`);
  };

  return (
    <div
      onClick={() => {
        handleContactClick(contact.contactId);
      }}
      className={`p-2 rounded-xl cursor-pointer transition-all ${
        isSelected ? "bg-white shadow-md" : "hover:bg-white hover:shadow-sm"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-lg text-white font-semibold">
            {contact.contactUser.avatar ? (
              <img
                src={contact.contactUser.avatar.url}
                alt="Avatar"
                className="w-full aspect-square rounded-full object-cover"
              />
            ) : contact.nickname ? (
              contact.nickname.charAt(0).toUpperCase()
            ) : (
              contact.contactUser.username.charAt(0).toUpperCase()
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-800 text-sm truncate">
                {contact?.nickname || contact?.contactUser?.username}
              </h4>
              {contact.isFavorite && (
                <Star size={18} className="text-yellow-500 fill-yellow-500" />
              )}
            </div>
            {contact?.contactUser?.lastSeen && (
              <span className="text-xs text-gray-500">
                {formatTime(contact.contactUser.lastSeen)}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">
            {contact.contactUser.email}
          </p>
        </div>
      </div>
    </div>
  );
});
