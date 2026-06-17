import { siWhatsapp } from "simple-icons";
import { WooCommerceProduct } from "@/lib/types";
import { generateWhatsAppLink } from "@/lib/utils";
import styles from "./WhatsAppButton.module.css";

interface WhatsAppButtonProps {
  product: WooCommerceProduct;
  fullWidth?: boolean;
  compact?: boolean;
}

export default function WhatsAppButton({ product, fullWidth = true, compact = false }: WhatsAppButtonProps) {
  const link = generateWhatsAppLink(product);

  const btnClasses = [
    styles.button,
    fullWidth ? styles.fullWidth : "",
    compact ? styles.compact : "",
    "label-mono"
  ].filter(Boolean).join(" ");

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={btnClasses}
      title="ORDER VIA WHATSAPP"
    >
      {/* WhatsApp SVG Icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        role="img"
        style={{ flexShrink: 0 }}
      >
        <path d={siWhatsapp.path} />
      </svg>
      {!compact && <span style={{ marginLeft: compact ? "0px" : "10px" }}>ORDER VIA WHATSAPP</span>}
    </a>
  );
}
