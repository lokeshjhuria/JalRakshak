import { ChangeEvent, FormEvent, useState } from 'react';

const metrics = [
  { value: '24/7', label: 'Live monitoring' },
  { value: '96%', label: 'Water safety index' },
  { value: '3x', label: 'Faster incident response' },
];

type WaterReport = {
  area: string;
  quality: number;
  ph: number;
  turbidity: number;
  chlorine: number;
  status: string;
  summary: string;
  latitude: number;
  longitude: number;
};

const areaNames = ['North District', 'Riverside', 'Lakeview', 'Green Valley', 'South Ward', 'Harbor City'];

function getNearestZone(latitude: number, longitude: number): string {
  const zoneIndex = Math.abs(Math.round(latitude + longitude)) % areaNames.length;
  return areaNames[zoneIndex];
}

function buildWaterReport(latitude: number, longitude: number): WaterReport {
  const quality = Math.max(78, Math.min(99, Math.round(92 + Math.sin(latitude * 8) * 6 + Math.cos(longitude * 10) * 3)));
  const ph = Number((6.8 + Math.sin(latitude * 4) * 0.9 + Math.cos(longitude * 5) * 0.5).toFixed(1));
  const turbidity = Number((0.7 + Math.abs(Math.sin(longitude * 6)) * 1.8).toFixed(1));
  const chlorine = Number((0.8 + Math.abs(Math.cos(latitude * 5)) * 0.9).toFixed(1));
  const status = quality >= 90 ? 'Healthy' : quality >= 80 ? 'Monitor' : 'Alert';

  return {
    area: getNearestZone(latitude, longitude),
    quality,
    ph,
    turbidity,
    chlorine,
    status,
    latitude,
    longitude,
    summary:
      quality >= 90
        ? 'Water conditions are stable and safe for routine community use. Recommended chlorine residual and turbidity remain within normal operating range.'
        : quality >= 80
          ? 'Conditions are acceptable but should be watched closely during peak demand and after heavy rainfall.'
          : 'Water quality requires attention and immediate operational review. Check treatment efficiency and distribution integrity.',
  };
}

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
  'Deploy smart sensor stations and connect validated field data with utility control systems.',
  'Track pH, turbidity, residual chlorine, and contamination trends in real time.',
  'Trigger corrective actions and protect public health with faster response planning.',
];

const partners = ['NWMDC', 'CleanFlow', 'AquaSafe', 'Harbor Labs', 'GreenWater'];

const purificationSteps = [
  'Coagulation and flocculation to remove suspended solids.',
  'Sedimentation and filtration for safe physical treatment.',
  'Disinfection and pH balancing to protect public health.',
];

const standards = [
  { label: 'pH range', value: '6.5 - 8.5' },
  { label: 'Turbidity', value: '< 1 NTU' },
  { label: 'Residual chlorine', value: '0.5 - 1.5 ppm' },
  { label: 'Lead limit', value: '< 10 ppb' },
];

const dashboardStats = [
  { label: 'Active stations', value: '128' },
  { label: 'Safe zones', value: '94%' },
  { label: 'Alerts resolved', value: '31' },
];

