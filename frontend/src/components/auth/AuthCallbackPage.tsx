import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoaderCircleIcon } from "lucide-react";

const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const authError = queryParams.get("error");

    if (authError) {
      setError(`Authentication failed: ${authError}`);
      setProcessing(false);
      setTimeout(() => navigate("/login", { replace: true }), 3000);
      return;
    }

    if (token) {
      login(token)
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.error("Error processing auth token:", err);
          setError(
            "Failed to process authentication. Please try logging in again."
          );
          setProcessing(false);
          setTimeout(() => navigate("/login", { replace: true }), 3000);
        });
    } else {
      setError("No authentication token found. Redirecting to login.");
      setProcessing(false);
      setTimeout(() => navigate("/login", { replace: true }), 3000);
    }
  }, [location.search, navigate, login]);

  if (processing) {
    return (
      <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-2xl text-foreground">
          <LoaderCircleIcon className="h-8 w-8 animate-spin" />
          <span>Proccessing authentication...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2 text-2xl text-foreground">
          <p>Error: {error}</p>
          <p>You will be redirected to the login page shortly.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallbackPage;
