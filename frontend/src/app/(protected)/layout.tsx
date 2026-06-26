import { ProtectedLayout } from '@/features/auth/ProtectedLayout';
export default function Layout({ children }: { children: React.ReactNode }) { return <ProtectedLayout>{children}</ProtectedLayout>; }
