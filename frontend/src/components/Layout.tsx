import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-primary">
                  ProjectHub
                </span>
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                {/* Mobile hamburger button */}
                <div className="flex items-center md:hidden ml-3">
                  <button
                    aria-label="Toggle menu"
                    onClick={() => setMobileOpen((s) => !s)}
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    {mobileOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/projects"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <FolderKanban className="h-4 w-4" />
                    Projects
                  </Link>
                  <Link
                    to="/tasks"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <ListTodo className="h-4 w-4" />
                    Tasks
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Projects
            </Link>
            <Link
              to="/tasks"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Tasks
            </Link>
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
