import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  // Path to the asset file in src/app/dearly-beloved-san/assets
  const filePath = path.join(
    process.cwd(),
    'src',
    'app',
    'dearly-beloved-san',
    'assets',
    'Nadhif Basalamah - kota ini tak sama tanpamu.mp3'
  );

  if (!fs.existsSync(filePath)) {
    // Fallback to public/music if moved
    const fallbackPath = path.join(
      process.cwd(),
      'public',
      'music',
      'nadhif-basalamah-kota-ini-tak-sama-tanpamu.mp3'
    );
    if (!fs.existsSync(fallbackPath)) {
      return new NextResponse('Audio file not found', { status: 404 });
    }
    return serveFile(request, fallbackPath);
  }

  return serveFile(request, filePath);
}

function serveFile(request: NextRequest, filePath: string) {
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  if (range) {
    // Handle HTTP 206 Partial Content for audio scrubbing
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const fileStream = fs.createReadStream(filePath, { start, end });
    const stream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
    });

    return new NextResponse(stream as BodyInit, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': 'audio/mpeg',
      },
    });
  }

  // Full content
  const fileStream = fs.createReadStream(filePath);
  const stream = new ReadableStream({
    start(controller) {
      fileStream.on('data', (chunk) => controller.enqueue(chunk));
      fileStream.on('end', () => controller.close());
      fileStream.on('error', (err) => controller.error(err));
    },
  });

  return new NextResponse(stream as BodyInit, {
    status: 200,
    headers: {
      'Content-Length': fileSize.toString(),
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

