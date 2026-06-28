import { WooCommerceProduct } from "@/lib/types";
import styles from "./prebuilt.module.css";

interface ExpertAndWhySectionsProps {
  product: WooCommerceProduct;
}

export default function ExpertAndWhySections({ product }: ExpertAndWhySectionsProps) {
  // Extract expert fields
  const expertFields = [
    { key: "assessment_summary", title: "Assessment Summary" },
    { key: "competitive_games", title: "Competitive Games" },
    { key: "modern_aaa_games", title: "Modern AAA Games" },
    { key: "where_you_should_avoid_ultra_settings", title: "Where You Should Avoid Ultra Settings" },
    { key: "ray_tracing_reality", title: "Ray Tracing Reality" },
    { key: "ai_reality", title: "AI Reality" },
    { key: "can_this_play_every_game_on_ultra", title: "Can This Play Every Game On Ultra" },
  ];
  
  const expertItems = expertFields
    .map((f) => ({
      ...f,
      value: product.meta_data?.find((m) => m.key === f.key)?.value,
    }))
    .filter((f) => f.value && String(f.value).trim() !== "");

  // Extract why fields
  const getMetaVal = (key: string) => {
    const found = product.meta_data?.find((m) => m.key === key);
    return found ? String(found.value).trim() : "";
  };
  
  const whyFields = [
    { key: "why_section_why_we_selected_the_gpu", title: `Why We Selected The ${getMetaVal("acf_graphics_card") || "GPU"}` },
    { key: "why_section_why_we_selected_the_cpu", title: `Why We Selected The ${getMetaVal("acf_processor") || "CPU"}` },
    { key: "why_section_why_we_selected_the_motherboard", title: `Why We Selected The ${getMetaVal("acf_motherboard") || "Motherboard"}` },
    { key: "why_section_why_we_selected_the_ram", title: `Why We Selected The ${getMetaVal("acf_ram") || "RAM"}` },
    { key: "why_section_why_we_selected_the_storage", title: `Why We Selected The ${getMetaVal("acf_storage") || "Storage"}` },
    { key: "why_section_why_we_selected_the_cooler", title: `Why We Selected The ${getMetaVal("acf_pc_coolers_fans") || "Cooler"}` },
    { key: "why_section_why_we_selected_the_psu", title: `Why We Selected The ${getMetaVal("acf_power_supply") || "PSU"}` },
    { key: "why_section_why_we_selected_the_pc_case", title: `Why We Selected The ${getMetaVal("acf_pc_case") || "PC Case"}` },
  ];
  
  const whyItems = whyFields
    .map((f) => ({
      ...f,
      value: product.meta_data?.find((m) => m.key === f.key)?.value,
    }))
    .filter((f) => f.value && String(f.value).trim() !== "");

  return (
    <>
      {/* Expert Assessment Section */}
      {expertItems.length > 0 && (
        <section className={styles.flatSection} id="expert-assessment">
          <div className={styles.flatSectionHeader}>EXPERT ASSESSMENT</div>
          <div className={styles.flatGrid}>
            {expertItems.map((item, idx) => (
              <div key={idx} className={styles.flatCard} id={`expert-${item.key}`}>
                <h3 className={styles.flatCardTitle}>{item.title}</h3>
                <div
                  className={styles.flatCardContent}
                  dangerouslySetInnerHTML={{ __html: String(item.value) }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Why Section */}
      {whyItems.length > 0 && (
        <section className={styles.flatSection} id="why-chosen">
          <div className={styles.flatSectionHeader}>WHY WE CHOSE THESE COMPONENTS?</div>
          <div className={styles.flatGrid}>
            {whyItems.map((item, idx) => (
              <div key={idx} className={`${styles.flatCard} ${styles.whyCard}`} id={`why-${item.key}`}>
                <h3 className={styles.flatCardTitle}>{item.title}?</h3>
                <div
                  className={styles.flatCardContent}
                  dangerouslySetInnerHTML={{ __html: String(item.value) }}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
