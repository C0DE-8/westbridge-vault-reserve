import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiArrowRight,
  FiClock,
  FiMenu,
  FiMapPin,
  FiPhone,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiX,
} from "react-icons/fi";
import styles from "./WestBridgeSite.module.css";

const asset = (path) => `/westbridge-assets/images/${path}`;

const navItems = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "Services", path: "/services" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const projectItems = [
  { title: "Fund Management", tag: "Funding", image: asset("projects/01.jpg") },
  { title: "Business Loan", tag: "Funding", image: asset("projects/02.jpg") },
  { title: "Housing Loan", tag: "Funding", image: asset("projects/03.jpg") },
  { title: "Educational Loans", tag: "Funding", image: asset("projects/04.jpg") },
  { title: "Agricultural Loans", tag: "Funding", image: asset("projects/05.jpg") },
  { title: "Treasury Support", tag: "Funding", image: asset("projects/03.jpg") },
];

const serviceItems = [
  {
    title: "Auto Loan",
    text: "Flexible repayment options for new and used vehicle financing.",
    image: asset("service/01.jpg"),
  },
  {
    title: "Mortgage Solutions",
    text: "Personalized financing support for primary homes and investment property.",
    image: asset("service/02.jpg"),
  },
  {
    title: "Business Banking",
    text: "Working capital, treasury support, and account services for growth.",
    image: asset("service/service-details.jpg"),
  },
];

