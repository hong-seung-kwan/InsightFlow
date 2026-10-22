import AdminShell from "@/src/components/AdminShell";
import Providers from "@/src/components/Providers";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Providers>
            <AdminShell>{children}</AdminShell>
        </Providers>
    )
}