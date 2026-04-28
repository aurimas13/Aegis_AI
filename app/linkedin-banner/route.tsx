import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

// 1200×627 landscape — LinkedIn link-preview / share-card spec.
// Two-column composition: brand block on the left, KPIs + CTA on the right.
// All content inside a 1080×507 safe zone (60px margin) so nothing clips.

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #FBF8F2 0%, #F3EEE3 55%, #E5DBC2 100%)",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          color: "#1B2230",
          position: "relative",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(19,114,103,0.18) 0%, rgba(19,114,103,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -160,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,155,60,0.16) 0%, rgba(200,155,60,0) 70%)",
            display: "flex",
          }}
        />

        {/* SAFE ZONE: 1080 × 507, 60px margin on each side */}
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 60,
            right: 60,
            bottom: 60,
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between",
            gap: 40,
          }}
        >
          {/* ── Left column: brand + headline ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 640,
            }}
          >
            {/* Brand mark */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  background:
                    "linear-gradient(140deg, #15806F 0%, #137267 60%, #0E5B52 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 18px 40px rgba(19,114,103,0.40), 0 0 0 4px rgba(19,114,103,0.10)",
                }}
              >
                <svg
                  width="40"
                  height="40"
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
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#137267",
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  Aegis AI
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "#5F6779",
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                    fontWeight: 600,
                    marginTop: 5,
                  }}
                >
                  Enterprise AI Governance
                </span>
              </div>
            </div>

            {/* Headline */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  lineHeight: 1.05,
                  color: "#1B2230",
                  letterSpacing: -1.4,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span>Enterprise AI,</span>
                <span style={{ color: "#137267" }}>built to be governed.</span>
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: "#3F485C",
                  lineHeight: 1.4,
                  maxWidth: 620,
                  display: "flex",
                }}
              >
                Real-time cost attribution, embedded compliance, and a full
                audit trail — applied to legacy modernization and ITSM.
              </div>
            </div>

            {/* Author footer */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span style={{ fontSize: 14, color: "#5F6779", letterSpacing: 0.5 }}>
                Designed & built by
              </span>
              <span
                style={{ fontSize: 22, fontWeight: 800, color: "#1B2230" }}
              >
                Aurimas Nausedas · Fractional AI PM · AI Architect
              </span>
              <span
                style={{
                  fontSize: 16,
                  color: "#137267",
                  fontWeight: 700,
                  marginTop: 4,
                }}
              >
                aegis.aurimas.io
              </span>
            </div>
          </div>

          {/* ── Right column: KPI card ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 12,
              padding: "24px 24px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.68)",
              border: "1px solid rgba(19,114,103,0.22)",
              boxShadow: "0 18px 44px rgba(19,114,103,0.12)",
              width: 400,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                fontWeight: 700,
                color: "#137267",
                letterSpacing: 1.6,
                textTransform: "uppercase",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#137267",
                  display: "flex",
                  boxShadow: "0 0 0 4px rgba(19,114,103,0.18)",
                }}
              />
              Live demo · production-grade
            </div>

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
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 14,
                  paddingBottom: 10,
                  borderBottom: "1px solid rgba(19,114,103,0.12)",
                }}
              >
                <span style={{ fontSize: 16, color: "#3F485C", fontWeight: 500 }}>
                  {s.label}
                </span>
                <span
                  style={{ fontSize: 36, fontWeight: 800, color: "#137267" }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 627,
    }
  );
}
