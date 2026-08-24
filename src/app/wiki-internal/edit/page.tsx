import { Suspense } from 'react';
import WikiEditor from '@/components/wiki-editor';
import { requireWikiInternalSession } from '@/lib/wiki-internal-auth';

export default async function WikiInternalEditPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;
  const from = slug ? `/wiki-internal/edit?slug=${encodeURIComponent(slug)}` : '/wiki-internal/edit';
  await requireWikiInternalSession(from);
  return (
    <Suspense fallback={<div className="flex-1 p-8 text-sm text-[#6B6B80]">Đang tải trình chỉnh sửa…</div>}>
      <WikiEditor />
    </Suspense>
  );
}
