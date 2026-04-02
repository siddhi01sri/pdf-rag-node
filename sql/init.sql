create extension if not exists vector;

create table if not exists documents (
  id bigserial primary key,
  filename text not null,
  original_name text not null,
  file_path text not null,
  file_size bigint,
  uploaded_at timestamptz default now()
);

create table if not exists document_chunks (
  id bigserial primary key,
  document_id bigint not null references documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding vector(768) not null,
  created_at timestamptz default now()
);

create index if not exists idx_document_chunks_document_id
on document_chunks(document_id);