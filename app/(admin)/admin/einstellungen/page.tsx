import AdminLayout from "@/components/admin/AdminLayout";
import PasswordChangeForm from "@/components/admin/PasswordChangeForm";
import { requireAdmin } from "@/lib/auth";
import { isUsingBootstrapPassword } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();
  const usingDefault = await isUsingBootstrapPassword();

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl text-[#0F172A] font-bold">Einstellungen</h1>
          <p className="text-[#475569] text-sm mt-1">Passwort und Zugang verwalten</p>
        </div>
        <PasswordChangeForm usingDefaultPassword={usingDefault} />
      </div>
    </AdminLayout>
  );
}
