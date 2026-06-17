import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import styles from "../static.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | PC Wala Online",
  description:
    "How PC Wala Online handles your data — spoiler: we collect very little.",
};

export default function PrivacyPage() {
  const breadcrumbs = [{ label: "Privacy Policy" }];

  return (
    <div className={styles.pageWrapper}>
      <Breadcrumb items={breadcrumbs} />

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          PRIVACY<br />
          <span className={styles.pageTitleAccent}>POLICY</span>
        </h1>
        <span className={styles.headerBracket} />
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.contentBox}>
          <p className={styles.metaLabel}>LAST UPDATED: FEBRUARY 2026</p>

          <div className={styles.prose}>
            <p className={styles.introText}>
              At <strong>PC Wala Online</strong>, your privacy matters. But
              here&apos;s the good news — because of how we operate, we handle{" "}
              <em>way less</em> of your data than a typical e-commerce store. No
              account creation, no saved payment methods, no tracking cookies
              following you around the internet.
            </p>

            <h2 className={styles.sectionTitle}>// 1. What We Collect</h2>
            <p>
              <strong>On the Website:</strong> Basic, non-personal stuff that
              every website collects — your IP address, browser type, pages you
              visit. This helps us keep the site running smoothly and understand
              general traffic patterns. We don&apos;t tie this to your identity.
            </p>
            <p>
              <strong>On WhatsApp:</strong> When you message us to place an
              order, you voluntarily share your name, phone number, and shipping
              address. We use this <em>only</em> to fulfill your order and
              manage future warranty claims. That&apos;s it.
            </p>

            <h2 className={styles.sectionTitle}>// 2. Payment Data</h2>
            <p>
              <strong>We never touch your payment details online.</strong> No
              credit cards, no bank passwords, no payment gateway. All
              transactions happen off-site — via direct bank transfer or Cash on
              Delivery (COD) — as agreed on WhatsApp. Your financial data stays
              between you and your bank.
            </p>

            <h2 className={styles.sectionTitle}>// 3. How We Use Your Info</h2>
            <p>
              The limited info we get through WhatsApp is used strictly to:
            </p>
            <ul>
              <li>Confirm pricing and availability for your order.</li>
              <li>Coordinate delivery or in-store pickup.</li>
              <li>Provide after-sales support and warranty assistance.</li>
              <li>Answer your hardware questions (the fun part).</li>
            </ul>

            <h2 className={styles.sectionTitle}>// 4. Data Sharing</h2>
            <p>
              We don&apos;t sell, trade, or rent your information. Period. The only
              time we share your details (name, address, phone) is with trusted
              courier partners — strictly to get your order delivered.
            </p>

            <h2 className={styles.sectionTitle}>// 5. Third-Party Links</h2>
            <p>
              Our site links to manufacturer pages for specs and product info.
              We&apos;re not responsible for their privacy practices. Once you leave
              our site, their rules apply.
            </p>

            <h2 className={styles.sectionTitle}>// 6. Questions?</h2>
            <p>
              If anything about this policy is unclear, just message us on
              WhatsApp at{" "}
              <strong>
                +92 342 3355119
              </strong>
              . We keep things simple because we believe privacy policies
              shouldn&apos;t require a law degree to understand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
