
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'FolderOpen',
  parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sites table
CREATE TABLE public.sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  description TEXT NOT NULL DEFAULT '',
  content TEXT,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view sites" ON public.sites FOR SELECT USING (true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update categories" ON public.categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete categories" ON public.categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert sites" ON public.sites FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sites" ON public.sites FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete sites" ON public.sites FOR DELETE TO authenticated USING (true);

-- Timestamps trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_sites_category_id ON public.sites(category_id);
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX idx_sites_sort_order ON public.sites(sort_order);
CREATE INDEX idx_categories_sort_order ON public.categories(sort_order);
