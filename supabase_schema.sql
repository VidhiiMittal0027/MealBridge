-- MealBridge Supabase SQL Migration Script (Clerk Authentication Edition)
-- Run this in your Supabase project's SQL Editor to set up the database tables, triggers, and policies.

-- Enable UUID extension for table primary keys
create extension if not exists "uuid-ossp";

-- =========================================================================
-- DROP TABLES (Forces reset of keys from UUID to TEXT for Clerk compatibility)
-- =========================================================================
drop table if exists public.organization_documents cascade;
drop table if exists public.messages cascade;
drop table if exists public.notifications cascade;
drop table if exists public.orders cascade;
drop table if exists public.food_donations cascade;
drop table if exists public.organizations cascade;
drop table if exists public.donor_profiles cascade;
drop table if exists public.profiles cascade;

-- =========================================================================
-- 1. TABLES CREATION
-- =========================================================================

-- Profiles table: holds core user attributes linked to Clerk Auth string IDs
create table if not exists public.profiles (
  id text primary key, -- Clerk User ID (string, e.g. user_2P...)
  full_name text,
  email text not null,
  phone text,
  role text check (role in ('donor', 'receiver', 'delivery')),
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Donor Profiles table: stores business specific details for donors
create table if not exists public.donor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.profiles(id) on delete cascade unique not null,
  business_name text,
  business_type text check (business_type in ('Restaurant', 'Hotel', 'Cafe', 'Wedding Hall', 'Household', 'Other')),
  phone text,
  address text,
  city text,
  is_verified boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Organizations table: stores details for NGO/receiver organizations
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.profiles(id) on delete cascade unique not null,
  organization_name text not null,
  organization_type text check (organization_type in ('NGO', 'Orphanage', 'Old Age Home', 'Shelter', 'Animal Care', 'Other')) not null,
  registration_no text,
  phone text,
  address text,
  city text,
  latitude double precision,
  longitude double precision,
  description text,
  is_verified boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Food Donations table: represents surplus food listings created by donors
create table if not exists public.food_donations (
  id uuid primary key default gen_random_uuid(),
  donor_id text references public.profiles(id) on delete cascade not null,
  food_name text not null,
  description text,
  category text,
  veg_non_veg text check (veg_non_veg in ('Veg', 'Non Veg')) default 'Veg',
  quantity integer not null check (quantity >= 0),
  servings integer check (servings >= 0),
  prepared_at timestamptz,
  expiry_time timestamptz,
  pickup_start timestamptz,
  pickup_end timestamptz,
  image_url text,
  pickup_address text,
  gps_location text,
  need_transportation text check (need_transportation in ('Yes', 'No')) default 'No',
  special_instructions text,
  status text check (status in ('available', 'requested', 'accepted', 'picked_up', 'delivered', 'expired', 'cancelled')) default 'available' not null,
  freshness_label text check (freshness_label in ('fresh', 'moderate', 'spoiled', 'uncertain')),
  freshness_score numeric,
  ai_model_version text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Orders table: represents NGO matched requests for food listings
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid references public.food_donations(id) on delete cascade not null,
  receiver_id text references public.profiles(id) on delete cascade not null,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  people_count integer,
  requested_quantity integer not null check (requested_quantity > 0),
  receiver_message text,
  status text check (status in ('pending', 'accepted', 'rejected', 'ready_for_pickup', 'picked_up', 'delivered', 'cancelled')) default 'pending' not null,
  prep_time text,
  requested_at timestamptz default now() not null,
  accepted_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  original_donation jsonb -- Stores copy of listing details to restore if order is rejected/cancelled
);

-- Notifications table: stores dashboard notifications for donors/receivers
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.profiles(id) on delete cascade not null,
  order_id uuid references public.orders(id) on delete set null,
  type text check (type in ('new_order', 'order_accepted', 'order_rejected', 'delivery_assigned', 'order_delivered')) not null,
  title text not null,
  message text not null,
  is_read boolean default false not null,
  created_at timestamptz default now() not null
);

