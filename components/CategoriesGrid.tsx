"use client";

import Link from "next/link";
import { Laptop, Server, Layers, CircuitBoard, Cpu, Fan, Plug, HardDrive, MemoryStick, Keyboard, Mouse, Printer } from "lucide-react";
import { siApple } from "simple-icons";
import styles from "./CategoriesGrid.module.css";

interface Category {
  name: string;
  slug: string;
  icon: React.ReactNode;
  count: number;
}

interface CategoriesGridProps {
  categoryCounts: {
    laptops: number;
    "pc-cases": number;
    gpus: number;
    motherboards: number;
    cpus: number;
    "pc-cooling-systems": number;
    "power-supplies": number;
    storage: number;
    ram: number;
    "gaming-keyboards": number;
    "gaming-mouse": number;
    "apple-products": number;
  };
}

export default function CategoriesGrid({ categoryCounts }: CategoriesGridProps) {
  const categories: Category[] = [
    {
      name: "Laptops",
      slug: "/category/laptops",
      count: categoryCounts.laptops,
      icon: <Laptop size={48} />,
    },
    {
      name: "PC Cases",
      slug: "/category/pc-cases",
      count: categoryCounts["pc-cases"],
      icon: <Server size={48} />,
    },
    {
      name: "Graphic Cards",
      slug: "/category/gpus",
      count: categoryCounts.gpus,
      icon: <Layers size={48} />,
    },
    {
      name: "Motherboards",
      slug: "/category/motherboards",
      count: categoryCounts.motherboards,
      icon: <CircuitBoard size={48} />,
    },
    {
      name: "Processors",
      slug: "/category/cpus",
      count: categoryCounts.cpus,
      icon: <Cpu size={48} />,
    },
    {
      name: "Cooling Systems",
      slug: "/category/pc-cooling-systems",
      count: categoryCounts["pc-cooling-systems"],
      icon: <Fan size={48} />,
    },
    {
      name: "Power Supplies",
      slug: "/category/power-supplies",
      count: categoryCounts["power-supplies"],
      icon: <Plug size={48} />,
    },
    {
      name: "Storage",
      slug: "/category/storage",
      count: categoryCounts.storage,
      icon: <HardDrive size={48} />,
    },
    {
      name: "RAM",
      slug: "/category/ram",
      count: categoryCounts.ram,
      icon: <MemoryStick size={48} />,
    },
    {
      name: "Gaming Keyboards",
      slug: "/category/gaming-keyboards",
      count: categoryCounts["gaming-keyboards"],
      icon: <Keyboard size={48} />,
    },
    {
      name: "Gaming Mouse",
      slug: "/category/gaming-mouse",
      count: categoryCounts["gaming-mouse"],
      icon: <Mouse size={48} />,
    },
    {
      name: "Apple Products",
      slug: "/category/apple-products",
      count: categoryCounts["apple-products"],
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" role="img">
          <path d={siApple.path} />
        </svg>
      ),
    },

  ];

  return (
    <section className={styles.section}>
      {/* Section Header */}
      <div className={styles.header}>
        {/* Lime Green Bracket Corner - Bottom Right */}
        <span className={styles.cornerBracket} />

        <h2 className={`${styles.sectionTitle} brutalist-section-title`}>
          <span style={{ display: "block", color: "var(--color-dark)" }}>SHOP BY</span>
          <span style={{ display: "block", color: "var(--color-orange)" }}>CATEGORY</span>
        </h2>
      </div>

      {/* Categories Grid */}
      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={category.slug}
            className={styles.categoryCard}
          >
            {/* Top Row: Icon (left) and Product Count (right) */}
            <div className={styles.topRow}>
              {/* Icon - Top Left */}
              <div className={styles.categoryIcon}>
                {category.icon}
              </div>

              {/* Product Count - Top Right */}
              <div className={styles.countWrapper}>
                <div className={styles.categoryCount}>
                  {category.count}
                </div>
                <div className={styles.categoryCountLabel}>
                  Products
                </div>
              </div>
            </div>

            {/* Bottom Row: Category Name (left) and Bracket Corner (right) */}
            <div className={styles.bottomRow}>
              {/* Category Name - Bottom Left */}
              <h3 className={styles.categoryName}>
                {category.name}
              </h3>

              {/* Orange Bracket Corner - Bottom Right */}
              <span className={styles.categoryBracket} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
