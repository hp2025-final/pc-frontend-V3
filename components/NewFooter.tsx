"use client";

import Link from "next/link";
import { siWhatsapp } from "simple-icons";
import styles from "./NewFooter.module.css";

export default function NewFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    categories: [
      { name: "Laptops", slug: "laptops" },
      { name: "Graphics Cards", slug: "graphic-cards" },
      { name: "PC Cases", slug: "pc-cases" },
      { name: "Motherboards", slug: "motherboards" },
      { name: "Storage", slug: "storage" },
    ],
    company: [
      { name: "About Us", slug: "/about" },
      { name: "Contact", slug: "/contact" },
      { name: "Terms of Service", slug: "/terms" },
      { name: "Privacy Policy", slug: "/privacy" },
      { name: "Warranty Policy", slug: "/warranty" },
    ],
    tracker: [
      { name: "Price Drops", slug: "/collection/price-drops" },
      { name: "Price Increases", slug: "/collection/price-increases" },
      { name: "On Sale", slug: "/collection/on-sale" },
      { name: "Market Fluctuation", slug: "/collection/high-fluctuation" },
      { name: "Market Price", slug: "/collection/market-price" },
    ],
  };

  return (
    <footer className={styles.footer}>
      {/* Top Banner Module - Full Width Grid Element */}
      <div className={styles.topBanner}>
        <div className={styles.bannerLeft}>
          <div className={styles.brandWrapper}>
            <span className={styles.brandTitle}>PC WALA</span>
            <span className={`${styles.brandSub} label-mono`}>ONLINE</span>
          </div>
          <span className={`${styles.systemStatus} label-mono`}>
            <span className={styles.statusDot} />
            NODE_ACTIVE // SADDAR_KARACHI
          </span>
        </div>
        <div className={`${styles.bannerRight} label-mono`}>
          [ SYSTEM TYPE // MODULAR_GRID_V3 ]
        </div>
      </div>

      {/* Main Grid Content - Asymmetric Grid Cells */}
      <div className={styles.grid}>
        {/* Brand Module */}
        <div className={`${styles.col} ${styles.brandCol}`}>
          <span className={styles.moduleNumber}>01 // PROFILE</span>
          <p className={styles.brandDesc}>
            Trusted since 2010 — 16+ years serving Karachi's tech community and Pakistan's leading corporations. Started as Saddar Market's first retail-to-wholesale operation, now delivering authentic hardware with transparent pricing. Engineered for gamers, creators, and enterprises.
          </p>
          <div className={styles.cornerBracket} />
        </div>

        {/* Categories Module */}
        <div className={styles.col}>
          <span className={styles.moduleNumber}>02 // NAV_CATEGORIES</span>
          <h3 className={`${styles.colTitle} label-mono`}>CATEGORIES</h3>
          <ul className={styles.linkList}>
            {footerLinks.categories.map((link) => (
              <li key={link.slug}>
                <Link href={`/category/${link.slug}`} className={styles.link}>
                  <span className={styles.linkDot}>■</span> {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.cornerBracket} />
        </div>

        {/* Company Module */}
        <div className={styles.col}>
          <span className={styles.moduleNumber}>03 // NAV_COMPANY</span>
          <h3 className={`${styles.colTitle} label-mono`}>COMPANY</h3>
          <ul className={styles.linkList}>
            {footerLinks.company.map((link) => (
              <li key={link.slug}>
                <Link href={link.slug} className={styles.link}>
                  <span className={styles.linkDot}>■</span> {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.cornerBracket} />
        </div>

        {/* Market Tracker Module */}
        <div className={styles.col}>
          <span className={styles.moduleNumber}>04 // NAV_TRACKER</span>
          <h3 className={`${styles.colTitle} label-mono`}>MARKET TRACKER</h3>
          <ul className={styles.linkList}>
            {footerLinks.tracker.map((link) => (
              <li key={link.slug}>
                <Link href={link.slug} className={styles.link}>
                  <span className={styles.linkDot}>■</span> {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.cornerBracket} />
        </div>

        {/* Contact Module */}
        <div className={`${styles.col} ${styles.contactCol}`}>
          <span className={styles.moduleNumber}>05 // NODE_DETAILS</span>
          <h3 className={`${styles.colTitle} label-mono`}>CONTACT</h3>
          
          <div className={styles.contactSection}>
            <div className={`${styles.contactLabel} label-mono`}>LOCATION</div>
            <p className={styles.contactText}>
              Store G41, Regal Trade Square, Regal Chowk, Saddar, Karachi, Pakistan.
            </p>
          </div>

          <div className={styles.whatsappCTA}>
            <div className={`${styles.contactLabel} label-mono`}>RETAIL // WA</div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "+923423355119"}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.phoneLink}
            >
              <svg className={styles.waIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" role="img">
                <path d={siWhatsapp.path} />
              </svg>
              {process.env.NEXT_PUBLIC_WA_NUMBER || "+923423355119"}
            </a>
          </div>

          <div className={styles.wholesaleCTA}>
            <div className={`${styles.contactLabel} label-mono`}>WHOLESALE // BULK</div>
            <a
              href="https://wa.me/923022189972"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.phoneLink}
            >
              <svg className={styles.waIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" role="img">
                <path d={siWhatsapp.path} />
              </svg>
              +92 302 2189972
            </a>
          </div>

          <div className={styles.ntnSection}>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "923423355119"}?text=${encodeURIComponent("Hello PC Wala, I'd like to request your NTN number.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ntnLink}
            >
              REGISTRATION // NTN →
            </a>
          </div>
          <div className={styles.cornerBracket} />
        </div>
      </div>

      {/* Interactive horizontal divider accent strip - Lime green */}
      <div className={styles.accentStrip} />

      {/* Footer Bottom Row */}
      <div className={styles.bottomRow}>
        <div className={`${styles.copyright} label-mono`}>
          © {currentYear} PC WALA ONLINE. ALL RIGHTS RESERVED.
        </div>
        <div className={`${styles.systemLabel} label-mono`}>
          SYSTEM // V3.0.0_FUTURISM // DEVELOPED BY <a href="https://www.mainweb.store" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "inherit" }}>MAIN WEB</a> // WA: <a href="https://wa.me/923162694747?text=Hello%20Main%20Web" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "inherit" }}>+92 316 2694747</a>
        </div>
      </div>
    </footer>
  );
}
