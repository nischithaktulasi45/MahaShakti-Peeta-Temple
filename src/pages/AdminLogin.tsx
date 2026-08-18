import {  useEffect , useState } from "react";
import { useLocation } from "wouter";
import { adminService } from "@/services/adminService";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

 useEffect(() => {
  const token = localStorage.getItem("admin-token");

  if (!token) {
    setLocation("/admin/login");
    return;
  }

  // load dashboard...
}, [setLocation]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerificationMessage(null);
    setVerificationError(null);

    try {
      const response = await adminService.login(email, password);
      if (response.success) {
        localStorage.setItem("admin-token", response.token);
        setLocation("/admin/dashboard");
      } else {
        const message = response.message || "Login failed";
        setError(message);
        if (response.verificationRequired) {
          setVerificationError(message);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setVerificationMessage(null);
    setVerificationError(null);

    try {
      const response = await adminService.resendVerification(email);
      if (response.success) {
        setVerificationMessage(response.message || "Verification email sent.");
      } else {
        setVerificationError(response.message || "Unable to resend verification email.");
      }
    } catch (err: unknown) {
      setVerificationError(err instanceof Error ? err.message : "Unable to resend verification email.");
    } finally {
      setResendLoading(false);
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
          {verificationError ? <p className="text-sm text-yellow-300">{verificationError}</p> : null}
          {verificationMessage ? <p className="text-sm text-green-300">{verificationMessage}</p> : null}
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#D4AF37] px-4 py-3 font-semibold text-slate-900 transition hover:bg-[#f5d46f]">
            {loading ? "Signing in..." : "Login"}
          </button>
          {verificationError ? (
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendLoading}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {resendLoading ? "Resending..." : "Resend Verification Email"}
            </button>
          ) : null}
        </form>
      </div>
    </div>
  );
}
