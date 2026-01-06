import { Outlet } from "react-router";
import { AddContactList } from "../components/AddContactList";

const AddContactLayout = () => {
  return (
    <div className="flex h-full w-full bg-gray-100">
      <AddContactList />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AddContactLayout;
