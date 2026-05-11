import { useState } from "react";
import { useCategories, buildCategoryTree } from "@/hooks/use-sites";
import {
  Star, Palette, Code, Package, Monitor, Brain, FolderOpen,
  Flame, Zap, Pen, Image, Type, Wrench, BookOpen, Users,
  BarChart, Layers, Play, Music, ChevronDown, X, Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
  Star, Palette, Code, Package, Monitor, Brain, FolderOpen,
  Flame, Zap, Pen, Image, Type, Wrench, BookOpen, Users,
  BarChart, Layers, Play, Music, Settings,
};

interface SidebarProps {
  onNavigate: (categoryId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ onNavigate, collapsed, onToggleCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  const { data: categories = [] } = useCategories();
  const tree = buildCategoryTree(categories);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const navigate = useNavigate();

  // Auto-expand all on first load
  if (tree.length > 0 && expandedIds.length === 0) {
    const ids = tree.map((c) => c.id);
    if (ids.length > 0) {
      setTimeout(() => setExpandedIds(ids), 0);
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleClick = (cat: typeof tree[0]) => {
    if (cat.children && cat.children.length > 0) {
      toggleExpand(cat.id);
    } else {
      onNavigate(cat.id);
      onMobileClose();
    }
  };

  const handleChildClick = (childId: string) => {
    onNavigate(childId);
    onMobileClose();
  };

  const renderIcon = (iconName: string) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon size={16} /> : <FolderOpen size={16} />;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-ws-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <a href="/" className="flex items-center gap-2 animate-slide-in-left">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">W</span>
            </div>
            <span className="text-ws-sidebar-active font-semibold text-lg tracking-tight">WebStack</span>
          </a>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto sidebar-scroll px-4 py-4">
        <ul className="space-y-1">
          {tree.map((cat) => {
            const isExpanded = expandedIds.includes(cat.id);
            const hasChildren = cat.children && cat.children.length > 0;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => handleClick(cat)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-ws-sidebar-fg hover:text-ws-sidebar-active hover:bg-ws-sidebar-hover transition-all duration-200 text-sm group"
                  title={collapsed ? cat.name : undefined}
                >
                  <span className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                    {renderIcon(cat.icon)}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{cat.name}</span>
                      {hasChildren && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 opacity-50 ${isExpanded ? "rotate-180" : ""}`}
                        />
                      )}
                    </>
                  )}
                </button>
                {!collapsed && hasChildren && isExpanded && (
                  <ul className="ml-4 mt-1 space-y-0.5 border-l border-ws-sidebar-border pl-3">
                    {cat.children!.map((child) => (
                      <li key={child.id}>
                        <button
                          onClick={() => handleChildClick(child.id)}
                          className="w-full text-left px-3 py-2 rounded-md text-ws-sidebar-fg hover:text-ws-sidebar-active hover:bg-ws-sidebar-hover transition-all duration-200 text-[13px]"
                        >
                          {child.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Admin link */}
      {!collapsed && (
        <div className="px-4 py-2 border-t border-ws-sidebar-border">
          <button
            onClick={() => { navigate("/admin"); onMobileClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-ws-sidebar-fg hover:text-ws-sidebar-active hover:bg-ws-sidebar-hover transition-all duration-200 text-sm"
          >
            <Settings size={16} className="opacity-70" />
            <span>后台管理</span>
          </button>
        </div>
      )}

      {!collapsed && (
        <div className="px-6 py-4 border-t border-ws-sidebar-border">
          <p className="text-xs text-ws-sidebar-fg opacity-50">
            © {new Date().getFullYear()} WebStack
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside
        className={`hidden md:flex flex-col bg-ws-sidebar-bg h-screen sticky top-0 transition-all duration-300 ${
          collapsed ? "w-[68px]" : "w-[250px]"
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-[260px] bg-ws-sidebar-bg animate-slide-in-left">
            <div className="absolute top-4 right-4">
              <button onClick={onMobileClose} className="text-ws-sidebar-fg hover:text-ws-sidebar-active">
                <X size={20} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
