import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { adminService } from "@/services/adminService";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("admin@temple.com");
  const [password, setPassword] = useState("Admin@1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      setLocation("/admin/dashboard");
    }
  }, [setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await adminService.login(email, password);
      if (response.success) {
        localStorage.setItem("admin-token", response.token);
        setLocation("/admin/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-3xl font-semibold">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-300">Secure access to the Mahashakti Peeta admin dashboard.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" required />
          </div>
          <div>
            <label className="mb-2 block text-sm">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" required />
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#D4AF37] px-4 py-3 font-semibold text-slate-900 transition hover:bg-[#f5d46f]">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
