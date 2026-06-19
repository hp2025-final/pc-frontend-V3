import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import styles from "../static.module.css";

export const metadata: Metadata = {
  title: "Contact Us | PC Wala Online",
  description:
    "Reach PC Wala Online via WhatsApp or visit our Karachi store. Fast replies, real hardware advice.",
};

export default function ContactPage() {
  const breadcrumbs = [{ label: "Contact" }];

  const retailNumber = process.env.NEXT_PUBLIC_WA_NUMBER || "923423355119";
  const wholesaleNumber = "923022189972";

  return (
    <div className={styles.pageWrapper}>
      <Breadcrumb items={breadcrumbs} />

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          CONTACT<br />
          <span className={styles.pageTitleAccent}>US</span>
        </h1>
        <span className={styles.headerBracket} />
      </div>

      <div className={styles.contentContainer}>
        {/* Contact Grid */}
        <div className={styles.contactGrid}>
          {/* Retail Orders */}
          <div className={styles.contactCard}>
            <div className={styles.contactLabel}>// RETAIL ORDERS</div>
            <p className={styles.contactValue}>
              Browse our catalog, find the part you need, and hit the WhatsApp
              button on the product page. From there, we handle everything —
              confirm stock, lock in the best current price, and arrange delivery
              or pickup.
            </p>
            <a
              href={`https://wa.me/${retailNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waButton}
            >
              <svg className={styles.waIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              RETAIL WHATSAPP
            </a>
          </div>

          {/* Wholesale Queries */}
          <div className={styles.contactCard}>
            <div className={styles.contactLabel}>// WHOLESALE QUERIES</div>
            <p className={styles.contactValue}>
              Dedicated line for bulk orders, resellers, and B2B queries. Get
              volume pricing and priority stock allocation.
            </p>
            <a
              href={`https://wa.me/${wholesaleNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waButtonOutline}
            >
              <svg className={styles.waIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              WHOLESALE WHATSAPP
            </a>
            <p className={styles.contactNote}>
              +92 302 2189972 — Dedicated wholesale line
            </p>
          </div>

          {/* Store Location */}
          <div className={styles.contactCard}>
            <div className={styles.contactLabel}>// STORE LOCATION</div>
            <p className={styles.contactValue}>
              <strong>Store G41, Ground Floor,</strong>
              <br />
              Regal Trade Square, Regal Chowk,
              <br />
              Saddar, Karachi, Pakistan, 74400.
            </p>
            <a
              href="https://www.google.com/maps/place/PC+Wala+Online/@24.8608156,67.0254546,17z/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapButton}
            >
              ▶ OPEN IN GOOGLE MAPS
            </a>
          </div>

          {/* Visit HQ */}
          <div className={styles.contactCard}>
            <div className={styles.contactLabel}>// VISIT THE HQ</div>
            <p className={styles.contactValue}>
              Saddar is the hardware hub of Karachi, and we&apos;ve been right in
              the middle of it <strong>since 2010</strong> — over 16 years of serving the tech community. 
              What began as a wholesale operation has grown into Karachi&apos;s trusted destination for 
              genuine computer hardware. Walk in, check out our inventory, poke at the latest GPUs, and talk shop with the
              team. No appointment needed — just show up.
            </p>
            <p className={styles.contactNote}>
              Pro tip: Message us on WhatsApp before visiting so we can keep your
              items ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
