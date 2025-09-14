import { NextResponse } from 'next/server';
import { getAllPostsMeta } from '@/lib/posts';

export async function GET() {
  const posts = getAllPostsMeta();
  return NextResponse.json(posts, {
    headers: {
      // Cache list for 60s and allow stale for 10 minutes
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=600',
    },
  });
}
