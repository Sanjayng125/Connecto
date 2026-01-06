import { Outlet } from "react-router";
import { ContactList } from "../components/ContactList";

const ContactLayout = () => {
  return (
    <div className="flex h-full w-full bg-gray-100">
      <ContactList />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ContactLayout;
