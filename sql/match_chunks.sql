create or replace function match_document_chunks (
  query_embedding vector(768),
  match_count int default 5
)
returns table (
  id bigint,
  document_id bigint,
  chunk_index integer,
  content text,
  similarity float
)
language sql
as $$
  select
    dc.id,
    dc.document_id,
    dc.chunk_index,
    dc.content,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;