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
import { FcGoogle } from "react-icons/fc";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { LockIcon } from "lucide-react";
import axios from "axios";
import { registerUser as registerUserService } from "../../services/auth/authServices";
import { useAuth } from "@/context/AuthContext";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();
  const { login: authContextLogin } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setConfirmPasswordError("");

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const responseData = await registerUserService(email, password, username);
      if (responseData.token && responseData.user) {
        await authContextLogin(responseData.token, responseData.user);
        navigate("/", { replace: true });
      } else {
        setError(
          responseData.message ||
            "Registration failed: Invalid response from server."
        );
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data?.message || "Registration failed. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message || "Registration failed. Please try again.");
      } else {
        setError("An unexpected error occurred during registration.");
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
              <LockIcon className="h-12 w-12" />
            </Link>
            <span className="w-2/3 flex flex-col items-start text-center">
              <span className="font-bold">Create an account</span>
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
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    aria-label={
                      confirmPasswordVisible ? "Hide password" : "Show password"
                    }
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {confirmPasswordVisible ? (
                      <HiEyeOff size={20} />
                    ) : (
                      <HiEye size={20} />
                    )}
                  </button>
                </div>
              </div>
              {confirmPasswordError && (
                <div className="text-sm text-red-500">
                  {confirmPasswordError}
                </div>
              )}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </div>
            {error && (
              <div className="mt-4 text-center text-sm text-red-500">
                {error}
              </div>
            )}
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