-- Messages table: stores chat history for specific order communication
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  sender_id text references public.profiles(id) on delete cascade not null,
  receiver_id text references public.profiles(id) on delete cascade not null,
  sender_name text,
  message text not null,
  is_read boolean default false not null,
  created_at timestamptz default now() not null
);

-- Organization Documents table: holds files uploaded for NGO verification
create table if not exists public.organization_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade not null,
  document_type text,
  file_url text not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending' not null,
  uploaded_at timestamptz default now() not null
);

-- =========================================================================
-- 2. ROW LEVEL SECURITY (RLS) & POLICIES
-- =========================================================================

alter table public.profiles enable row level security;
alter table public.donor_profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.food_donations enable row level security;
alter table public.orders enable row level security;
alter table public.notifications enable row level security;
alter table public.messages enable row level security;
alter table public.organization_documents enable row level security;

-- Drop existing policies if any to prevent recreate errors
drop policy if exists "Allow select access to all profiles" on public.profiles;
drop policy if exists "Allow update access to own profile" on public.profiles;
drop policy if exists "Allow select access to donor profiles" on public.donor_profiles;
drop policy if exists "Allow insert access to own donor profile" on public.donor_profiles;
drop policy if exists "Allow update access to own donor profile" on public.donor_profiles;
drop policy if exists "Allow select access to organizations" on public.organizations;
drop policy if exists "Allow insert access to own organization" on public.organizations;
drop policy if exists "Allow update access to own organization" on public.organizations;
drop policy if exists "Allow select access to available food donations" on public.food_donations;
drop policy if exists "Allow donors to manage their own food donations" on public.food_donations;
drop policy if exists "Allow orders access to involved receiver or donor" on public.orders;
drop policy if exists "Allow receivers to create orders" on public.orders;
drop policy if exists "Allow involved parties to update orders" on public.orders;
drop policy if exists "Allow users to view own notifications" on public.notifications;
drop policy if exists "Allow users to edit own notifications" on public.notifications;
drop policy if exists "Allow sender/receiver to view messages" on public.messages;
drop policy if exists "Allow users to post messages" on public.messages;
drop policy if exists "Allow organization owners to view documents" on public.organization_documents;
drop policy if exists "Allow organization owners to upload documents" on public.organization_documents;

-- Profiles Policies (unrestricted read for dashboard metrics, edit for own account)
create policy "Allow select access to all profiles" on public.profiles for select using (true);
create policy "Allow update access to own profile" on public.profiles for update using (true);
create policy "Allow insert access to all profiles" on public.profiles for insert with check (true);

-- Donor Profiles Policies
create policy "Allow select access to donor profiles" on public.donor_profiles for select using (true);
create policy "Allow insert access to own donor profile" on public.donor_profiles for insert with check (true);
create policy "Allow update access to own donor profile" on public.donor_profiles for update using (true);

-- Organizations Policies
create policy "Allow select access to organizations" on public.organizations for select using (true);
create policy "Allow insert access to own organization" on public.organizations for insert with check (true);
create policy "Allow update access to own organization" on public.organizations for update using (true);

-- Food Donations Policies
create policy "Allow select access to available food donations" on public.food_donations for select using (true);
create policy "Allow donors to manage their own food donations" on public.food_donations for all using (true);

-- Orders Policies
create policy "Allow orders access to involved receiver or donor" on public.orders for select using (true);
create policy "Allow receivers to create orders" on public.orders for insert with check (true);
create policy "Allow involved parties to update orders" on public.orders for update using (true);

-- Notifications Policies
create policy "Allow users to view own notifications" on public.notifications for select using (true);
create policy "Allow users to edit own notifications" on public.notifications for update using (true);
create policy "Allow notifications insertion" on public.notifications for insert with check (true);

-- Messages Policies
create policy "Allow sender/receiver to view messages" on public.messages for select using (true);
create policy "Allow users to post messages" on public.messages for insert with check (true);

