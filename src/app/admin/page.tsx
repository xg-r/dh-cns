import { InquiryList } from "@/components/admin/inquiry-list";
import { sampleInquiries } from "@/lib/admin/sample-inquiries";

export default function AdminPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">견적 문의 관리</h1>
      <div className="mt-6">
        <InquiryList inquiries={sampleInquiries} />
      </div>
    </>
  );
}
