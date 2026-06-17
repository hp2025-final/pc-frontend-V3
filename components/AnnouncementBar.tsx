"use client";

import styles from "./AnnouncementBar.module.css";

export default function AnnouncementBar() {
  const announcements = [
    "GENUINE PARTS - Only authentic, verified components. No counterfeits.",
    "WHATSAPP ORDER - Fast ordering via WhatsApp. Real humans reply fast.",
    "COMPETITIVE PRICE - Best market rates. Price shown upfront.",
    "FREE DELIVERY - On orders above PKR 10,000 in major cities.",
    "WARRANTY SUPPORT - Full manufacturer warranty on all products.",
  ];

  return (
    <div className={styles.announcementBar}>
      {/* Marquee Container */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeContent}>
          {/* Duplicate announcements for seamless loop */}
          {[...announcements, ...announcements].map((text, index) => (
            <span key={index} className={styles.announcementItem}>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