function MarketingLayout({ children, activePath }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [activePath]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} to="/">
            <img src={asset("westbridge.png")} alt="West Bridge Vault Reserve" />
            <div>
              <strong>West Bridge Vault Reserve</strong>
              <span>Secure online banking</span>
            </div>
          </Link>

          <nav className={styles.nav}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={activePath === item.path ? styles.navActive : ""}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.headerActions}>
            <Link className={styles.secondaryLink} to="/auth?mode=login">Login</Link>
            <Link className={styles.primaryLink} to="/auth?mode=register">Open Account</Link>
          </div>

          <button
            className={styles.mobileMenuButton}
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
          <nav className={styles.mobileNav}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={activePath === item.path ? styles.mobileNavActive : ""}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className={styles.mobileMenuActions}>
            <Link className={styles.secondaryLink} to="/auth?mode=login">Login</Link>
            <Link className={styles.primaryLink} to="/auth?mode=register">Open Account</Link>
          </div>
        </div>
      </header>

      {children}

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerCol}>
            <img src={asset("westbridge-wg.png")} alt="West Bridge Vault Reserve" className={styles.footerLogo} />
            <p>
              West Bridge Vault Reserve delivers secure personal and business banking
              with dependable digital access, funding options, and treasury support.
            </p>
          </div>
          <div className={styles.footerCol}>
            <h4>Solutions</h4>
            <Link to="/services">Loans</Link>
            <Link to="/projects">Funding</Link>
            <Link to="/about">About</Link>
          </div>
          <div className={styles.footerCol}>
            <h4>Company</h4>
            <Link to="/contact">Contact</Link>
            <Link to="/auth?mode=login">Account Login</Link>
            <Link to="/admin/auth">Admin Login</Link>
            <Link to="/auth?mode=register">Open Account</Link>
          </div>
          <div className={styles.footerCol}>
            <h4>Contact</h4>
            <p>250 Hartford Avenue, Bellingham MA 02019, USA</p>
            <p>www.westbridgevaultreserve.online</p>
            <p>support@westbridgevaultreserve.online</p>
            <p>Mon - Sat: 09:00 AM - 06:00 PM</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Banner({ title, pathLabel }) {
  return (
    <section className={styles.banner}>
      <div className={styles.bannerOverlay}>
        <div className={styles.container}>
          <h1>{title}</h1>
          <div className={styles.breadcrumbs}>
            <Link to="/">Home</Link>
            <span>/</span>
            <b>{pathLabel}</b>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WestBridgeHomePage() {
  return (
    <MarketingLayout activePath="/">
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <h1>
                West Bridge Vault Reserve
                <span>Simple. Transparent. Secure.</span>
              </h1>
              <p>
                Secure personal and business banking with dependable online access,
                funding support, transfers, payments, and account services.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryLink} to="/auth?mode=login">
                  Account Login <FiArrowRight />
                </Link>
                <Link className={styles.secondaryHeroLink} to="/auth?mode=register">
                  Open Account <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.container} ${styles.twoCol}`}>
          <div className={styles.mediaCard}>
            <img src={asset("about/about.png")} alt="About West Bridge Vault Reserve" />
            <div className={styles.experienceBadge}>
              <strong>25+</strong>
              <span>Years of Experience</span>
            </div>
          </div>
          <div className={styles.copyCard}>
            <span className={styles.kicker}>About West Bridge Vault Reserve</span>
            <h2>Small business loans for daily expenses and long-term growth</h2>
            <p>
              We believe your bank should support your plans. West Bridge Vault Reserve
              provides secure online banking, treasury guidance, mortgage options, and
              account services built around practical financial needs.
            </p>
            <p>
              Whether you are opening your first account, funding a property purchase,
              or managing business cash flow, we provide structured banking support.
            </p>
            <div className={styles.trustStrip}>
              <FiUsers />
              <strong>Trusted by more than 25,800 clients</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.metricsSection}>
        <div className={styles.container}>
          <div className={styles.metricsGrid}>
            <article className={styles.metricCard}>
              <FiShield />
              <strong>100%</strong>
              <span>Security-first workflow</span>
            </article>
            <article className={styles.metricCard}>
              <FiUsers />
              <strong>785</strong>
              <span>Active relationship teams</span>
            </article>
            <article className={styles.metricCard}>
              <FiTrendingUp />
              <strong>10,524M</strong>
              <span>Managed funding volume</span>
            </article>
            <article className={styles.metricCard}>
              <FiClock />
              <strong>199</strong>
              <span>Service markets connected</span>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.kicker}>Projects</span>
              <h2>Over 1000 projects completed</h2>
            </div>
            <p>
              Funding programs and financial initiatives that support operations,
              investment, housing, and long-term planning.
            </p>
          </div>
          <div className={styles.cardGrid}>
            {projectItems.slice(0, 3).map((item) => (
              <article className={styles.projectCard} key={item.title}>
                <img src={item.image} alt={item.title} />
                <div className={styles.projectBody}>
                  <span>{item.tag}</span>
                  <h3>{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={`${styles.container} ${styles.ctaBand}`}>
          <div>
            <span className={styles.kicker}>Get started</span>
            <h2>We have a simple online application</h2>
          </div>
          <div className={styles.heroActions}>
            <Link className={styles.primaryLink} to="/auth?mode=register">Open Account</Link>
            <Link className={styles.secondaryLink} to="/contact">Contact Us</Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

export function WestBridgeAboutPage() {
  return (
    <MarketingLayout activePath="/about">
      <Banner title="About Us" pathLabel="About Us" />
      <section className={styles.section}>
        <div className={`${styles.container} ${styles.twoCol}`}>
          <div className={styles.mediaCard}>
            <img src={asset("about/about.png")} alt="About West Bridge Vault Reserve" />
          </div>
          <div className={styles.copyCard}>
            <span className={styles.kicker}>About Company</span>
            <h2>Trusted financial partner for modern account holders</h2>
            <p>
              West Bridge Vault Reserve combines secure digital banking access with
              personal support for lending, transfers, account management, and funding.
            </p>
            <p>
              Our operating model is built around compliance, transparent account servicing,
              and practical solutions for both personal and business customers.
            </p>
          </div>
        </div>
      </section>
      <section className={styles.metricsSection}>
        <div className={styles.container}>
          <div className={styles.metricsGrid}>
            <article className={styles.metricCard}><FiShield /><strong>100%</strong><span>Success rate</span></article>
            <article className={styles.metricCard}><FiUsers /><strong>785</strong><span>Happy clients</span></article>
            <article className={styles.metricCard}><FiTrendingUp /><strong>10,524M</strong><span>Portfolio scale</span></article>
            <article className={styles.metricCard}><FiClock /><strong>199</strong><span>Completed cycles</span></article>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

export function WestBridgeProjectsPage() {
  return (
    <MarketingLayout activePath="/projects">
      <Banner title="Projects" pathLabel="Projects" />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.kicker}>Projects</span>
              <h2>1000+ projects completed with absolute quality</h2>
            </div>
            <p>
              Banking-backed funding initiatives that support fund management, housing,
              education, business, and agriculture.
            </p>
          </div>
          <div className={styles.cardGrid}>
            {projectItems.map((item) => (
              <article className={styles.projectCard} key={item.title}>
                <img src={item.image} alt={item.title} />
                <div className={styles.projectBody}>
                  <span>{item.tag}</span>
                  <h3>{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

export function WestBridgeServicesPage() {
  return (
    <MarketingLayout activePath="/services">
      <Banner title="Service Details" pathLabel="Services" />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.kicker}>Services</span>
              <h2>Structured banking support across lending and account management</h2>
            </div>
            <p>
              Explore West Bridge banking services built for lending, account management,
              payments, financial planning, and secure digital banking access.
            </p>
          </div>
          <div className={styles.serviceStack}>
            {serviceItems.map((item) => (
              <article className={styles.serviceCard} key={item.title}>
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link to="/auth?mode=register">Apply now</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

export function WestBridgeContactPage() {
  return (
    <MarketingLayout activePath="/contact">
      <Banner title="Contact" pathLabel="Contact" />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            <article className={styles.infoCard}>
              <FiMapPin />
              <h3>Contact Address</h3>
              <p>250 Hartford Avenue, Bellingham MA 02019, USA</p>
            </article>
            <article className={styles.infoCard}>
              <FiClock />
              <h3>Timing</h3>
              <p>Mon - Sat: 09:00 AM - 06:00 PM</p>
              <p>Sunday: 12:00 PM - 06:00 PM</p>
            </article>
            <article className={styles.infoCard}>
              <FiPhone />
              <h3>Let's Talk</h3>
              <p>www.westbridgevaultreserve.online</p>
              <p>support@westbridgevaultreserve.online</p>
            </article>
          </div>
          <div className={styles.contactSplit}>
            <div className={styles.copyCard}>
              <span className={styles.kicker}>Book appointment now</span>
              <h2>Have queries before the appointment?</h2>
              <p>
                Send a message to `support@westbridgevaultreserve.online` and our team
                will reply within 24 hours.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryLink} to="/auth?mode=register">Open Account</Link>
                <Link className={styles.secondaryLink} to="/auth?mode=login">Account Login</Link>
              </div>
            </div>
            <div className={styles.mapCard}>
              <img src={asset("map.png")} alt="West Bridge Vault Reserve map" />
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
