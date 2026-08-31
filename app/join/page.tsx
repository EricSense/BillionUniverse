import type { Metadata } from "next";
import { JoinForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Start a company" };

export default function JoinPage() {
  return <JoinForm />;
}
