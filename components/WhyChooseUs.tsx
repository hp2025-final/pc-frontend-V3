"use client";

import { ShieldCheck, DollarSign, Headphones } from "lucide-react";
import { siWhatsapp } from "simple-icons";
import styles from "./WhyChooseUs.module.css";

export default function WhyChooseUs() {
  const features = [
    {
      title: "ZERO FAKE RISK",
      description: "You receive only authenticated, verified hardware. Every order, every time — no exceptions.",
      icon: <ShieldCheck size={24} />,
    },
    {
      title: "INSTANT HUMAN RESPONSE",
      description: "You message on WhatsApp, a real person picks up. Your order moves the moment you do.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" role="img">
          <path d={siWhatsapp.path} />
        </svg>
      ),
    },
    {
      title: "TRANSPARENT PRICING",
      description: "You see the full price before you pay. Best market rate — no bait, no switch, no hidden fees.",
      icon: <DollarSign size={24} />,
    },
    {
      title: "EXPERTISE ON DEMAND",
      description: "You get hardware specialists in your corner. Custom build advice, part selection, compatibility — all covered.",
      icon: <Headphones size={24} />,
    },
  ];

  return (
    <section className={styles.section}>
      <span className={styles.cornerBracket} />

      <div className={styles.container}>
        {/* Asymmetric Left Block: Giant Header and Subtext */}
        <div className={styles.headerBlock}>
          <div className={styles.titleWrapper}>
            <span className={`${styles.systemTag} label-mono`}>[ AREA // YOUR_RETURN ]</span>
            <h2 className={`${styles.sectionTitle} brutalist-section-title`}>
              <span style={{ display: "block", color: "var(--color-dark)" }}>WHAT YOU</span>
              <span style={{ display: "block", color: "var(--color-orange)" }}>UNLOCK</span>
            </h2>
          </div>
          <p className={styles.subtext}>
            // ONE ORDER. GENUINE PARTS. FAST RESPONSE. FAIR PRICE. EXPERT BACKUP. NATIONWIDE.
          </p>
          <div className={styles.miniBracket} />
        </div>

        {/* Asymmetric Right Block: Modular 2x2 Feature Cells */}
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              {/* Index Number */}
              <span className={`${styles.featureIndex} label-mono`}>
                0{index + 1}
              </span>

              {/* Icon Container */}
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>

              {/* Text Data */}
              <h3 className={`${styles.featureTitle} label-mono`}>
                {feature.title}
              </h3>
              <p className={styles.featureDesc}>
                {feature.description}
              </p>

              {/* Sub-card corner accent */}
              <span className={styles.cardBracket} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
