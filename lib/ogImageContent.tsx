const GAMES = ["DevTermo", "Caça-Dev", "CodeBug", "CruzaDev"];

export function OgImageContent() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0D0F12",
        backgroundImage:
          "radial-gradient(circle at 22% 20%, rgba(99,102,241,0.28), transparent 42%), radial-gradient(circle at 82% 82%, rgba(16,185,129,0.20), transparent 42%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 92,
          fontWeight: 700,
          color: "#E5E7EB",
          fontFamily: "monospace",
        }}
      >
        <span style={{ color: "#6366F1" }}>{"</>"}</span>
        <span>Codaily</span>
      </div>

      <div
        style={{
          marginTop: 22,
          fontSize: 30,
          color: "#9CA3AF",
        }}
      >
        Jogos diários de lógica para devs
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 52 }}>
        {GAMES.map((label) => (
          <div
            key={label}
            style={{
              display: "flex",
              padding: "12px 26px",
              borderRadius: 999,
              border: "1px solid #2A2E37",
              backgroundColor: "#16191E",
              color: "#E5E7EB",
              fontSize: 24,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
