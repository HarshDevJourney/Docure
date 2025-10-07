import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Doctor Login - Docure",
  description:
    "Healthcare provider login to MediCare+ platform. Manage your practice and consultations.",
};


export default function DoctorLoginPage() {
  return <AuthForm type="login" userRole="doctor"></AuthForm>;
}