function App() {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [report, setReport] = useState<WaterReport | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location detection is not supported on this device.');
      return;
    }

    setLocationLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextReport = buildWaterReport(coords.latitude, coords.longitude);
        setReport(nextReport);
        setLocationLoading(false);
      },
      () => {
        const fallback = buildWaterReport(22.5726, 88.3639);
        setReport(fallback);
        setLocationError('Using your nearest tracked zone because live access was unavailable.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');
    setView('dashboard');
  };

  const handleLogout = () => {
    setView('landing');
    setFormData({ email: '', password: '' });
    setError('');
  };

  if (view === 'login') {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-icon">J</div>
            <div>
              <span className="brand-name">JalRakshak</span>
              <small>Secure access</small>
            </div>
          </div>

          <div className="auth-header">
            <span className="eyebrow">Welcome back</span>
            <h2>Sign in to your portal</h2>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            <label>
              Email address
              <input
                type="email"
                name="email"
                placeholder="operator@jalrakshak.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </label>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="primary-button auth-submit">Login</button>
          </form>

          <div className="auth-footer">
            <button type="button" className="text-button" onClick={() => setView('landing')}>
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'dashboard') {
    return (
      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div className="brand-wrap">
            <div className="brand-icon">J</div>
            <div>
              <span className="brand-name">JalRakshak</span>
              <small>Operations hub</small>
            </div>
          </div>

          <div className="dashboard-actions">
            <span className="status-pill success">Online</span>
            <button className="secondary-button" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <main className="dashboard-grid">
          <section className="dashboard-panel large-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">System overview</span>
                <h3>Water network health</h3>
              </div>
              <span className="status-pill">Updated 2 min ago</span>
            </div>

            <div className="score-ring dashboard-score">
              <div className="score-core">
                <strong>96%</strong>
                <span>Safe</span>
              </div>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="panel-head small-head">
              <h3>Key stats</h3>
            </div>
            <div className="stats-stack">
              {dashboardStats.map((item) => (
                <div key={item.label} className="stat-box">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-panel wide-panel">
            <div className="panel-head">
              <h3>Recent alerts</h3>
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
              <div>
                <strong>Central Treatment</strong>
                <small>Flow rate increased by 12%</small>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

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

        <button className="primary-button" onClick={() => setView('login')}>
          Login
        </button>
      </header>

      <main>
        <section className="location-report-card">
          <div>
            <span className="eyebrow">Live water report</span>
            <h2>Check the water quality around your area.</h2>
          </div>

          <div className="location-actions">
            <button className="primary-button" onClick={detectLocation} disabled={locationLoading}>
              {locationLoading ? 'Detecting...' : 'Use my location'}
            </button>
          </div>

          {locationError && <p className="location-warning">{locationError}</p>}

          {report ? (
            <div className="report-box">
              <div className="report-header">
                <div>
                  <span className="report-label">Location</span>
                  <strong>{report.area}</strong>
                </div>
                <span className="status-pill success">{report.status}</span>
              </div>

              <div className="location-details">
                <span>Live coordinates</span>
                <strong>
                  {report.latitude.toFixed(4)}°, {report.longitude.toFixed(4)}°
                </strong>
              </div>

              <div className="report-grid">
                <div>
                  <span>Water quality</span>
                  <strong>{report.quality}%</strong>
                </div>
                <div>
                  <span>pH</span>
                  <strong>{report.ph}</strong>
                </div>
                <div>
                  <span>Turbidity</span>
                  <strong>{report.turbidity} NTU</strong>
                </div>
                <div>
                  <span>Chlorine</span>
                  <strong>{report.chlorine} ppm</strong>
                </div>
              </div>

              <p>{report.summary}</p>
            </div>
          ) : (
            <p className="empty-report">Tap “Use my location” to generate a water health report for your area.</p>
          )}
        </section>

        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Safer water, smarter decisions</span>
            <h1>Protect every drop with proactive water monitoring.</h1>
            <p>
              JalRakshak helps cities, utilities, and communities monitor water safety,
              detect risks early, and respond before problems spread.
            </p>

            <div className="cta-row">
              <button className="primary-button" onClick={() => setView('login')}>
                Get started
              </button>
              <button className="secondary-button" onClick={() => setView('dashboard')}>
                View dashboard
              </button>
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
                <span className="status-pill success">Stable</span>
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

        <section className="section-block info-grid">
          <div className="info-panel">
            <span className="eyebrow">Purification process</span>
            <h2>Reliable treatment from source to tap.</h2>
            <ul className="purification-list">
              {purificationSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="info-panel standards-panel">
            <span className="eyebrow">Quality standards</span>
            <h2>Measured against regulatory benchmarks.</h2>
            <div className="standards-grid">
              {standards.map((item) => (
                <div key={item.label} className="standard-box">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
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
          <button className="primary-button" onClick={() => setView('login')}>
            Talk to our team
          </button>
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
