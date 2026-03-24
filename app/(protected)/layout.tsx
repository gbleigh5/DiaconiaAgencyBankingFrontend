import { AuthGuard } from "@/components/auth-guard";
import { PageShell } from "@/components/layout/page-shell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <PageShell>{children}</PageShell>
    </AuthGuard>
  );
}
