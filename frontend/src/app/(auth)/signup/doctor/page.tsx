import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Doctor Signup - Docure",
  description:
    "Healthcare provider sign up to MediCare+ platform. Manage your practice and consultations.",
};


export default function DoctorSignupPage() {
  return <AuthForm type="signup" userRole="doctor"></AuthForm>;
}
