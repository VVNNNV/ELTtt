import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (categoryId: string) => {
    const el = document.getElementById(`term-${categoryId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Navigate to home first if on another page
      window.location.href = `/#term-${categoryId}`;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-8 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setMobileMenuOpen(true);
                  } else {
                    setSidebarCollapsed(!sidebarCollapsed);
                  }
                }}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Menu size={20} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/WebStackPage/WebStackPage.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="px-4 md:px-8 py-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Copyright © {new Date().getFullYear()} WebStack · Design by{" "}
            <a href="https://github.com/WebStackPage/WebStackPage.github.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              WebStack
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
