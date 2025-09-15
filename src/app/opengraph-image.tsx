import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  const title = 'Nabil Saragih';
  const subtitle = 'AI & IoT Engineer';
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #0b1220, #1f2937)',
          color: '#fff',
          padding: '72px',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>
        <div style={{ height: 14 }} />
        <div
          style={{
            fontSize: 28,
            opacity: 0.9,
            fontWeight: 500,
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    { ...size }
  );
}

