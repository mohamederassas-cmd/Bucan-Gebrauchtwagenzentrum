import { requireAdmin } from "@/lib/auth";
import { listInquiries } from "@/lib/inquiries";
import { isMailConfigured } from "@/lib/mail";
import AdminLayout from "@/components/admin/AdminLayout";
import InquiryList from "@/components/admin/InquiryList";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  await requireAdmin();
  const inquiries = await listInquiries();
  const open = inquiries.filter((i) => i.status === "new").length;
  const mailConfigured = isMailConfigured();

  return (
    <AdminLayout openInquiries={open}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-2xl text-[#0F172A] font-bold">Anfragen</h1>
          <p className="text-[#475569] text-sm mt-1">
            {inquiries.length} Anfrage{inquiries.length !== 1 ? "n" : ""} · {open} neu
          </p>
        </div>

        {!mailConfigured && (
          <div role="status" className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
            E-Mail-Versand ist noch nicht eingerichtet: Es fehlen die Zugangsdaten des Postfachs
            (SMTP_HOST, SMTP_USER, SMTP_PASS). Anfragen werden trotzdem hier gespeichert.
          </div>
        )}

        <InquiryList inquiries={inquiries} />
      </div>
    </AdminLayout>
  );
}
