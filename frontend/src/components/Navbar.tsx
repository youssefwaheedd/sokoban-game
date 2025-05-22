import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-dark-purple border-b border-light-purple">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() =>
                navigate(user?.role === "ADMIN" ? "/admin" : "/home")
              }
              className="text-2xl font-bold text-light-purple hover:text-white transition-colors"
            >
              Sokoban
            </button>
          </div>

          <div className="flex items-center gap-8">
            {user ? (
              <>
                <span className="text-light-purple">
                  Welcome, <span className="capitalize">{user.username}</span>
                </span>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-light-purple border-light-purple hover:bg-light-purple hover:text-dark-purple"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="text-light-purple border-light-purple hover:bg-light-purple hover:text-dark-purple"
                >
                  Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/register")}
                  className="text-light-purple border-light-purple hover:bg-light-purple hover:text-dark-purple"
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
