import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Lock } from "lucide-react";
import axios from "axios";
import { loginUser as loginUserService } from "../../services/auth/authServices";
import { useAuth } from "@/context/AuthContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);

  const navigate = useNavigate();
  const { login: authContextLogin } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const responseData = await loginUserService(email, password);

      if (responseData.token && responseData.user) {
        await authContextLogin(responseData.token, responseData.user);
        navigate("/", { replace: true });
      } else {
        setError("Login failed: Invalid response from server.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data?.message || "Login failed. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message || "Login failed. Please try again.");
      } else {
        setError("An unexpected error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 p-3 w-full", className)} {...props}>
      <Card>
        <CardHeader>
          <CardDescription className="text-center flex items-center">
            <Link to={"/"} className="w-1/3">
              <Lock className="h-12 w-12" />
            </Link>
            <span className="w-2/3 flex flex-col items-start text-center">
              <span className="font-bold">Sign in to your account</span>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  readOnly={isReadOnly}
                  onFocus={() => setIsReadOnly(false)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="relative">
                  <Label htmlFor="password" className="mb-2">
                    Password
                  </Label>
                  <Input
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="********"
                    readOnly={isReadOnly}
                    onFocus={() => setIsReadOnly(false)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                    className="absolute right-2 top-1/2 mt-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <HiEyeOff size={20} />
                    ) : (
                      <HiEye size={20} />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
            {error && (
              <div className="mt-4 text-center text-sm text-red-500">
                {error}
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="underline underline-offset-4">
                Register
              </Link>
            </div>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
