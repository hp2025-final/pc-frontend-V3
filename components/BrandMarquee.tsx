"use client";

import Link from "next/link";
import styles from "./BrandMarquee.module.css";

interface Brand {
  name: string;
  slug: string;
}

export default function BrandMarquee() {
  // Brands fetched from WooCommerce backend (one-time manual export)
  // To update: Export from WooCommerce Admin → Products → Attributes → Brand → Terms
  const brands: Brand[] = [
    { name: "1ST PLAYER", slug: "/brand/1st-player" },
    { name: "A4TECH", slug: "/brand/a4tech" },
    { name: "ACER", slug: "/brand/acer" },
    { name: "ADATA", slug: "/brand/adata" },
    { name: "AEROCOOL", slug: "/brand/aerocool" },
    { name: "AIGO", slug: "/brand/aigo" },
    { name: "AMAZE", slug: "/brand/amaze" },
    { name: "AMD", slug: "/brand/amd" },
    { name: "ANTEC", slug: "/brand/antec" },
    { name: "APACER", slug: "/brand/apacer" },
    { name: "APPLE", slug: "/brand/apple" },
    { name: "ASROCK", slug: "/brand/asrock" },
    { name: "ASUS", slug: "/brand/asus" },
    { name: "ATK", slug: "/brand/atk" },
    { name: "ATTACK SHARK", slug: "/brand/attack-shark" },
    { name: "AULA", slug: "/brand/aula" },
    { name: "BLOODY", slug: "/brand/bloody" },
    { name: "BOOST", slug: "/brand/boost" },
    { name: "BOOST CORE", slug: "/brand/boost-core" },
    { name: "COLORFUL", slug: "/brand/colorful" },
    { name: "COOLER MASTER", slug: "/brand/cooler-master" },
    { name: "CORSAIR", slug: "/brand/corsair" },
    { name: "COUGAR", slug: "/brand/cougar" },
    { name: "CRUCIAL", slug: "/brand/crucial" },
    { name: "CRYSTALX", slug: "/brand/crystalx" },
    { name: "DARKFLASH", slug: "/brand/darkflash" },
    { name: "DEEPCOOL", slug: "/brand/deepcool" },
    { name: "DELL", slug: "/brand/dell" },
    { name: "EASE", slug: "/brand/ease" },
    { name: "EPSON", slug: "/brand/epson" },
    { name: "EVGA", slug: "/brand/evga" },
    { name: "FANTECH", slug: "/brand/fantech" },
    { name: "FSP", slug: "/brand/fsp" },
    { name: "FUJITSU", slug: "/brand/fujitsu" },
    { name: "G.SKILL", slug: "/brand/g-skill" },
    { name: "GALAX", slug: "/brand/galax" },
    { name: "GAMDIAS", slug: "/brand/gamdias" },
    { name: "GAMEMAX", slug: "/brand/gamemax" },
    { name: "GATEWAY", slug: "/brand/gateway" },
    { name: "GIGABYTE", slug: "/brand/gigabyte" },
    { name: "GLORIOUS", slug: "/brand/glorious" },
    { name: "GRAVASTAR", slug: "/brand/gravastar" },
    { name: "HIKSEMI", slug: "/brand/hiksemi" },
    { name: "HP", slug: "/brand/hp" },
    { name: "HYPERX", slug: "/brand/hyperx" },
    { name: "HYTE", slug: "/brand/hyte" },
    { name: "ID-COOLING", slug: "/brand/id-cooling" },
    { name: "INNO3D", slug: "/brand/inno3d" },
    { name: "INTEL", slug: "/brand/intel" },
    { name: "KINGSTON", slug: "/brand/kingston" },
    { name: "LEADTEK", slug: "/brand/leadtek" },
    { name: "LENOVO", slug: "/brand/lenovo" },
    { name: "LEXAR", slug: "/brand/lexar" },
    { name: "LIAN", slug: "/brand/lian" },
    { name: "LIAN-LI", slug: "/brand/lian-li" },
    { name: "LOGITECH", slug: "/brand/logitech" },
    { name: "MADLIONS", slug: "/brand/madlions" },
    { name: "MAXSUN", slug: "/brand/maxsun" },
    { name: "MCHOSE", slug: "/brand/mchose" },
    { name: "MCHOUS", slug: "/brand/mchous" },
    { name: "MEETION", slug: "/brand/meetion" },
    { name: "MICROSOFT", slug: "/brand/microsoft" },
    { name: "MSI", slug: "/brand/msi" },
    { name: "NETAC", slug: "/brand/netac" },
    { name: "NVIDIA", slug: "/brand/nvidia" },
    { name: "NZXT", slug: "/brand/nzxt" },
    { name: "OSCOO", slug: "/brand/oscoo" },
    { name: "PALIT", slug: "/brand/palit" },
    { name: "PATRIOT", slug: "/brand/patriot" },
    { name: "PHILIPS", slug: "/brand/philips" },
    { name: "PNY", slug: "/brand/pny" },
    { name: "RAPOO", slug: "/brand/rapoo" },
    { name: "RAZER", slug: "/brand/razer" },
    { name: "REDRAGON", slug: "/brand/redragon" },
    { name: "SAMA", slug: "/brand/sama" },
    { name: "SAMSUNG", slug: "/brand/samsung" },
    { name: "SANDISK", slug: "/brand/sandisk" },
    { name: "SAPPHIRE", slug: "/brand/sapphire" },
    { name: "SEAGATE", slug: "/brand/seagate" },
    { name: "SILVERSTONE", slug: "/brand/silverstone" },
    { name: "SKYLOONG", slug: "/brand/skyloong" },
    { name: "SNOWMAN", slug: "/brand/snowman" },
    { name: "SONIC", slug: "/brand/sonic" },
    { name: "STEELSERIES", slug: "/brand/steelseries" },
    { name: "SUPER FLOWER", slug: "/brand/super-flower" },
    { name: "TEAMGROUP", slug: "/brand/teamgroup" },
    { name: "THERMALRIGHT", slug: "/brand/thermalright" },
    { name: "THERMALTAKE", slug: "/brand/thermaltake" },
    { name: "THINKWAY", slug: "/brand/thinkway" },
    { name: "THUNDER", slug: "/brand/thunder" },
    { name: "TOSHIBA", slug: "/brand/toshiba" },
    { name: "TRANSCEND", slug: "/brand/transcend" },
    { name: "UGREEN", slug: "/brand/ugreen" },
    { name: "WD", slug: "/brand/wd" },
    { name: "XFX", slug: "/brand/xfx" },
    { name: "XIGMATEK", slug: "/brand/xigmatek" },
    { name: "XINMENG", slug: "/brand/xinmeng" },
    { name: "XPG", slug: "/brand/xpg" },
    { name: "ZOTAC", slug: "/brand/zotac" },
  ];

  // Duplicate brands array for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className={styles.marqueeSection}>
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {duplicatedBrands.map((brand, index) => (
            <Link 
              key={`${brand.name}-${index}`}
              href={brand.slug}
              className={styles.brandLink}
            >
              <span className={styles.brandDot} />
              <span className={styles.brandName}>{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
