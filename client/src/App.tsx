import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Signup from "./pages/auth/Signup";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./store/useAuthStore";
import Login from "./pages/auth/Login";
import { ToastContainer } from "react-toastify";
import MainLayout from "./layouts/MainLayout";
import Call from "./pages/Call";
import ContactProfile from "./pages/ContactProfile";
import AddContact from "./pages/AddContact";
import ContactLayout from "./layouts/ContactLayout";
import AddContactLayout from "./layouts/AddContactLayout";
import UserProfile from "./pages/UserProfile";
import NotificationsLayout from "./layouts/NotificationsLayout";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import PublicLayout from "./layouts/PublicLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.user);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.user);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/contact" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        aria-label={""}
        hideProgressBar
        position="bottom-right"
        stacked
      />

      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index path="/" element={<Home />} />

            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route element={<MainLayout />}>
              <Route element={<ContactLayout />}>
                <Route
                  index
                  path="/contact"
                  element={
                    <ProtectedRoute>
                      <Call />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contact/:id"
                  element={
                    <ProtectedRoute>
                      <ContactProfile />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route element={<AddContactLayout />}>
                <Route
                  index
                  path="/add-contact"
                  element={
                    <ProtectedRoute>
                      <AddContact />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-contact/:id"
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route element={<NotificationsLayout />}>
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
              </Route>

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
