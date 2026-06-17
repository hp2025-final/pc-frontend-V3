import Link from "next/link";
import styles from "./Breadcrumb.module.css";

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
      <div className={`${styles.breadcrumbContainer} label-mono`}>
        <Link href="/" className={styles.link}>
          HOME
        </Link>
        {items.map((item, idx) => (
          <span key={idx} className={styles.item}>
            <span>/</span>
            {item.url ? (
              <Link href={item.url} className={styles.link}>
                {item.label.toUpperCase()}
              </Link>
            ) : (
              <span className={styles.current}>
                {item.label.toUpperCase()}
              </span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
