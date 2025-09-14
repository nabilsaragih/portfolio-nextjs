import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/posts';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const result = getPostBySlug(slug);
  if (!result) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(result, {
    headers: {
      // Ensure fresh HTML for active editing
      'Cache-Control': 'no-store',
    },
  });
}