-- Organization Documents Policies
create policy "Allow organization owners to view documents" on public.organization_documents for select using (true);
create policy "Allow organization owners to upload documents" on public.organization_documents for insert with check (true);

-- =========================================================================
-- 3. FUNCTIONS & TRIGGERS
-- =========================================================================

-- Trigger function: Update updated_at column
create or replace function public.handle_update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_profiles_timestamp on public.profiles;
create trigger update_profiles_timestamp before update on public.profiles for each row execute procedure public.handle_update_timestamp();

drop trigger if exists update_donor_profiles_timestamp on public.donor_profiles;
create trigger update_donor_profiles_timestamp before update on public.donor_profiles for each row execute procedure public.handle_update_timestamp();

drop trigger if exists update_organizations_timestamp on public.organizations;
create trigger update_organizations_timestamp before update on public.organizations for each row execute procedure public.handle_update_timestamp();

drop trigger if exists update_food_donations_timestamp on public.food_donations;
create trigger update_food_donations_timestamp before update on public.food_donations for each row execute procedure public.handle_update_timestamp();

drop trigger if exists update_orders_timestamp on public.orders;
create trigger update_orders_timestamp before update on public.orders for each row execute procedure public.handle_update_timestamp();

-- Trigger function: Deduct donation quantity on order placement
create or replace function public.handle_order_created_quantity_deduction()
returns trigger as $$
declare
  v_available_quantity integer;
  v_food_record record;
begin
  select * into v_food_record from public.food_donations where id = new.donation_id;
  v_available_quantity := v_food_record.quantity;
  
  if v_available_quantity < new.requested_quantity then
    raise exception 'Requested quantity % exceeds available quantity %', new.requested_quantity, v_available_quantity;
  end if;

  -- Store original donation backup in order to restore if cancelled later
  new.original_donation := to_jsonb(v_food_record);

  -- Deduct quantity
  update public.food_donations
  set quantity = quantity - new.requested_quantity,
      status = case when (quantity - new.requested_quantity) <= 0 then 'requested' else 'available' end
  where id = new.donation_id;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_order_created_quantity on public.orders;
create trigger on_order_created_quantity
  before insert on public.orders
  for each row execute procedure public.handle_order_created_quantity_deduction();

-- Trigger function: Restore donation quantity if order is rejected/cancelled
create or replace function public.handle_order_cancelled_quantity_restoration()
returns trigger as $$
begin
  -- If transition is to rejected or cancelled
  if (old.status = 'pending' or old.status = 'accepted' or old.status = 'ready_for_pickup') and (new.status = 'rejected' or new.status = 'cancelled') then
    
    -- Check if donation record still exists
    if exists (select 1 from public.food_donations where id = new.donation_id) then
      update public.food_donations
      set quantity = quantity + new.requested_quantity,
          status = 'available'
      where id = new.donation_id;
    else
      -- Recreate the donation from backup
      insert into public.food_donations (
        id, donor_id, food_name, description, category, veg_non_veg, quantity, servings,
        prepared_at, expiry_time, pickup_start, pickup_end, image_url, pickup_address,
        gps_location, need_transportation, special_instructions, status
      ) values (
        new.donation_id,
        new.original_donation->>'donor_id',
        new.original_donation->>'food_name',
        new.original_donation->>'description',
        new.original_donation->>'category',
        new.original_donation->>'veg_non_veg',
        new.requested_quantity,
        (new.original_donation->>'servings')::integer,
        (new.original_donation->>'prepared_at')::timestamptz,
        (new.original_donation->>'expiry_time')::timestamptz,
        (new.original_donation->>'pickup_start')::timestamptz,
        (new.original_donation->>'pickup_end')::timestamptz,
        new.original_donation->>'image_url',
        new.original_donation->>'pickup_address',
        new.original_donation->>'gps_location',
        new.original_donation->>'need_transportation',
        new.original_donation->>'special_instructions',
        'available'
      );
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_order_cancelled_quantity on public.orders;
create trigger on_order_cancelled_quantity
  after update of status on public.orders
  for each row execute procedure public.handle_order_cancelled_quantity_restoration();

