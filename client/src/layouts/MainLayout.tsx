import { Outlet } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { SocketProvider } from "../context/SocketContext";
import { WebRTCProvider } from "../context/WebRTCContext";
import { GlobalIncomingCallModal } from "../components/GlobalIncomingCallModal";
import { ActiveCallIndicator } from "../components/ActiveCallIndicator";

const MainLayout = () => {
  return (
    <SocketProvider>
      <WebRTCProvider>
        <GlobalIncomingCallModal />
        <ActiveCallIndicator />

        <div className="h-dvh flex items-center justify-center bg-linear-to-br from-yellow-500 via-yellow-600 to-yellow-700 md:p-8 overflow-hidden">
          <div className="flex h-full w-full max-w-7xl">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </WebRTCProvider>
    </SocketProvider>
  );
};

export default MainLayout;
