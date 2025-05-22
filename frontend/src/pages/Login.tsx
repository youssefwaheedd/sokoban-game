import { useEffect } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <LoginForm className="max-w-96" />
    </div>
  );
};

export default Login;
