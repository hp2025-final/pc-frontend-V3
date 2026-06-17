import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import styles from "../static.module.css";

export const metadata: Metadata = {
  title: "About Us | PC Wala Online",
  description:
    "Pakistan's retro-cool PC parts store. Genuine hardware, WhatsApp ordering, real humans. Based in Saddar, Karachi.",
};

export default function AboutPage() {
  const breadcrumbs = [{ label: "About Us" }];

  return (
    <div className={styles.pageWrapper}>
      <Breadcrumb items={breadcrumbs} />

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          ABOUT<br />
          <span className={styles.pageTitleAccent}>PC WALA</span>
        </h1>
        <span className={styles.headerBracket} />
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.contentBox}>
          <div className={styles.prose}>
            <p className={styles.introText}>
              <strong>PC Wala Online</strong> isn&apos;t your average parts store.
              We&apos;re the spot where hardware nerds, competitive gamers, and
              first-time builders come to gear up — without the usual headaches.
            </p>

            <p>
              Based out of Saddar, Karachi, we&apos;ve been helping people build
              everything from budget sleeper rigs to insane RGB battlestations.
              Whether you know exactly what chipset you need or you&apos;re still
              figuring out what a motherboard does — we&apos;ve got you.
            </p>

            <h2 className={styles.sectionTitle}>// WhatsApp = Our Checkout</h2>
            <p>
              No cart. No checkout page. No payment gateway drama. Here&apos;s how
              we roll:
            </p>
            <ul>
              <li>
                <strong>Dynamic Pricing:</strong> PC parts prices change daily.
                Instead of showing you a stale number, we show a range and lock
                in the real price when you message us. You always get the current
                market rate — not last week&apos;s.
              </li>
              <li>
                <strong>Real Humans, Real Advice:</strong> Click &quot;Order on
                WhatsApp&quot; and you&apos;re talking to someone who actually builds
                PCs. We&apos;ll check compatibility, suggest better options if they
                exist, and finalize everything in chat.
              </li>
              <li>
                <strong>No Surprises:</strong> Price, delivery, payment method —
                everything is agreed before you pay a single rupee. Bank transfer
                or COD, your call.
              </li>
            </ul>

            <h2 className={styles.sectionTitle}>
              // 100% Genuine. Zero Fakes.
            </h2>
            <p>
              Every component we sell is authentic and verified. We don&apos;t do
              knockoffs, counterfeits, or &quot;compatible alternatives&quot; that die in
              two weeks. We source from international and local distributors, and
              every product comes with clearly defined warranty coverage — from
              full international warranty down to as-is items. No guessing games.
            </p>

            <h2 className={styles.sectionTitle}>// Built for Builders</h2>
            <p>
              Whether you&apos;re hunting for a specific RTX card, comparing B650
              motherboards, or just need someone to tell you which RAM actually
              works with your CPU — we&apos;re here. PC Wala isn&apos;t a marketplace.
              It&apos;s a crew.
            </p>
          </div>
        </div>

        {/* CTA Box */}
        <div className={styles.ctaBox}>
          <h3 className={styles.ctaTitle}>// Start a Conversation</h3>
          <p className={styles.ctaText}>
            Got a build in mind? Need advice on a specific part? Just message us.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || "923423355119"}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waButton}
          >
            <svg className={styles.waIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            MESSAGE ON WHATSAPP
          </a>
        </div>
      </div>
    </div>
  );
}
