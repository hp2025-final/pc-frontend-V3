import Link from "next/link";
import styles from "./TrustCards.module.css";

export default function TrustCards() {
  const cards = [
    {
      id: 1,
      headline: "16+ Years Powering Pakistan's Tech Scene",
      description: "Started in Saddar 2010. Expanded to wholesale 2012. Now serving everyone from national media houses to first-time builders.",
      badge: "SINCE 2010",
    },
    {
      id: 2,
      headline: "Trusted by Corporations & Creators Alike",
      description: "Same authentic hardware we supply to national news channels, software companies, and 3D production studios — now available to you.",
      badge: "VERIFIED",
    },
    {
      id: 3,
      headline: "5 Clear Warranty Tiers. Zero Confusion.",
      description: "International, Brand, Local, Limited, or No Warranty — we tell you exactly what's covered before you buy.",
      link: "/warranty",
      linkText: "SEE WARRANTY TIERS",
      badge: "TRANSPARENT",
    },
    {
      id: 4,
      headline: "WhatsApp = Your Direct Line to Experts",
      description: "Real humans who build PCs. Real-time pricing. Compatibility checks. No checkout drama — just message us.",
      link: `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "923423355119"}`,
      linkText: "START CHAT",
      badge: "24/7 SUPPORT",
      external: true,
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {cards.map((card) => (
          <div key={card.id} className={styles.card}>
            {/* Badge */}
            <div className={styles.badge}>
              <span className={styles.badgeText}>{card.badge}</span>
            </div>

            {/* Content */}
            <div className={styles.content}>
              <h3 className={styles.headline}>{card.headline}</h3>
              <p className={styles.description}>{card.description}</p>

              {/* Link if provided */}
              {card.link && (
                card.external ? (
                  <a
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span className={styles.linkText}>{card.linkText}</span>
                    <svg className={styles.linkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                ) : (
                  <Link href={card.link} className={styles.link}>
                    <span className={styles.linkText}>{card.linkText}</span>
                    <svg className={styles.linkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                )
              )}
            </div>

            {/* Corner Bracket */}
            <span className={styles.cornerBracket} />
          </div>
        ))}
      </div>
    </section>
  );
}
