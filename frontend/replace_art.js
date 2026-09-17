const fs = require('fs');
let content = fs.readFileSync('src/pages/LogSign.jsx', 'utf8');

const newArt = \
      <section className="auth-art" style={{ position: 'relative', overflow: 'hidden', backgroundColor: 'var(--ink, #1d2821)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10%' }}>
        {/* Coral Accent Circle */}
        <div style={{ position: 'absolute', top: '15%', right: '-15%', width: 'clamp(250px, 40vw, 450px)', height: 'clamp(250px, 40vw, 450px)', borderRadius: '50%', backgroundColor: 'var(--coral, #ff6b5b)', opacity: 0.9 }} />
        
        {/* Dynamic Stylized Sports Court SVG */}
        <svg style={{ position: 'absolute', bottom: '-5%', left: '-10%', width: '120%', height: '55%', opacity: 0.15, transform: 'perspective(600px) rotateX(65deg)' }} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <rect x="10" y="10" width="80" height="80" fill="none" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="#ffffff" strokeWidth="1.5" />
          <rect x="25" y="10" width="50" height="80" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="2" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        </svg>

        <div style={{ position: 'relative', zIndex: 10, color: 'var(--paper, #fffdf8)' }}>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: '700', lineHeight: 1.05, margin: 0, letterSpacing: '-0.03em' }}>
            PLAY<br />
            <span style={{ color: 'var(--coral, #ff6b5b)' }}>BOOK</span><br />
            CONNECT
          </h2>
          <p style={{ marginTop: '24px', fontSize: 'clamp(16px, 2vw, 18px)', color: 'rgba(255, 255, 255, 0.7)', maxWidth: '320px', lineHeight: 1.5 }}>
            Your local sports booking platform for badminton, turf, and tennis.
          </p>
        </div>

        <span className="auth-art-caption" style={{ position: 'absolute', bottom: '40px', left: '10%', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace', fontSize: '12px', zIndex: 10, letterSpacing: '0.05em' }}>
          QUICKCOURT / MEMBER ACCESS
        </span>
      </section>
\.trim();

content = content.replace(
  /<section className="auth-art">[\s\S]*?<\/section>/,
  newArt
);

fs.writeFileSync('src/pages/LogSign.jsx', content);