-- Trigger function: Create automated dashboard notifications
create or replace function public.handle_order_notifications()
returns trigger as $$
declare
  v_donor_id text;
  v_food_name text;
  v_ngo_name text;
begin
  select donor_id, food_name into v_donor_id, v_food_name from public.food_donations where id = new.donation_id;
  select organization_name into v_ngo_name from public.organizations where id = new.organization_id;

  -- 1. Order Placed -> Notify Donor
  if TG_OP = 'INSERT' then
    insert into public.notifications (user_id, order_id, type, title, message)
    values (
      v_donor_id,
      new.id,
      'new_order',
      'New Food Request',
      v_ngo_name || ' has requested ' || new.requested_quantity || ' servings of ' || v_food_name || '.'
    );
  end if;

  -- 2. Order Updated -> Notify Receiver (NGO) on status change
  if TG_OP = 'UPDATE' and old.status <> new.status then
    if new.status = 'accepted' then
      insert into public.notifications (user_id, order_id, type, title, message)
      values (
        new.receiver_id,
        new.id,
        'order_accepted',
        'Request Accepted',
        'Your request for ' || v_food_name || ' was accepted by the donor. Pickup ETA: ' || coalesce(new.prep_time, '30 Minutes') || '.'
      );
    elsif new.status = 'rejected' then
      insert into public.notifications (user_id, order_id, type, title, message)
      values (
        new.receiver_id,
        new.id,
        'order_rejected',
        'Request Declined',
        'Your request for ' || v_food_name || ' was declined by the donor.'
      );
    elsif new.status = 'delivered' then
      insert into public.notifications (user_id, order_id, type, title, message)
      values (
        new.receiver_id,
        new.id,
        'order_delivered',
        'Order Delivered',
        'Your requested food item (' || v_food_name || ') has been successfully marked as delivered!'
      );
    end if;
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_order_notification_trigger on public.orders;
create trigger on_order_notification_trigger
  after insert or update of status on public.orders
  for each row execute procedure public.handle_order_notifications();

-- =========================================================================
-- 4. DATABASE INDEXES FOR PERFORMANCE
-- =========================================================================

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_food_donations_donor on public.food_donations(donor_id);
create index if not exists idx_food_donations_status on public.food_donations(status);
create index if not exists idx_food_donations_created_at on public.food_donations(created_at);
create index if not exists idx_orders_donation on public.orders(donation_id);
create index if not exists idx_orders_receiver on public.orders(receiver_id);
create index if not exists idx_orders_organization on public.orders(organization_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_messages_order_id on public.messages(order_id);

-- =========================================================================
-- 5. STORAGE BUCKETS SETUP
-- =========================================================================

insert into storage.buckets (id, name, public) values ('food-images', 'food-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('profile-images', 'profile-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('organization-documents', 'organization-documents', false) on conflict (id) do nothing;

-- Drop existing storage policies if any to prevent recreate errors
drop policy if exists "Allow select access to public buckets objects" on storage.objects;
drop policy if exists "Allow uploads to public buckets objects" on storage.objects;
drop policy if exists "Allow owners to edit own objects in public buckets" on storage.objects;
drop policy if exists "Allow organization owners select access to documents" on storage.objects;
drop policy if exists "Allow authenticated uploads to organization documents" on storage.objects;

-- Storage Security Policies on storage.objects
create policy "Allow select access to public buckets objects" on storage.objects for select using (bucket_id in ('food-images', 'profile-images'));
create policy "Allow uploads to public buckets objects" on storage.objects for insert with check (bucket_id in ('food-images', 'profile-images'));
create policy "Allow owners to edit own objects in public buckets" on storage.objects for update using (bucket_id in ('food-images', 'profile-images'));

create policy "Allow organization owners select access to documents" on storage.objects for select using (bucket_id = 'organization-documents');
create policy "Allow authenticated uploads to organization documents" on storage.objects for insert with check (bucket_id = 'organization-documents');
