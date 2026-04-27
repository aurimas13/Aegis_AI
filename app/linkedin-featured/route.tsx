import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

// 1200×1200 square — designed for LinkedIn Featured.
// Everything important sits inside a centered ~960×960 safe zone so it
// survives LinkedIn's center-crop in any context (carousel, modal, link
// preview). The logo is centered, oversized, and never near an edge.

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(160deg, #FBF8F2 0%, #F3EEE3 55%, #E5DBC2 100%)",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          color: "#1B2230",
          position: "relative",
        }}
      >
        {/* Decorative ambient blobs (kept in extreme corners — purely aesthetic) */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -220,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(19,114,103,0.18) 0%, rgba(19,114,103,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -220,
            width: 760,
            height: 760,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,155,60,0.16) 0%, rgba(200,155,60,0) 70%)",
            display: "flex",
          }}
        />

        {/* ── SAFE ZONE: 1040×1040 centered (80px margin all sides) ── */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 80,
            right: 80,
            bottom: 80,
            width: 1040,
            height: 1040,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* ── Top: centered brand block ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                width: 184,
                height: 184,
                borderRadius: 44,
                background:
                  "linear-gradient(140deg, #15806F 0%, #137267 60%, #0E5B52 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 28px 60px rgba(19,114,103,0.45), 0 0 0 6px rgba(19,114,103,0.10)",
              }}
            >
              <svg
                width="104"
                height="104"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FBF8F2"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: "#137267",
                  letterSpacing: 6,
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                Aegis AI
              </span>
              <span
                style={{
                  fontSize: 22,
                  color: "#5F6779",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Enterprise AI Governance Platform
              </span>
            </div>
          </div>

          {/* ── Middle: headline ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 78,
                fontWeight: 800,
                lineHeight: 1.05,
                color: "#1B2230",
                letterSpacing: -2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span>Enterprise AI,</span>
              <span style={{ color: "#137267" }}>with accountability</span>
              <span>built in.</span>
            </div>

            <div
              style={{
                fontSize: 26,
                color: "#3F485C",
                lineHeight: 1.4,
                maxWidth: 880,
                display: "flex",
                textAlign: "center",
              }}
            >
              Real-time cost attribution, embedded compliance, and a full audit
              trail — applied to legacy modernization and ITSM automation.
            </div>
          </div>

          {/* ── KPIs ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 18,
              padding: "26px 32px",
              borderRadius: 22,
              background: "rgba(255,255,255,0.62)",
              border: "1px solid rgba(19,114,103,0.20)",
              boxShadow: "0 16px 40px rgba(19,114,103,0.10)",
              width: "100%",
            }}
          >
            {[
              { value: "100%", label: "Shadow AI eliminated" },
              { value: "67%", label: "Cycle time cut" },
              { value: "13", label: "Teams deployed" },
              { value: "$2.4M", label: "Annual savings" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <span
                  style={{ fontSize: 50, fontWeight: 800, color: "#137267" }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: 17,
                    color: "#5F6779",
                    marginTop: 4,
                    textAlign: "center",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Bottom attribution (centered, single row) ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 18, color: "#5F6779", letterSpacing: 0.5 }}>
              Designed & built by
            </span>
            <span
              style={{ fontSize: 32, fontWeight: 800, color: "#1B2230" }}
            >
              Aurimas Nausedas · Fractional AI PM · AI Architect
            </span>
            <span
              style={{ fontSize: 20, color: "#137267", fontWeight: 700, marginTop: 4 }}
            >
              aegis.aurimas.io
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 1200,
    }
  );
}
