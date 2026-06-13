"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Falsches Passwort. Bitte versuchen Sie es erneut.");
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        {/* Card */}
        <div className="bg-white rounded-xl p-8 shadow-card border border-[#E2E8F0]">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/logo.svg"
              alt="BUCAN AUTOMOBILE"
              width={180}
              height={40}
              className="h-9 w-auto mx-auto mb-3"
            />
            <p className="text-[#475569] text-sm font-accent tracking-wider">Admin-Bereich</p>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full flex items-center justify-center">
              <Lock size={24} className="text-[#2563EB]" />
            </div>
          </div>

          <h1 className="text-center font-display text-xl text-[#0F172A] font-semibold mb-6">Anmelden</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Password */}
            <div>
              <label className="block text-[#475569] text-xs font-accent tracking-wider uppercase mb-2">
                Passwort
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white border border-[#E2E8F0] rounded-lg px-4 py-3 text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 pr-12 text-sm transition-colors"
                  style={{ borderColor: error ? "#ef4444" : undefined }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-xs mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} /> Anmelden
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#94A3B8] mt-6">
            BUCAN AUTOMOBILE · Interner Bereich
          </p>
        </div>
      </div>
    </div>
  );
}
