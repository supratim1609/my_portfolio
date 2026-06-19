import { ImageResponse } from 'next/og';
import { getPostData } from '@/lib/blog';

export const alt = 'Supratim Dhara - Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            color: 'white',
            background: 'black',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Post Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            zIndex: 0,
          }}
        />

        {/* Top left accent */}
        <div style={{ display: 'flex', alignItems: 'center', zIndex: 1 }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#FF3B30', borderRadius: '50%', marginRight: '16px' }} />
          <span style={{ color: '#FF3B30', fontSize: '24px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 600 }}>
            SUPRATIM.DEV / NOTES
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            zIndex: 1,
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          <h1
            style={{
              fontSize: '84px',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
              maxWidth: '900px',
            }}
          >
            {post.metadata.title}
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: '#A1A1A1',
              margin: 0,
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            {post.metadata.description}
          </p>
        </div>

        {/* Footer / Meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <span style={{ color: '#555', fontSize: '24px', fontFamily: 'monospace', textTransform: 'uppercase' }}>
              {new Date(post.metadata.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {post.metadata.tags && post.metadata.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ color: '#555', fontSize: '24px' }}>•</span>
                <span style={{ color: '#555', fontSize: '24px', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                  {post.metadata.tags.slice(0, 3).join(', ')}
                </span>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: 'white', fontSize: '28px', fontWeight: 600 }}>Supratim Dhara</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
