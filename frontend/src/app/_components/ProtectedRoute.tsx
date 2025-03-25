// frontend\src\app\_components\ProtectedRoute.tsx
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  return token ? <>{children}</> : null;
};

export default ProtectedRoute;
