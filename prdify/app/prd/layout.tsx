import { Sidebar } from "@/components/prd/sidebar";
import { SidebarProvider } from "@/components/prd/sidebar-context";

export default function PRDLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex overflow-hidden prd-layout-root" style={{ background: "var(--p-page-bg)" }}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden prd-main-content">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
