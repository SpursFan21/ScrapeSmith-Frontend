// frontend/src/app/_components/AuthReset.tsx
'use client';

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCredentials } from "@/redux/authSlice";

export default function AuthReset() {
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAdmin");
    dispatch(clearCredentials());
    console.log("🔐 Cleared stale tokens and Redux auth state on initial client load");
  }, []);

  return null; // invisible component
}
