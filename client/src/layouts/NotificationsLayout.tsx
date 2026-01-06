import { Outlet } from "react-router";
import NotificationsList from "../components/NotificationsList";

const NotificationsLayout = () => {
  return (
    <div className="flex h-full w-full bg-gray-100">
      <NotificationsList />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default NotificationsLayout;
