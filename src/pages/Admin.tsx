import { useState } from "react";
import { useCategories, useSites, useCreateSite, useUpdateSite, useDeleteSite, useCreateCategory, useUpdateCategory, useDeleteCategory, useBatchCreateSites, buildCategoryTree } from "@/hooks/use-sites";
import type { CategoryRow, SiteRow } from "@/hooks/use-sites";
import type { TablesInsert } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Download, Upload, FolderPlus } from "lucide-react";
import * as XLSX from "xlsx";

export default function Admin() {
  const { data: categories = [], isLoading: catLoading } = useCategories();
  const { data: sites = [], isLoading: sitesLoading } = useSites();
  const createSite = useCreateSite();
  const updateSite = useUpdateSite();
  const deleteSite = useDeleteSite();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const batchCreate = useBatchCreateSites();

  const tree = buildCategoryTree(categories);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-foreground mb-6">后台管理</h1>

      <Tabs defaultValue="sites">
        <TabsList className="mb-6">
          <TabsTrigger value="sites">站点管理</TabsTrigger>
          <TabsTrigger value="categories">分类管理</TabsTrigger>
          <TabsTrigger value="import">导入/导出</TabsTrigger>
        </TabsList>

        <TabsContent value="sites">
          <SitesManager
            sites={sites}
            categories={categories}
            tree={tree}
            loading={sitesLoading}
            createSite={createSite}
            updateSite={updateSite}
            deleteSite={deleteSite}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesManager
            categories={categories}
            tree={tree}
            loading={catLoading}
            createCategory={createCategory}
            updateCategory={updateCategory}
            deleteCategory={deleteCategory}
          />
        </TabsContent>

        <TabsContent value="import">
          <ImportExport
            categories={categories}
            sites={sites}
            batchCreate={batchCreate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ==================== Sites Manager ====================
function SitesManager({
  sites, categories, tree, loading, createSite, updateSite, deleteSite,
}: {
  sites: SiteRow[];
  categories: CategoryRow[];
  tree: ReturnType<typeof buildCategoryTree>;
  loading: boolean;
  createSite: ReturnType<typeof useCreateSite>;
  updateSite: ReturnType<typeof useUpdateSite>;
  deleteSite: ReturnType<typeof useDeleteSite>;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SiteRow | null>(null);
  const [filterCat, setFilterCat] = useState<string>("all");

  const filtered = filterCat === "all" ? sites : sites.filter((s) => s.category_id === filterCat);
  const getCatName = (id: string) => categories.find((c) => c.id === id)?.name || "未知";

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="筛选分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              {tree.map((root) => (
                <div key={root.id}>
                  {root.children && root.children.length > 0 ? (
                    root.children.map((child) => (
                      <SelectItem key={child.id} value={child.id}>
                        {root.name} / {child.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value={root.id}>{root.name}</SelectItem>
                  )}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus size={16} className="mr-1" /> 添加站点
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "编辑站点" : "添加站点"}</DialogTitle>
            </DialogHeader>
            <SiteForm
              site={editing}
              categories={categories}
              tree={tree}
              onSubmit={async (data) => {
                if (editing) {
                  await updateSite.mutateAsync({ id: editing.id, ...data });
                  toast.success("站点已更新");
                } else {
                  await createSite.mutateAsync(data);
                  toast.success("站点已添加");
                }
                setDialogOpen(false);
                setEditing(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">加载中...</p>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium text-muted-foreground">站点</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">URL</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">分类</th>
                <th className="text-left p-3 font-medium text-muted-foreground">排序</th>
                <th className="text-right p-3 font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((site) => (
                <tr key={site.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={site.icon || "/placeholder.svg"}
                        alt=""
                        className="w-6 h-6 rounded"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                      />
                      <span className="font-medium text-foreground">{site.title}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground truncate max-w-[200px] hidden md:table-cell">{site.url}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{getCatName(site.category_id)}</td>
                  <td className="p-3 text-muted-foreground">{site.sort_order}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditing(site); setDialogOpen(true); }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={async () => {
                          if (confirm("确定删除此站点吗？")) {
                            await deleteSite.mutateAsync(site.id);
                            toast.success("已删除");
                          }
                        }}
                      >
                        <Trash2 size={14} className="text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==================== Site Form ====================
function SiteForm({
  site, categories, tree, onSubmit,
}: {
  site: SiteRow | null;
  categories: CategoryRow[];
  tree: ReturnType<typeof buildCategoryTree>;
  onSubmit: (data: TablesInsert<"sites">) => Promise<void>;
}) {
  const [title, setTitle] = useState(site?.title || "");
  const [url, setUrl] = useState(site?.url || "");
  const [icon, setIcon] = useState(site?.icon || "");
  const [description, setDescription] = useState(site?.description || "");
  const [content, setContent] = useState(site?.content || "");
  const [categoryId, setCategoryId] = useState(site?.category_id || "");
  const [sortOrder, setSortOrder] = useState(site?.sort_order || 0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || !categoryId) {
      toast.error("请填写必填项");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ title, url, icon: icon || null, description, content: content || null, category_id: categoryId, sort_order: sortOrder });
    } catch {
      toast.error("操作失败");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">标题 *</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="站点名称" />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">URL *</label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">图标URL</label>
        <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="https://example.com/favicon.ico" />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">分类 *</label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            {tree.map((root) =>
              root.children && root.children.length > 0 ? (
                root.children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    {root.name} / {child.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key={root.id} value={root.id}>{root.name}</SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">简介</label>
        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简短描述" />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">详细内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="详情页正文内容..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">排序</label>
        <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "提交中..." : site ? "更新" : "添加"}
      </Button>
    </form>
  );
}

// ==================== Categories Manager ====================
function CategoriesManager({
  categories, tree, loading, createCategory, updateCategory, deleteCategory,
}: {
  categories: CategoryRow[];
  tree: ReturnType<typeof buildCategoryTree>;
  loading: boolean;
  createCategory: ReturnType<typeof useCreateCategory>;
  updateCategory: ReturnType<typeof useUpdateCategory>;
  deleteCategory: ReturnType<typeof useDeleteCategory>;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">分类列表</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <FolderPlus size={16} className="mr-1" /> 添加分类
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "编辑分类" : "添加分类"}</DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editing}
              categories={categories}
              onSubmit={async (data) => {
                if (editing) {
                  await updateCategory.mutateAsync({ id: editing.id, ...data });
                  toast.success("分类已更新");
                } else {
                  await createCategory.mutateAsync(data);
                  toast.success("分类已添加");
                }
                setDialogOpen(false);
                setEditing(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground">加载中...</p>
      ) : (
        <div className="space-y-2">
          {tree.map((root) => (
            <div key={root.id} className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-3 bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{root.name}</span>
                  <span className="text-xs text-muted-foreground">({root.icon})</span>
                  <span className="text-xs text-muted-foreground">排序: {root.sort_order}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(root); setDialogOpen(true); }}>
                    <Pencil size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      if (confirm("删除此分类将同时删除所有子分类和站点，确定吗？")) {
                        await deleteCategory.mutateAsync(root.id);
                        toast.success("已删除");
                      }
                    }}
                  >
                    <Trash2 size={14} className="text-destructive" />
                  </Button>
                </div>
              </div>
              {root.children && root.children.length > 0 && (
                <div className="divide-y divide-border">
                  {root.children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between p-3 pl-8">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{child.name}</span>
                        <span className="text-xs text-muted-foreground">({child.icon})</span>
                        <span className="text-xs text-muted-foreground">排序: {child.sort_order}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(child); setDialogOpen(true); }}>
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async () => {
                            if (confirm("删除此分类将同时删除其下所有站点，确定吗？")) {
                              await deleteCategory.mutateAsync(child.id);
                              toast.success("已删除");
                            }
                          }}
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {tree.length === 0 && (
            <p className="text-center text-muted-foreground py-8">暂无分类，请先添加</p>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== Category Form ====================
function CategoryForm({
  category, categories, onSubmit,
}: {
  category: CategoryRow | null;
  categories: CategoryRow[];
  onSubmit: (data: TablesInsert<"categories">) => Promise<void>;
}) {
  const [name, setName] = useState(category?.name || "");
  const [icon, setIcon] = useState(category?.icon || "FolderOpen");
  const [parentId, setParentId] = useState<string>(category?.parent_id || "none");
  const [sortOrder, setSortOrder] = useState(category?.sort_order || 0);
  const [submitting, setSubmitting] = useState(false);

  const roots = categories.filter((c) => !c.parent_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("请填写分类名称"); return; }
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        icon,
        parent_id: parentId === "none" ? null : parentId,
        sort_order: sortOrder,
      });
    } catch {
      toast.error("操作失败");
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">名称 *</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="分类名称" />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">图标名称</label>
        <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Lucide 图标名，如 Star, Code" />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">父分类</label>
        <Select value={parentId} onValueChange={setParentId}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">无（顶级分类）</SelectItem>
            {roots.filter((r) => r.id !== category?.id).map((r) => (
              <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium text-foreground mb-1 block">排序</label>
        <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "提交中..." : category ? "更新" : "添加"}
      </Button>
    </form>
  );
}

// ==================== Import / Export ====================
function ImportExport({
  categories, sites, batchCreate,
}: {
  categories: CategoryRow[];
  sites: SiteRow[];
  batchCreate: ReturnType<typeof useBatchCreateSites>;
}) {
  const [selectedCat, setSelectedCat] = useState("");
  const tree = buildCategoryTree(categories);

  // Download template
  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["标题", "URL", "图标URL", "简介", "详细内容", "排序"],
      ["示例站点", "https://example.com", "https://example.com/favicon.ico", "这是一个示例站点", "详情页的正文内容", "0"],
    ]);
    ws["!cols"] = [{ wch: 20 }, { wch: 35 }, { wch: 40 }, { wch: 30 }, { wch: 30 }, { wch: 8 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "站点模板");
    XLSX.writeFile(wb, "WebStack导入模板.xlsx");
    toast.success("模板已下载");
  };

  // Export current data
  const exportData = () => {
    const rows = sites.map((s) => {
      const cat = categories.find((c) => c.id === s.category_id);
      return [s.title, s.url, s.icon || "", s.description, s.content || "", s.sort_order, cat?.name || ""];
    });
    const ws = XLSX.utils.aoa_to_sheet([
      ["标题", "URL", "图标URL", "简介", "详细内容", "排序", "分类"],
      ...rows,
    ]);
    ws["!cols"] = [{ wch: 20 }, { wch: 35 }, { wch: 40 }, { wch: 30 }, { wch: 30 }, { wch: 8 }, { wch: 15 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "站点数据");
    XLSX.writeFile(wb, "WebStack站点数据.xlsx");
    toast.success("导出成功");
  };

  // Handle file upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCat) {
      toast.error("请先选择栏目");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const wb = XLSX.read(evt.target?.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 });

        // Skip header row
        const dataRows = rows.slice(1).filter((r) => r[0] && r[1]);
        if (dataRows.length === 0) {
          toast.error("没有有效数据");
          return;
        }

        const newSites: TablesInsert<"sites">[] = dataRows.map((r) => ({
          title: String(r[0] || ""),
          url: String(r[1] || ""),
          icon: r[2] ? String(r[2]) : null,
          description: String(r[3] || ""),
          content: r[4] ? String(r[4]) : null,
          sort_order: Number(r[5]) || 0,
          category_id: selectedCat,
        }));

        await batchCreate.mutateAsync(newSites);
        toast.success(`成功导入 ${newSites.length} 个站点`);
      } catch {
        toast.error("导入失败，请检查文件格式");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">三步搞定：网链导入</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 text-lg font-bold">1</div>
            <h4 className="font-medium text-foreground mb-2">下载Excel模板</h4>
            <p className="text-sm text-muted-foreground mb-3">下载标准模板文件</p>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download size={16} className="mr-1" /> 下载模板
            </Button>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 text-lg font-bold">2</div>
            <h4 className="font-medium text-foreground mb-2">按需填写模板</h4>
            <p className="text-sm text-muted-foreground">按模板格式填写站点信息</p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 text-lg font-bold">3</div>
            <h4 className="font-medium text-foreground mb-2">选择栏目并上传</h4>
            <p className="text-sm text-muted-foreground mb-3">选择目标分类后上传文件</p>
            <div className="space-y-2">
              <Select value={selectedCat} onValueChange={setSelectedCat}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择栏目" />
                </SelectTrigger>
                <SelectContent>
                  {tree.map((root) =>
                    root.children && root.children.length > 0 ? (
                      root.children.map((child) => (
                        <SelectItem key={child.id} value={child.id}>
                          {root.name} / {child.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key={root.id} value={root.id}>{root.name}</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <Button variant="default" asChild disabled={!selectedCat}>
                  <span>
                    <Upload size={16} className="mr-1" /> 上传文件
                    <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handleUpload} disabled={!selectedCat} />
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">导出数据</h3>
        <p className="text-sm text-muted-foreground mb-4">将当前所有站点数据导出为 Excel 文件</p>
        <Button variant="outline" onClick={exportData} disabled={sites.length === 0}>
          <Download size={16} className="mr-1" /> 导出全部站点 ({sites.length})
        </Button>
      </div>
    </div>
  );
}
