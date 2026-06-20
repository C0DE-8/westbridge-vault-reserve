import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiBriefcase,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiGlobe,
  FiHelpCircle,
  FiHome,
  FiLock,
  FiMenu,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiSend,
  FiShield,
  FiSmartphone,
  FiTrendingUp,
  FiUsers,
  FiX,
} from "react-icons/fi";
import LanguageSwitcher from "../../components/ui/LanguageSwitcher";
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

const bankingHighlights = [
  {
    icon: FiLock,
    title: "Protected digital banking",
    text: "Sign in securely, review balances, manage transfers, and keep account activity visible from one private dashboard.",
  },
  {
    icon: FiRefreshCw,
    title: "Local and wire transfers",
    text: "Move money with controlled verification steps, transfer history, beneficiary details, and account-level confirmation.",
  },
  {
    icon: FiCreditCard,
    title: "Card and ATM support",
    text: "Request ATM cards, track card status, and manage everyday access to funds with clear service updates.",
  },
  {
    icon: FiDollarSign,
    title: "Loans and funding",
    text: "Explore personal, business, education, agriculture, mortgage, and operational funding support in one place.",
  },
];

const bankingSteps = [
  "Open an account with guided onboarding and document review.",
  "Receive account details after administrative approval.",
  "Fund your account and manage activity from the customer dashboard.",
  "Use transfers, deposits, loans, cards, tickets, and secure alerts as needed.",
];

const productPillars = [
  {
    icon: FiSmartphone,
    title: "Personal online banking",
    text: "View balances, manage deposits, review account activity, and keep your profile information organized from a secure dashboard.",
  },
  {
    icon: FiBriefcase,
    title: "Business account services",
    text: "Support for operating accounts, working capital needs, treasury activity, and financial movement across business priorities.",
  },
  {
    icon: FiHome,
    title: "Mortgage and property funding",
    text: "Structured lending guidance for home purchase, investment property, and long-term property financing decisions.",
  },
  {
    icon: FiSend,
    title: "Domestic and wire payments",
    text: "Local transfer and wire transfer workflows with verification, fee visibility, status tracking, and customer history.",
  },
  {
    icon: FiFileText,
    title: "Deposits and loan requests",
    text: "Submit deposit records, request loans, upload supporting details, and follow the review process from your account.",
  },
  {
    icon: FiHelpCircle,
    title: "Customer support center",
    text: "Open support tickets, receive replies, and keep important conversations connected to your banking profile.",
  },
];

const assuranceItems = [
  "Encrypted access with account-level verification",
  "Administrative review for new account onboarding",
  "Login alert emails with device and location details",
  "Transfer requirements for COT, IMF, TAX, and related codes when enabled",
  "Clear records for deposits, loans, transfers, cards, and support tickets",
  "Multi-language access powered by Google Translate",
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
            <LanguageSwitcher compact />
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
            <LanguageSwitcher />
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
            <Link to="/lock/admin/auth">Admin Login</Link>
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
              <span className={styles.kicker}>Digital banking</span>
              <h2>Everything customers need to manage money with confidence</h2>
            </div>
            <p>
              West Bridge Vault Reserve brings core banking tools into one secure
              online experience for everyday users, business owners, and customers
              managing larger financial plans.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {bankingHighlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <article className={styles.featureCard} style={{ "--delay": `${index * 90}ms` }} key={item.title}>
                  <span className={styles.featureIcon}><Icon /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.motionBand}>
        <div className={`${styles.container} ${styles.motionGrid}`}>
          <div className={styles.motionCopy}>
            <span className={styles.kicker}>Account journey</span>
            <h2>From application to active banking, every step is clear</h2>
            <p>
              Customers can apply online, wait for review, receive account details,
              and continue into secure banking tools without unnecessary confusion.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryLink} to="/auth?mode=register">Start Application</Link>
              <Link className={styles.secondaryHeroLink} to="/services">View Services</Link>
            </div>
          </div>
          <div className={styles.processStack}>
            {bankingSteps.map((step, index) => (
              <article className={styles.processItem} style={{ "--delay": `${index * 120}ms` }} key={step}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <p>{step}</p>
                <FiCheckCircle />
              </article>
            ))}
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

      <section className={styles.darkHomeSection}>
        <div className={styles.container}>
          <div className={styles.darkSectionHead}>
            <span className={styles.kicker}>Banking solutions</span>
            <h2>More than an account: a full digital banking relationship</h2>
            <p>
              Our public banking experience is designed to explain the services customers
              can use after onboarding, from everyday account access to business support,
              cards, deposits, loans, and secure transfers.
            </p>
          </div>
          <div className={styles.productGrid}>
            {productPillars.map((item, index) => {
              const Icon = item.icon;
              return (
                <article className={styles.productCard} style={{ "--delay": `${index * 70}ms` }} key={item.title}>
                  <Icon />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.container} ${styles.assuranceGrid}`}>
          <div className={styles.assuranceCopy}>
            <span className={styles.kicker}>Bank with clarity</span>
            <h2>Designed around visibility, approval control, and customer confidence</h2>
            <p>
              Customers should understand what their bank can do before they sign in.
              West Bridge Vault Reserve presents clear account services, secure login,
              transfer controls, and support access so users know how to move forward.
            </p>
            <div className={styles.assuranceActions}>
              <Link className={styles.primaryLink} to="/auth?mode=register">Open Account</Link>
              <Link className={styles.secondaryLink} to="/contact">Talk to Support</Link>
            </div>
          </div>
          <div className={styles.assuranceList}>
            {assuranceItems.map((item) => (
              <span key={item}><FiCheckCircle /> {item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={`${styles.container} ${styles.securitySplit}`}>
          <div className={styles.securityPanel}>
            <span className={styles.kicker}>Security and visibility</span>
            <h2>Built for customers who want control over every account action</h2>
            <p>
              Secure login alerts, transaction verification, transfer requirements,
              support tickets, and activity history help customers understand what
              is happening across their account.
            </p>
            <div className={styles.securityList}>
              <span><FiShield /> Login alerts and OTP protection</span>
              <span><FiGlobe /> Multi-language site support</span>
              <span><FiClock /> Transfer and deposit history</span>
              <span><FiUsers /> Human support through tickets</span>
            </div>
          </div>
          <div className={styles.dashboardPreview}>
            <div className={styles.previewTop}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className={styles.previewBalance}>
              <small>Available balance</small>
              <strong>$48,920.00</strong>
            </div>
            <div className={styles.previewRows}>
              <span><b></b><em></em></span>
              <span><b></b><em></em></span>
              <span><b></b><em></em></span>
            </div>
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
