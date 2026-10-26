import biometricFaceImg from "../assets/biometric-face-scanner.jpg";

export default function BiometricFaceScanner() {
  return (
    <div className="biometric-scanner-module" aria-hidden="true">
      {/* Corner Brackets */}
      <div className="biometric-corners">
        <span className="corner corner-tl" />
        <span className="corner corner-tr" />
        <span className="corner corner-bl" />
        <span className="corner corner-br" />
      </div>

      {/* Top Telemetry Header */}
      <div className="biometric-telemetry-top">
        <span className="biometric-status-pill">
          <span className="status-dot-pulse" />
          SYSTEM_ONLINE
        </span>
        <span className="biometric-id-tag">AI_INVESTIGATION_NODE // MATRIX_SCAN</span>
      </div>

      {/* Central Visual Stage */}
      <div className="biometric-stage">
        {/* Subtle matrix cyber grid */}
        <div className="biometric-grid-layer" />

        {/* 2D Biometric Face Visual Asset */}
        <div className="biometric-face-wrapper">
          <img
            src={biometricFaceImg}
            alt="2D Biometric Face Fingerprint Matrix"
            className="biometric-face-img"
          />
          {/* Subtle ambient pulse ring behind the face */}
          <div className="biometric-reticle-ring" />
        </div>

        {/* Continuous Automated Sweeping Laser Scan Line */}
        <div className="biometric-laser-scanner">
          <div className="laser-beam-core" />
          <div className="laser-glow-spread" />
          <div className="laser-pulse-sheen" />
        </div>
      </div>

      {/* Bottom Telemetry Info */}
      <div className="biometric-telemetry-bottom">
        <div className="telemetry-col">
          <span className="telemetry-label">BIOMETRIC ENCODING</span>
          <span className="telemetry-value">512-D EMBEDDINGS</span>
        </div>
        <div className="telemetry-divider" />
        <div className="telemetry-col">
          <span className="telemetry-label">MATCH PROTOCOL</span>
          <span className="telemetry-value">FACENET / LBPH</span>
        </div>
        <div className="telemetry-divider" />
        <div className="telemetry-col">
          <span className="telemetry-label">SECURITY LEVEL</span>
          <span className="telemetry-value highlight">RESTRICTED L-4</span>
        </div>
      </div>
    </div>
  );
}
