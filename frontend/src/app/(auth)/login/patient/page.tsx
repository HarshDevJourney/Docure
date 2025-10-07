import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Patient Login - Docure",
  description:
    "login to your MediCare+ account to access healthcare consultations.",
};

export default function PatientLoginPage(){
  return <AuthForm type='login' userRole='patient' ></AuthForm>
}