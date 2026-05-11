import { useState } from "react";
import { Search } from "lucide-react";
import { useSearchSites } from "@/hooks/use-sites";
import type { SiteRow } from "@/hooks/use-sites";
import { useNavigate } from "react-router-dom";

const searchEngines = [
  { name: "百度", url: "https://www.baidu.com/s?wd=" },
  { name: "Google", url: "https://www.google.com/search?q=" },
  { name: "Bing", url: "https://cn.bing.com/search?q=" },
  { name: "站内", url: "" },
];

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [activeEngine, setActiveEngine] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const { data: results = [] } = useSearchSites(activeEngine === 3 ? query : "");

  const handleSearch = () => {
    if (!query.trim()) return;
    if (activeEngine === 3) {
      setShowResults(true);
    } else {
      window.open(searchEngines[activeEngine].url + encodeURIComponent(query), "_blank");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (activeEngine === 3 && value.trim()) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center gap-1 px-4 pt-3 pb-2">
          {searchEngines.map((engine, i) => (
            <button
              key={engine.name}
              onClick={() => { setActiveEngine(i); setShowResults(false); }}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                activeEngine === i
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {engine.name}
            </button>
          ))}
        </div>

        <div className="flex items-center px-4 pb-3">
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-2.5">
            <Search size={18} className="text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => activeEngine === 3 && query && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              placeholder={activeEngine === 3 ? "搜索站内收录的网站..." : `${searchEngines[activeEngine].name}搜索`}
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={handleSearch}
            className="ml-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            搜索
          </button>
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-lg z-50 max-h-80 overflow-y-auto animate-fade-in-up">
          {results.map((site: SiteRow) => (
            <button
              key={site.id}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
              onMouseDown={() => navigate(`/site/${site.id}`)}
            >
              <img
                src={site.icon || "/placeholder.svg"}
                alt={site.title}
                className="w-6 h-6 rounded"
                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{site.title}</div>
                <div className="text-xs text-muted-foreground truncate">{site.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
