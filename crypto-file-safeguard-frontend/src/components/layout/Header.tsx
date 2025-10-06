// This file is already correct and requires no changes.
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full p-4">
      <nav className="container mx-auto flex h-14 max-w-screen-lg items-center justify-between rounded-full border border-white/10 bg-gray-800/50 p-6 text-white shadow-lg backdrop-blur-md">
        <Link to="/" className="text-xl font-bold">
          SecureVault
        </Link>
        {isLoggedIn && (
          <div className="hidden md:flex gap-8">
            <Link
              to="/"
              className="font-medium hover:text-gray-300 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/files"
              className="font-medium hover:text-gray-300 transition-colors"
            >
              My Files
            </Link>
            <Link
              to="/contact"
              className="font-medium hover:text-gray-300 transition-colors"
            >
              Contact
            </Link>
          </div>
        )}
        <div className="flex items-center justify-end w-24">
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.profilePictureUrl || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      <UserIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer"
                >
                  My Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-8">
              <Link
                to="/contact"
                className="font-medium hover:text-gray-300 transition-colors"
              >
                Contact
              </Link>
              <Link
                to="/register"
                className="font-medium hover:text-gray-300 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
export default Header;
