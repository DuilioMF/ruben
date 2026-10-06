create table if not exists public.ruben_access (
  email text primary key,
  user_id uuid unique references auth.users(id) on delete set null,
  active boolean not null default false,
  selected_company_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz
);

alter table public.ruben_access enable row level security;

revoke all on table public.ruben_access from anon, authenticated, public;

comment on table public.ruben_access is
  'Acceso manual a Ruben. Cada mail queda inactivo por defecto hasta aprobación explícita.';
comment on column public.ruben_access.active is
  'Tilde de habilitación manual. false por defecto.';
comment on column public.ruben_access.selected_company_id is
  'Compañía activa elegida por el usuario dentro de Ruben.';
