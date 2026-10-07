import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://odpwfmrllqjdzgbgrxfc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kcHdmbXJsbHFqZHpnYmdyeGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNzMyMjcsImV4cCI6MjEwNjk0OTIyN30.7XG_JDDlTFMJQ0t2ZZDyMbbBxTReZIDAR5ZavIzHle4'
);

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  category_id: string | null;
  author: string;
  is_featured: boolean;
  is_published: boolean;
  views: number;
  source_url: string | null;
  source_name: string | null;
  video_url: string | null;
  original_author: string | null;
  original_date: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
  categories?: Category;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};
