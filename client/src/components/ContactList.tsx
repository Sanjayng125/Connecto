import { Loader2, Search, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { contactApi } from "../api/contact";
import type { Contact } from "../types";
import { useLocation } from "react-router";
import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { ContactItem } from "./ContactItem";

export const ContactList = () => {
  const isContactSelected = useLocation().pathname.startsWith("/contact/");
  const [seachInput, setSeachInput] = useState("");
  const debouncedQuery = useDebounce(seachInput, 400, 2);

  const { data, isPending } = useQuery({
    queryKey: ["contacts", debouncedQuery],
    queryFn: async () => {
      return await contactApi.getContacts(debouncedQuery);
    },
  });

  const contacts: Contact[] = data?.contacts || [];

  return (
    <div
      className={`bg-gray-50 border-r border-gray-200 flex flex-col max-md:w-full lg:w-[30%] lg:max-w-87.5 ${
        isContactSelected && "max-md:hidden"
      }`}
    >
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

      <div className="p-2 pb-0">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={seachInput}
            onChange={(e) => setSeachInput(e.target.value)}
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto p-2">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Contacts</h3>

        {isPending && <Loader2 className="m-auto my-2 animate-spin" />}

        <div className="space-y-2">
          {contacts.length > 0 &&
            contacts.map((contact) => (
              <ContactItem key={contact._id} contact={contact} />
            ))}

          {contacts.length === 0 && !isPending && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="text-gray-400" size={32} />
              </div>
              <p className="text-gray-600 font-medium mb-2">
                No contacts found
              </p>
              <p className="text-gray-500 text-sm text-center mb-4">
                You don't have any contacts added yet
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
    </div>
  );
};
