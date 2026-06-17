"use client";

import { ArrowRight } from "lucide-react";
import styles from "./OrderArrowButton.module.css";

interface OrderArrowButtonProps {
  whatsappLink: string;
}

export default function OrderArrowButton({ whatsappLink }: OrderArrowButtonProps) {
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      title="ORDER VIA WHATSAPP"
    >
      <ArrowRight className={styles.svg} strokeWidth={2.5} />
    </a>
  );
}
