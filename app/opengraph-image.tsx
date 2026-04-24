import { ImageResponse } from '@vercel/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt =
  'Aegis AI — Enterprise AI Governance, Observability & Cost Tracking. By Aurimas Nausedas.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background:
            'linear-gradient(135deg, #FBF8F2 0%, #F3EEE3 55%, #E8DFC9 100%)',
          fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
          color: '#1B2230',
          position: 'relative',
        }}
      >
        {/* Decorative shield watermark */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(19,114,103,0.14) 0%, rgba(19,114,103,0) 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -120,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(200,155,60,0.12) 0%, rgba(200,155,60,0) 70%)',
            display: 'flex',
          }}
        />

        {/* Top: brand bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 18,
              background: '#137267',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(19,114,103,0.35)',
            }}
          >
            {/* Shield SVG */}
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FBF8F2"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: '#137267',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
            >
              Aegis AI
            </span>
            <span style={{ fontSize: 18, color: '#5F6779', marginTop: 2 }}>
              aegis.aurimas.io
            </span>
          </div>
        </div>

        {/* Middle: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 16px',
                background: 'rgba(19,114,103,0.10)',
                border: '1px solid rgba(19,114,103,0.25)',
                borderRadius: 999,
                fontSize: 18,
                color: '#137267',
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Governance-First Enterprise AI
            </div>
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              color: '#1B2230',
              letterSpacing: -1.5,
              maxWidth: 980,
              display: 'flex',
            }}
          >
            Enterprise AI, with accountability built in.
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#3F485C',
              lineHeight: 1.35,
              maxWidth: 960,
              display: 'flex',
            }}
          >
            Real-time cost attribution, embedded compliance, and a full audit
            trail — applied to legacy modernization and ITSM automation.
          </div>
        </div>

        {/* Bottom: stats + author */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { value: '100%', label: 'Shadow AI Eliminated' },
              { value: '67%', label: 'Cycle Time Cut' },
              { value: '13', label: 'Teams Deployed' },
            ].map((s) => (
              <div
                key={s.label}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <span
                  style={{ fontSize: 40, fontWeight: 800, color: '#137267' }}
                >
                  {s.value}
                </span>
                <span style={{ fontSize: 16, color: '#5F6779', marginTop: 2 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <span style={{ fontSize: 16, color: '#5F6779' }}>Built by</span>
            <span
              style={{ fontSize: 22, fontWeight: 700, color: '#1B2230' }}
            >
              Aurimas Nausedas
            </span>
            <span style={{ fontSize: 15, color: '#5F6779', marginTop: 2 }}>
              Fractional AI PM · AI Architect
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
