import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminEntry() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Visiting /admin always starts a fresh admin login session.
    localStorage.removeItem("admin-token");

    setLocation("/admin/login");
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <p className="text-slate-400">
        Redirecting to admin login...
      </p>
    </div>
  );
}