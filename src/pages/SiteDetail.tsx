import { useParams, useNavigate } from "react-router-dom";
import { useSite, useCategories, useSites } from "@/hooks/use-sites";
import SiteCard from "@/components/SiteCard";
import { ArrowLeft, ExternalLink, QrCode } from "lucide-react";

export default function SiteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: site, isLoading } = useSite(id || "");
  const { data: categories = [] } = useCategories();
  const { data: allSites = [] } = useSites();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">加载中...</div>;
  }

  if (!site) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">站点未找到</p>
          <button onClick={() => navigate("/")} className="mt-4 text-primary hover:underline text-sm">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === site.category_id);
  const relatedSites = allSites.filter((s) => s.category_id === site.category_id && s.id !== site.id).slice(0, 6);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=10&data=${encodeURIComponent(site.url)}`;

  return (
    <div className="animate-fade-in-up">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} />
        返回
      </button>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center md:w-48 flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl scale-125" />
                <img
                  src={site.icon || "/placeholder.svg"}
                  alt={site.title}
                  className="relative w-24 h-24 rounded-2xl object-cover bg-muted"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                />
              </div>
            </div>

            <div className="flex-1">
              {category && (
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-3">
                  {category.name}
                </span>
              )}
              <h1 className="text-2xl font-bold text-foreground mb-2">{site.title}</h1>
              <p className="text-muted-foreground mb-6">{site.description}</p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  链接直达 <ExternalLink size={14} />
                </a>
                <div className="relative group">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                    手机查看 <QrCode size={14} />
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-card border border-border rounded-xl p-2 shadow-xl">
                    <img src={qrUrl} alt="QR Code" className="w-36 h-36" />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center gap-2">
              <img src={qrUrl} alt="QR Code" className="w-32 h-32 rounded-lg" />
              <span className="text-xs text-muted-foreground">手机扫码访问</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-6 md:p-8">
          {site.content ? (
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">{site.content}</div>
          ) : (
            <p className="text-foreground leading-relaxed">
              {site.description}。访问地址：
              <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {site.url}
              </a>
            </p>
          )}
        </div>
      </div>

      {relatedSites.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" />
            相关导航
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedSites.map((s) => (
              <SiteCard key={s.id} site={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
