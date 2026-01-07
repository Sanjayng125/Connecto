import { Outlet } from "react-router";
import TopNotice from "../components/TopNotice";

const PublicLayout = () => {
  return (
    <div className="flex flex-col bg-linear-to-br from-yellow-500 via-yellow-600 to-yellow-700">
      <TopNotice />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
