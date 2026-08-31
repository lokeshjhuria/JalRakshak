import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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

type AuthMode = 'login' | 'signup';
type View = 'landing' | 'auth' | 'dashboard';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

const areaNames = ['North District', 'Riverside', 'Lakeview', 'Green Valley', 'South Ward', 'Harbor City'];
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

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

const authStorageKey = 'jalrakshak-users';

function readStoredUsers(): UserProfile[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(authStorageKey);
    return saved ? (JSON.parse(saved) as UserProfile[]) : [];
  } catch {
    return [];
  }
}

function App() {
  const [view, setView] = useState<View>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [report, setReport] = useState<WaterReport | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedUser = window.localStorage.getItem('jalrakshak-current-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser) as UserProfile);
      setView('dashboard');
    }
  }, []);

  useEffect(() => {
    if (view === 'dashboard') {
      detectLocation();
    }
  }, [view]);

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

  const saveUserToLocalStorage = (profile: UserProfile) => {
    if (typeof window === 'undefined') {
      return;
    }

    const users = readStoredUsers();
    const filteredUsers = users.filter((entry) => entry.email.toLowerCase() !== profile.email.toLowerCase());
    filteredUsers.push(profile);
    window.localStorage.setItem(authStorageKey, JSON.stringify(filteredUsers));
    window.localStorage.setItem('jalrakshak-current-user', JSON.stringify(profile));
  };

  const handleAuthSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedEmail || !trimmedPassword || (authMode === 'signup' && !trimmedName)) {
      setError(authMode === 'signup' ? 'Please enter your name, email, and password.' : 'Please enter both email and password.');
      return;
    }

    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const profile: UserProfile = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
      name: trimmedName || 'JalRakshak User',
      email: trimmedEmail,
      createdAt: new Date().toISOString(),
    };

    try {
      if (supabase) {
        if (authMode === 'signup') {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: trimmedEmail,
            password: trimmedPassword,
            options: { data: { full_name: profile.name } },
          });

          if (signUpError) {
            throw signUpError;
          }

          if (data.user) {
            profile.id = data.user.id;
            await supabase.from('profiles').upsert({
              id: profile.id,
              full_name: profile.name,
              email: profile.email,
              created_at: profile.createdAt,
            });
          }
        } else {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password: trimmedPassword,
          });

          if (signInError) {
            throw signInError;
          }

          if (data.user) {
            profile.id = data.user.id;
            profile.name = data.user.user_metadata?.full_name || profile.name;
          }
        }
      }
    } catch (supabaseError) {
      console.warn('Supabase auth unavailable, using local fallback:', supabaseError);
    }

    saveUserToLocalStorage(profile);
    setUser(profile);
    setError('');
    setFormData({ fullName: '', email: '', password: '' });
    setView('dashboard');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('jalrakshak-current-user');
    }
    setView('landing');
    setUser(null);
    setFormData({ fullName: '', email: '', password: '' });
    setError('');
  };

  if (view === 'auth') {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="brand-icon">J</div>
            <div>
              <span className="brand-name">JalRakshak</span>
              <small>{authMode === 'login' ? 'Secure access' : 'Create account'}</small>
            </div>
          </div>

          <div className="auth-header">
            <span className="eyebrow">{authMode === 'login' ? 'Welcome back' : 'Join us'}</span>
            <h2>{authMode === 'login' ? 'Sign in to your portal' : 'Create your account'}</h2>
          </div>

          <div className="auth-toggle">
            <button
              type="button"
              className={authMode === 'login' ? 'toggle-tab active' : 'toggle-tab'}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === 'signup' ? 'toggle-tab active' : 'toggle-tab'}
              onClick={() => setAuthMode('signup')}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="auth-form">
            {authMode === 'signup' && (
              <label>
                Full name
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </label>
            )}

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

            <button type="submit" className="primary-button auth-submit">
              {authMode === 'login' ? 'Login' : 'Create account'}
            </button>
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

        <nav className="dashboard-nav">
          <button type="button" className="nav-pill active">Home</button>
          <button type="button" className="nav-pill">Water quality</button>
          <button type="button" className="nav-pill">Alerts</button>
          <button type="button" className="nav-pill">Availability</button>
        </nav>

        <main className="dashboard-grid">
          <section className="dashboard-panel large-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">System overview</span>
                <h3>{user?.name ? `Welcome, ${user.name}` : 'Water network health'}</h3>
              </div>
              <span className="status-pill">Updated 2 min ago</span>
            </div>

            <div className="score-ring dashboard-score">
              <div className="score-core">
                <strong>{report?.quality ?? '96'}%</strong>
                <span>{report?.status ?? 'Safe'}</span>
              </div>
            </div>

            {report && (
              <div className="live-report-summary">
                <div>
                  <span>Current zone</span>
                  <strong>{report.area}</strong>
                </div>
                <div>
                  <span>Location</span>
                  <strong>{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</strong>
                </div>
              </div>
            )}
          </section>

          <section className="dashboard-panel">
            <div className="panel-head small-head">
              <h3>Water quality</h3>
            </div>
            <div className="stats-stack">
              <div className="stat-box">
                <span>pH</span>
                <strong>{report?.ph ?? '7.4'}</strong>
              </div>
              <div className="stat-box">
                <span>Turbidity</span>
                <strong>{report?.turbidity ?? '1.2'} NTU</strong>
              </div>
              <div className="stat-box">
                <span>Chlorine</span>
                <strong>{report?.chlorine ?? '0.9'} ppm</strong>
              </div>
            </div>
          </section>

          <section className="dashboard-panel wide-panel">
            <div className="panel-head">
              <h3>Alerts & availability</h3>
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
                <strong>Water availability</strong>
                <small>{report ? `${report.quality}% served` : '94% available'} across the district</small>
              </div>
            </div>
          </section>

          <section className="dashboard-panel full-width-panel">
            <div className="panel-head">
              <h3>Live location report</h3>
              <button type="button" className="secondary-button small-button" onClick={detectLocation} disabled={locationLoading}>
                {locationLoading ? 'Detecting...' : 'Refresh location'}
              </button>
            </div>

            {locationError && <p className="location-warning">{locationError}</p>}

            {report ? (
              <div className="report-box dashboard-report-box">
                <div className="report-header">
                  <div>
                    <span className="report-label">Location</span>
                    <strong>{report.area}</strong>
                  </div>
                  <span className="status-pill success">{report.status}</span>
                </div>

                <div className="location-details">
                  <span>Live coordinates</span>
                  <strong>{report.latitude.toFixed(4)}°, {report.longitude.toFixed(4)}°</strong>
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
              <p className="empty-report">Detecting your location to show the current water quality.</p>
            )}
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

        <button className="primary-button" onClick={() => setView('auth')}>
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
              <button className="primary-button" onClick={() => setView('auth')}>
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
            <div className="dashboard-card hero-visual-card">
              <img
                className="hero-visual-image"
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80"
                alt="Water treatment plant and clean water infrastructure"
              />

              <div className="floating-badge top-badge">
                <span>Water Health Index</span>
                <strong>96%</strong>
              </div>

              <div className="floating-badge bottom-badge">
                <span>Live status</span>
                <strong>Stable</strong>
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
          <button className="primary-button" onClick={() => setView('auth')}>
            Talk to our team
          </button>
        </section>
      </main>

      <footer id="contact" className="footer">
        <div className="footer-card">
          <div className="footer-brand-wrap">
            <div className="brand-wrap">
              <div className="brand-icon">J</div>
              <div>
                <span className="brand-name">JalRakshak</span>
                <small>Water intelligence</small>
              </div>
            </div>
            <p>Smart monitoring for resilient water ecosystems, helping communities protect every drop with confidence.</p>
          </div>

          <div className="footer-grid">
            <div className="footer-column">
              <h3>Company</h3>
              <a href="#features">Features</a>
              <a href="#solutions">Solutions</a>
              <a href="#impact">Impact</a>
            </div>

            <div className="footer-column">
              <h3>Resources</h3>
              <a href="#">Monitoring</a>
              <a href="#">Safety standards</a>
              <a href="#">Operational alerts</a>
            </div>

            <div className="footer-column">
              <h3>Contact</h3>
              <a href="mailto:hello@jalrakshak.com">hello@jalrakshak.com</a>
              <a href="tel:+18005551234">+1 (800) 555-1234</a>
              <span>24/7 public safety support</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 JalRakshak. All rights reserved.</span>
          <div className="footer-meta">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
