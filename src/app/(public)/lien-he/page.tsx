import type { Metadata } from "next";
import { ContactPanel } from "@/components/public/contact-panel";
import { CtaBand } from "@/components/public/cta-band";
import { PageIntro } from "@/components/public/page-intro";
import { getContactData } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Thông tin liên hệ chính thức của UIT Knowledge.",
};

export default async function ContactPage() {
  const contact = await getContactData();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageIntro
        eyebrow="Liên hệ"
        title="Kết nối nhanh với UIT Knowledge"
        description="Chọn đúng kênh để hỏi về nội dung học, đăng ký khóa học hoặc mua merch một cách thuận tiện hơn."
        badges={["Facebook", "Zalo", "Email"]}
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <ContactPanel facebookUrl={contact.facebookUrl} zaloPhone={contact.zaloPhone} contactEmail={contact.contactEmail} />

        <div className="surface-panel rounded-[2rem] px-6 py-6 sm:px-7">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="eyebrow-label">Thông tin chính thức</p>
              <h2 className="text-display text-3xl font-semibold leading-tight text-slate-950">Tất cả kênh liên hệ tại một nơi</h2>
              <p className="text-sm leading-7 text-black/62">
                Bạn có thể chọn Facebook để theo dõi cập nhật, Zalo để trao đổi nhanh hoặc email khi cần gửi nội dung chi tiết hơn.
              </p>
            </div>

            <div className="space-y-3 text-sm leading-7 text-black/68">
              <p>
                Facebook:{" "}
                <a href={contact.facebookUrl} target="_blank" rel="noreferrer" className="font-medium text-black underline-offset-4 hover:underline">
                  GenCanyon
                </a>
              </p>
              <p>Zalo: {contact.zaloPhone} - Phan Trong Dinh</p>
              <p>
                Email:{" "}
                <a href={`mailto:${contact.contactEmail}`} className="font-medium text-black underline-offset-4 hover:underline">
                  {contact.contactEmail}
                </a>
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-cyan-50 px-4 py-4 text-sm leading-7 text-black/68">
              Khi cần đăng ký khóa học hoặc mua merch, các nút trên website sẽ mở đúng biểu mẫu tương ứng để việc tiếp nhận thông tin nhanh và rõ ràng hơn.
            </div>
          </div>
        </div>
      </div>

      <CtaBand
        title="Xem khóa học hoặc video ngay từ đây."
        description="Nếu bạn đã xác định được môn cần học, có thể chuyển thẳng sang đúng khu nội dung chỉ với một lần bấm."
        primaryHref="/khoa-hoc"
        primaryLabel="Xem khóa học"
        secondaryHref="/video"
        secondaryLabel="Xem video"
      />
    </main>
  );
}
