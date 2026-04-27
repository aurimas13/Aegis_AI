import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

// 1200×1200 square — sized for LinkedIn Featured thumbnails.
// Hit /linkedin-featured to view, then right-click → Save Image As… to upload.

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          background:
            "linear-gradient(160deg, #FBF8F2 0%, #F3EEE3 55%, #E5DBC2 100%)",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          color: "#1B2230",
          position: "relative",
          justifyContent: "space-between",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -180,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(19,114,103,0.18) 0%, rgba(19,114,103,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -180,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,155,60,0.16) 0%, rgba(200,155,60,0) 70%)",
            display: "flex",
          }}
        />

        {/* Top brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 24,
                background: "#137267",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 18px 48px rgba(19,114,103,0.4)",
              }}
            >
              <svg
                width="52"
                height="52"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FBF8F2"
                strokeWidth="2.2"
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
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#137267",
                  letterSpacing: 3,
                  textTransform: "uppercase",
                }}
              >
                Aegis AI
              </span>
              <span style={{ fontSize: 22, color: "#5F6779", marginTop: 4 }}>
                aegis.aurimas.io
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              background: "rgba(19,114,103,0.10)",
              border: "1px solid rgba(19,114,103,0.30)",
              borderRadius: 999,
              fontSize: 20,
              color: "#137267",
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            Live demo
          </div>
        </div>

        {/* Headline block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 22px",
                background: "rgba(200,155,60,0.18)",
                border: "1px solid rgba(200,155,60,0.45)",
                borderRadius: 999,
                fontSize: 22,
                color: "#8A6212",
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Enterprise AI Governance Platform
            </div>
          </div>

          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              color: "#1B2230",
              letterSpacing: -2.5,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Enterprise AI,</span>
            <span style={{ color: "#137267" }}>with accountability</span>
            <span>built in.</span>
          </div>

          <div
            style={{
              fontSize: 30,
              color: "#3F485C",
              lineHeight: 1.4,
              maxWidth: 980,
              display: "flex",
            }}
          >
            Real-time cost attribution, embedded compliance, and a full audit
            trail — applied to legacy modernization and ITSM automation.
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 24,
            padding: "32px 36px",
            borderRadius: 24,
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(19,114,103,0.18)",
            boxShadow: "0 12px 40px rgba(19,114,103,0.10)",
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
                style={{ fontSize: 56, fontWeight: 800, color: "#137267" }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: 18,
                  color: "#5F6779",
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Author footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(19,114,103,0.18)",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            <span style={{ fontSize: 18, color: "#5F6779" }}>Designed & built by</span>
            <span
              style={{ fontSize: 32, fontWeight: 800, color: "#1B2230" }}
            >
              Aurimas Nausedas
            </span>
            <span style={{ fontSize: 18, color: "#5F6779" }}>
              Fractional AI PM · AI Architect
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 18, color: "#5F6779" }}>Try it live</span>
            <span
              style={{ fontSize: 24, fontWeight: 700, color: "#137267" }}
            >
              aegis.aurimas.io
            </span>
            <span style={{ fontSize: 16, color: "#8A6212" }}>
              github.com/aurimas13/Aegis_AI
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
