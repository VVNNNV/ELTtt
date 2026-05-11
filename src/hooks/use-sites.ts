import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type CategoryRow = Tables<"categories">;
export type SiteRow = Tables<"sites">;

// Fetch all categories with hierarchy
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as CategoryRow[];
    },
  });
}

// Fetch all sites
export function useSites() {
  return useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as SiteRow[];
    },
  });
}

// Fetch single site
export function useSite(id: string) {
  return useQuery({
    queryKey: ["sites", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as SiteRow;
    },
    enabled: !!id,
  });
}

// Get sites by category
export function useSitesByCategory(categoryId: string) {
  return useQuery({
    queryKey: ["sites", "category", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("category_id", categoryId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as SiteRow[];
    },
    enabled: !!categoryId,
  });
}

// Mutations for sites
export function useCreateSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (site: TablesInsert<"sites">) => {
      const { data, error } = await supabase.from("sites").insert(site).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sites"] }),
  });
}

export function useUpdateSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"sites"> & { id: string }) => {
      const { data, error } = await supabase.from("sites").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sites"] }),
  });
}

export function useDeleteSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sites"] }),
  });
}

// Mutations for categories
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cat: TablesInsert<"categories">) => {
      const { data, error } = await supabase.from("categories").insert(cat).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"categories"> & { id: string }) => {
      const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// Batch insert sites
export function useBatchCreateSites() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sites: TablesInsert<"sites">[]) => {
      const { data, error } = await supabase.from("sites").insert(sites).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sites"] }),
  });
}

// Search sites from DB
export function useSearchSites(query: string) {
  return useQuery({
    queryKey: ["sites", "search", query],
    queryFn: async () => {
      const q = query.toLowerCase();
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .or(`title.ilike.%${q}%,description.ilike.%${q}%,url.ilike.%${q}%`)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as SiteRow[];
    },
    enabled: query.length > 0,
  });
}

// Helper: build category tree
export function buildCategoryTree(categories: CategoryRow[]) {
  const roots = categories.filter((c) => !c.parent_id);
  return roots.map((root) => ({
    ...root,
    children: categories.filter((c) => c.parent_id === root.id),
  }));
}

// Helper: get all leaf categories (for site listing)
export function getAllSubCategories(categories: CategoryRow[]) {
  const result: CategoryRow[] = [];
  const roots = categories.filter((c) => !c.parent_id);
  roots.forEach((root) => {
    const children = categories.filter((c) => c.parent_id === root.id);
    if (children.length > 0) {
      children.forEach((child) => result.push(child));
    } else {
      result.push(root);
    }
  });
  return result;
}
