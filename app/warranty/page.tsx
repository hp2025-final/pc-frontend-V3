import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import styles from "../static.module.css";

export const metadata: Metadata = {
  title: "Warranty Policy | PC Wala Online",
  description:
    "Understand the 5 types of warranties at PC Wala Online — International, Brand, Local, Limited, and No Warranty.",
};

export default function WarrantyPage() {
  const breadcrumbs = [{ label: "Warranty Policy" }];

  return (
    <div className={styles.pageWrapper}>
      <Breadcrumb items={breadcrumbs} />

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          WARRANTY<br />
          <span className={styles.pageTitleAccent}>COVERAGE</span>
        </h1>
        <span className={styles.headerBracket} />
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.contentBox}>
          <div className={styles.prose}>
            <p className={styles.introText}>
              We source hardware from all over — international markets, local
              distributors, brand-authorized channels. That means warranty
              coverage varies product to product. No hidden fine print here.
              We&apos;ll always tell you exactly what kind of coverage you&apos;re
              getting <strong>before</strong> you buy.
            </p>
            <p>Here are the 5 warranty tiers you&apos;ll see on our store:</p>
          </div>

          {/* Warranty Tiers Table */}
          <table className={styles.specTable}>
            <tbody>
              <tr>
                <th>International Warranty</th>
                <td>
                  <strong>The gold standard.</strong> The manufacturer covers
                  the product globally. If something goes wrong, you claim
                  directly with the brand&apos;s authorized service center — which
                  may be outside Pakistan. We&apos;ll guide you through the process
                  if needed.
                </td>
              </tr>
              <tr>
                <th>Brand / Vendor Warranty</th>
                <td>
                  <strong>Local brand-backed coverage.</strong> An authorized
                  distributor or vendor in Pakistan handles the warranty. If
                  your hardware develops a fault, you take it to the brand&apos;s
                  local warranty center — no international shipping required.
                </td>
              </tr>
              <tr>
                <th>Local Warranty</th>
                <td>
                  <strong>We&apos;ve got your back directly.</strong> If something
                  goes wrong within the warranty period, bring or ship the item
                  to the PC Wala store. We handle the repair or replacement
                  ourselves. Simple as that.
                </td>
              </tr>
              <tr>
                <th>Limited Warranty</th>
                <td>
                  <strong>Coverage with conditions.</strong> Also claimed at our
                  store, but with specific limitations. This typically applies
                  to refurbished items, select imports, or used goods — for
                  example, a 7-day checking warranty or coverage limited to
                  certain components only.
                </td>
              </tr>
              <tr>
                <th>No Warranty</th>
                <td>
                  <strong>Sold as-is. Final sale.</strong> No warranty coverage
                  at all. This is reserved for heavily discounted clearance
                  items, specific accessories, or particular used products.
                  The price reflects the risk — and we&apos;ll always flag this
                  clearly before you buy.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CTA Box */}
        <div className={styles.ctaBox}>
          <h3 className={styles.ctaTitle}>// Not Sure? Just Ask.</h3>
          <p className={styles.ctaText}>
            Never assume. If you&apos;re eyeing a specific GPU, CPU, or peripheral
            and want to know exactly what warranty it carries — ask us during
            your WhatsApp chat. We&apos;ll give you the full breakdown before you
            commit.
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
            ASK ON WHATSAPP
          </a>
        </div>
      </div>
    </div>
  );
}
