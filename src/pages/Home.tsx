import SearchBar from "@/components/SearchBar";
import SiteCard from "@/components/SiteCard";
import { useCategories, useSites, getAllSubCategories } from "@/hooks/use-sites";

export default function Home() {
  const { data: categories = [] } = useCategories();
  const { data: sites = [] } = useSites();

  const subCategories = getAllSubCategories(categories);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-10">
        <SearchBar />
      </div>

      <div className="space-y-10">
        {subCategories.map((cat) => {
          const catSites = sites.filter((s) => s.category_id === cat.id);
          if (catSites.length === 0) return null;
          return (
            <section key={cat.id} id={`term-${cat.id}`}>
              <h3 className="text-base font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                {cat.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {catSites.map((site) => (
                  <SiteCard key={site.id} site={site} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
