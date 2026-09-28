-- Create admin_users table
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- Secure helper function
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Properties Table
create table properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  transaction_type text not null check (transaction_type in ('Buy', 'Rent', 'Sell')),
  property_type text not null,
  location text not null,
  city text not null default 'Surat',
  price text not null,
  area_sqft text not null,
  bhk text,
  bathrooms integer,
  description text,
  amenities text[],
  status text not null default 'Draft' check (status in ('Draft', 'Available', 'Sold', 'Rented')),
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_properties_status on properties(status);
create index idx_properties_slug on properties(slug);

-- Property Images
create table property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  display_order integer default 0,
  created_at timestamptz default now()
);

create index idx_property_images_property_id on property_images(property_id);

-- Enquiries
create table enquiries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete set null,
  name text not null,
  phone text not null,
  requirement text,
  message text not null,
  preferred_visit_date date,
  source text default 'Website',
  status text default 'New' check (status in ('New', 'Contacted', 'Follow-up', 'Closed')),
  created_at timestamptz default now()
);

-- Site Visits
create table site_visits (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete set null,
  name text not null,
  phone text not null,
  preferred_date date not null,
  preferred_time text not null,
  message text,
  status text default 'Pending' check (status in ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  created_at timestamptz default now()
);

-- Testimonials
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  role text,
  review text not null,
  rating integer check (rating >= 1 and rating <= 5),
  approved boolean default false,
  created_at timestamptz default now()
);

-- Areas
create table areas (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  featured boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table admin_users enable row level security;
alter table properties enable row level security;
alter table property_images enable row level security;
alter table enquiries enable row level security;
alter table site_visits enable row level security;
alter table testimonials enable row level security;
alter table areas enable row level security;

-- Admin Users Policies
create policy "Admins can view admin_users" on admin_users for select using (is_admin());

-- Properties Policies
create policy "Admins can do everything on properties" on properties for all using (is_admin());

-- Property Images Policies
create policy "Public can view property images" on property_images for select using (true);
create policy "Admins can do everything on property images" on property_images for all using (is_admin());

-- Enquiries Policies
create policy "Public can insert enquiries" on enquiries for insert with check (true);
create policy "Admins can view and update enquiries" on enquiries for all using (is_admin());

-- Site Visits Policies
create policy "Public can insert site visits" on site_visits for insert with check (true);
create policy "Admins can view and update site visits" on site_visits for all using (is_admin());

-- Testimonials Policies
create policy "Public can view approved testimonials" on testimonials for select using (approved = true);
create policy "Admins can do everything on testimonials" on testimonials for all using (is_admin());

-- Areas Policies
create policy "Public can view areas" on areas for select using (true);
create policy "Admins can do everything on areas" on areas for all using (is_admin());

-- Storage Policies
-- Note: You might need to manually create the 'property-images' bucket in the Supabase Dashboard
-- if the SQL below does not have permissions to write to storage schema directly.
insert into storage.buckets (id, name, public) values ('property-images', 'property-images', true) on conflict do nothing;

create policy "Admin Select" on storage.objects for select using (bucket_id = 'property-images' and public.is_admin());
create policy "Admin Insert" on storage.objects for insert with check (bucket_id = 'property-images' and public.is_admin());
create policy "Admin Update" on storage.objects for update using (bucket_id = 'property-images' and public.is_admin());
create policy "Admin Delete" on storage.objects for delete using (bucket_id = 'property-images' and public.is_admin());
