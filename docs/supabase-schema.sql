-- ─── SUPABASE SQL SCHEMA ─────────────────────────────────────────────────────
-- Ejecuta esto en Supabase → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────────────────────

-- Extensión para UUIDs
create extension if not exists "uuid-ossp";

-- ── Tabla: canciones ─────────────────────────────────────────────────────────
create table if not exists public.canciones (
  id            text primary key,           -- ID generado en cliente
  titulo        text not null,
  autor         text default '',
  tono          text default 'G',
  tempo         integer default 80,
  categoria     jsonb default '[]',
  tags          jsonb default '[]',
  secciones     jsonb default '[]',         -- Array de secciones con acordes/letra
  ensayo        jsonb default '{}',         -- BPM ensayo, pistas, notas, youtubeId
  freeshow_data jsonb default null,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  created_by    uuid references auth.users(id) on delete set null,
  -- Soft-delete para sync offline
  deleted       boolean default false
);

-- ── Tabla: setlists ───────────────────────────────────────────────────────────
create table if not exists public.setlists (
  id          text primary key,
  nombre      text not null,
  tipo        text default 'Domingo',
  fecha       text default '',
  cantos      jsonb default '[]',           -- [{cantoId, tonoCustom}]
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  created_by  uuid references auth.users(id) on delete set null,
  deleted     boolean default false
);

-- ── Índices ───────────────────────────────────────────────────────────────────
create index if not exists canciones_titulo_idx on public.canciones(titulo);
create index if not exists canciones_updated_idx on public.canciones(updated_at desc);
create index if not exists setlists_fecha_idx on public.setlists(fecha);
create index if not exists setlists_updated_idx on public.setlists(updated_at desc);

-- ── Trigger: auto-actualizar updated_at ──────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_canciones_updated_at on public.canciones;
create trigger set_canciones_updated_at
  before update on public.canciones
  for each row execute procedure public.handle_updated_at();

drop trigger if exists set_setlists_updated_at on public.setlists;
create trigger set_setlists_updated_at
  before update on public.setlists
  for each row execute procedure public.handle_updated_at();

-- ── Row Level Security (RLS) ──────────────────────────────────────────────────
alter table public.canciones enable row level security;
alter table public.setlists  enable row level security;

-- Política: usuarios autenticados pueden leer todo
create policy "Autenticados pueden leer canciones"
  on public.canciones for select
  using (auth.role() = 'authenticated');

create policy "Autenticados pueden leer setlists"
  on public.setlists for select
  using (auth.role() = 'authenticated');

-- Política: usuarios autenticados pueden insertar/actualizar/eliminar
create policy "Autenticados pueden modificar canciones"
  on public.canciones for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Autenticados pueden modificar setlists"
  on public.setlists for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── Publicar tablas para Realtime ─────────────────────────────────────────────
-- Ve a Supabase → Database → Replication y activa estas tablas, o ejecuta:
alter publication supabase_realtime add table public.canciones;
alter publication supabase_realtime add table public.setlists;

-- ── Datos de prueba (opcional) ────────────────────────────────────────────────
-- insert into public.canciones (id, titulo, autor, tono, tempo, categoria, secciones)
-- values ('1', 'Alabadle', 'Marcos Witt', 'G', 92, '["Alabanza"]', '[]');
