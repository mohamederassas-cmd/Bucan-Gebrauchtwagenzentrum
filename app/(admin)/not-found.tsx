import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-8 shadow-card border border-[#E2E8F0] text-center max-w-md">
        <p className="text-[#2563EB] font-accent text-sm tracking-wider uppercase mb-2">404</p>
        <h1 className="font-display text-2xl text-[#0F172A] font-bold mb-2">Seite nicht gefunden</h1>
        <p className="text-[#475569] text-sm mb-6">Diese Admin-Seite existiert nicht.</p>
        <Link href="/admin/dashboard" className="btn-primary inline-block px-6 py-3 rounded-lg text-sm">
          Zum Dashboard
        </Link>
      </div>
    </div>
  );
}
