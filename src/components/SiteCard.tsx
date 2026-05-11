import type { SiteRow } from "@/hooks/use-sites";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

interface SiteCardProps {
  site: SiteRow;
}

export default function SiteCard({ site }: SiteCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/site/${site.id}`)}
      className="group flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-3.5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      <img
        src={site.icon || "/placeholder.svg"}
        alt={site.title}
        className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-muted"
        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {site.title}
        </div>
        <div className="text-xs text-muted-foreground truncate mt-0.5">
          {site.description}
        </div>
      </div>
      <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </div>
  );
}
