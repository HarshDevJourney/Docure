import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Patient Signup - Docure",
  description:
    "Sign up to your MediCare+ account to access healthcare consultations.",
};

export default function PatientSignupPage() {
  return <AuthForm type="signup" userRole="patient"></AuthForm>;
}
