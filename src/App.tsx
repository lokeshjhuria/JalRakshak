const metrics = [
  { value: '24/7', label: 'Live monitoring' },
  { value: '96%', label: 'Water safety index' },
  { value: '3x', label: 'Faster incident response' },
];

const features = [
  {
    icon: '💧',
    title: 'Real-time quality checks',
    text: 'Track pH, turbidity, chlorine, and contamination alerts from a single dashboard.',
  },
  {
    icon: '📡',
    title: 'Smart sensing network',
    text: 'Receive instant notifications when conditions drift outside safe operating thresholds.',
  },
  {
    icon: '🧭',
    title: 'Actionable insights',
    text: 'Turn field data into clear guidance for operators, communities, and local authorities.',
  },
];

const steps = [
  'Deploy smart sensor stations and connect data sources.',
  'View live water health scores and anomaly alerts in real time.',
  'Coordinate action plans and safeguard communities faster.',
];

const partners = ['NWMDC', 'CleanFlow', 'AquaSafe', 'Harbor Labs', 'GreenWater'];

function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-icon">J</div>
          <div>
            <span className="brand-name">JalRakshak</span>
            <small>Water intelligence</small>
          </div>
        </div>

        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#impact">Impact</a>
          <a href="#contact">Contact</a>
        </nav>

        <button className="primary-button">Book a demo</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Safer water, smarter decisions</span>
            <h1>Protect every drop with proactive water monitoring.</h1>
            <p>
              JalRakshak helps cities, utilities, and communities monitor water safety,
              detect risks early, and respond before problems spread.
            </p>

            <div className="cta-row">
              <button className="primary-button">Get started</button>
              <button className="secondary-button">View dashboard</button>
            </div>

            <div className="metrics-grid">
              {metrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-glow" />
            <div className="dashboard-card">
              <div className="card-header">
                <span>Water Health Index</span>
                <span className="status-pill">Stable</span>
              </div>

              <div className="score-ring">
                <div className="score-core">
                  <strong>96%</strong>
                  <span>Safe</span>
                </div>
              </div>

              <div className="mini-stats">
                <div>
                  <label>pH</label>
                  <strong>7.4</strong>
                </div>
                <div>
                  <label>Turbidity</label>
                  <strong>1.2 NTU</strong>
                </div>
                <div>
                  <label>Chlorine</label>
                  <strong>0.9 ppm</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="partners" aria-label="Trusted partners">
          <p>Trusted by operators, municipalities, and sustainability teams.</p>
          <div className="partner-row">
            {partners.map((partner) => (
              <span key={partner}>{partner}</span>
            ))}
          </div>
        </section>

        <section id="features" className="section-block">
          <div className="section-heading">
            <span className="eyebrow">Why JalRakshak</span>
            <h2>Built for modern water infrastructure.</h2>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="solutions" className="section-block split-section">
          <div className="side-panel">
            <span className="eyebrow">How it works</span>
            <h2>From sensor data to safer communities.</h2>
            <ul className="step-list">
              {steps.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="insight-panel">
            <div className="insight-card">
              <div className="insight-header">
                <span>Water alerts</span>
                <span className="warning-tag">2 critical</span>
              </div>
              <div className="alert-list">
                <div>
                  <strong>North Reservoir</strong>
                  <small>pH drift +9% over baseline</small>
                </div>
                <div>
                  <strong>South Pump Station</strong>
                  <small>Chlorine below target threshold</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="impact" className="cta-banner">
          <div>
            <span className="eyebrow">Impact that matters</span>
            <h2>Reduce waste, improve confidence, and protect lives.</h2>
          </div>
          <button className="primary-button">Talk to our team</button>
        </section>
      </main>

      <footer id="contact" className="footer">
        <div>
          <span className="brand-name">JalRakshak</span>
          <p>Smart monitoring for resilient water ecosystems.</p>
        </div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#impact">Impact</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
