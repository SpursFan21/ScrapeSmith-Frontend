"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (!token) {
      router.push('/login'); // Redirect to login if no token
    }
  }, [token, router]);

  return token ? <>{children}</> : null; // Render children only if token exists
};

export default ProtectedRoute;