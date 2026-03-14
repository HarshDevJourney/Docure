import { Header } from "@/components/landing/Header";

export default function PatientHistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <Header showDashboardNav={true} />
      </header>
      <main className='mt-16'>{children}</main>
    </div>
  );
}
