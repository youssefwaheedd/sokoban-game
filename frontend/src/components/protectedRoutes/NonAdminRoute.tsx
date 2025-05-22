import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoaderCircleIcon } from "lucide-react";

const NonAdminRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-2xl text-foreground">
          <LoaderCircleIcon className="h-8 w-8 animate-spin" />
          <span>Loading Page...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default NonAdminRoute;
