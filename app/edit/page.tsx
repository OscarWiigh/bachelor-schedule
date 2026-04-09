import { ScheduleEditor } from "@/components/ScheduleEditor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit schedule — Bachelor Schedule",
  description: "Add or edit weekend activities (stored in your browser).",
};

export default function EditPage() {
  return <ScheduleEditor />;
}
