import React from "react";
import { Menu, Bell } from "lucide-react";
import { HeaderProps } from "@/types";
import { useSession } from "next-auth/react";

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { data: session } = useSession();

  // Ambil data shop
  const user = session?.user;
  const userName = user?.name || "Superadmin";

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-6 relative z-10">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-2">
          <span className="hidden sm:block text-sm font-medium text-gray-700">
           {userName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
