/**
 * Inspect BOTH ACF field groups for a Pre-Built PC product:
 * 1. ACF-Pre-Built (hero/identity + component summaries)
 * 2. Pre-Built-Specification (detailed grouped specs)
 *
 * Checks WC REST API meta_data AND dedicated ACF REST API endpoint.
 */

const SLUG = "intel-core-i5-rtx-3060-pre-built-pc-price-in-pakistan";
const BASE_URL = "https://api.pcwalaonline.com";
const CK = "ck_7f6d6fd81539e05b6feec56954ed88309642d695";
const CS = "cs_c27dd09f9906b12d36e99c1caba693bf721805cb";

async function main() {
  // ═══════════════════════════════════════════════════════
  // STEP 1: Fetch product from WooCommerce REST API
  // ═══════════════════════════════════════════════════════
  const wcUrl = `${BASE_URL}/wp-json/wc/v3/products?slug=${SLUG}&status=publish&consumer_key=${CK}&consumer_secret=${CS}`;
  console.log("═══ STEP 1: WooCommerce REST API ═══");
  
  const wcRes = await fetch(wcUrl);
  const products = await wcRes.json();
  if (products.length === 0) { console.log("Product not found!"); return; }
  const product = products[0];
  const productId = product.id;
  console.log(`Product ID: ${productId}`);
  console.log(`Product Name: ${product.name}`);

  // Filter ACF-related meta entries (skip internal _acf_ refs)
  const acfMeta = product.meta_data.filter(m => 
    m.key.startsWith("acf_") && !m.key.startsWith("_acf_")
  );

  // ─── Group 1: ACF-Pre-Built (simple acf_* fields, NOT grouped acf_g_*) ───
  const preBuiltFields = acfMeta.filter(m => !m.key.startsWith("acf_g_"));
  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║  GROUP 1: ACF-Pre-Built                       ║");
  console.log("╚═══════════════════════════════════════════════╝");
  if (preBuiltFields.length > 0) {
    preBuiltFields.forEach(m => {
      const val = typeof m.value === "object" ? JSON.stringify(m.value) : String(m.value);
      console.log(`  ${m.key} = ${val || "(empty)"}`);
    });
    console.log(`  → Total: ${preBuiltFields.length} fields`);
  } else {
    console.log("  ⚠ NO ACF-Pre-Built fields found in WC API!");
  }

  // ─── Group 2: Pre-Built-Specification (grouped acf_g_* fields) ───
  const specFields = acfMeta.filter(m => m.key.startsWith("acf_g_"));
  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║  GROUP 2: Pre-Built-Specification             ║");
  console.log("╚═══════════════════════════════════════════════╝");
  
  // Sub-group by component
  const specGroups = {};
  specFields.forEach(m => {
    // Extract group name: acf_g_XXXXX_acf_f_YYYY → group = XXXXX
    const match = m.key.match(/^acf_g_([a-z_]+?)_acf_f_/);
    const match2 = m.key.match(/^acf_g_([a-z_]+?)$/);
    let groupName = "other";
    if (match) groupName = match[1];
    else if (match2) groupName = match2[1] + " (group marker)";
    
    if (!specGroups[groupName]) specGroups[groupName] = [];
    specGroups[groupName].push(m);
  });

  Object.entries(specGroups).forEach(([group, fields]) => {
    console.log(`\n  ── ${group.toUpperCase()} ──`);
    fields.forEach(m => {
      const val = typeof m.value === "object" ? JSON.stringify(m.value) : String(m.value);
      console.log(`    ${m.key} = ${val || "(empty)"}`);
    });
  });
  console.log(`\n  → Total: ${specFields.length} fields`);

  // ─── Non-ACF meta entries (might reveal missing fields) ───
  const nonAcfMeta = product.meta_data.filter(m => 
    !m.key.startsWith("acf_") && !m.key.startsWith("_acf_")
  );
  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║  OTHER META (non-ACF)                         ║");
  console.log("╚═══════════════════════════════════════════════╝");
  nonAcfMeta.forEach(m => {
    const val = typeof m.value === "object" ? JSON.stringify(m.value) : String(m.value).substring(0, 200);
    console.log(`  ${m.key} = ${val || "(empty)"}`);
  });

  // ═══════════════════════════════════════════════════════
  // STEP 2: Try ACF REST API endpoint (ACF Pro feature)
  // ═══════════════════════════════════════════════════════
  console.log("\n\n═══ STEP 2: ACF REST API Endpoint ═══");
  
  // Try various ACF REST endpoints
  const acfEndpoints = [
    `${BASE_URL}/wp-json/acf/v3/posts/${productId}`,
    `${BASE_URL}/wp-json/acf/v3/product/${productId}`,
    `${BASE_URL}/wp-json/acf/v2/post/${productId}`,
    `${BASE_URL}/wp-json/wp/v2/product/${productId}`,
  ];

  for (const endpoint of acfEndpoints) {
    const label = endpoint.replace(BASE_URL, "");
    try {
      const res = await fetch(endpoint);
      console.log(`\n  ${label} → HTTP ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        // Check for acf key
        if (data.acf) {
          console.log("  ✅ ACF DATA FOUND!");
          console.log("  ACF keys:", Object.keys(data.acf).join(", "));
          console.log("\n  Full ACF data:");
          console.log(JSON.stringify(data.acf, null, 2));
        } else if (typeof data === "object" && !Array.isArray(data)) {
          const keys = Object.keys(data);
          console.log(`  Response keys: ${keys.slice(0, 20).join(", ")}${keys.length > 20 ? "..." : ""}`);
          // If it's the wp/v2 endpoint, check for acf
          if (data.acf) {
            console.log("  ✅ ACF DATA FOUND in response!");
            console.log(JSON.stringify(data.acf, null, 2));
          }
        }
      }
    } catch (err) {
      console.log(`  ${label} → ERROR: ${err.message}`);
    }
  }

  // ═══════════════════════════════════════════════════════
  // STEP 3: Try WP REST API with ?acf_format=standard
  // ═══════════════════════════════════════════════════════
  console.log("\n\n═══ STEP 3: WP REST API for product (wp/v2) ═══");
  try {
    const wpUrl = `${BASE_URL}/wp-json/wp/v2/product/${productId}?_fields=id,acf,meta`;
    const wpRes = await fetch(wpUrl);
    console.log(`  HTTP ${wpRes.status}`);
    if (wpRes.ok) {
      const data = await wpRes.json();
      if (data.acf) {
        console.log("  ✅ ACF DATA (structured):");
        console.log(JSON.stringify(data.acf, null, 2));
      } else {
        console.log("  No acf field in response");
        console.log("  Response keys:", Object.keys(data).join(", "));
      }
    }
  } catch (err) {
    console.log(`  ERROR: ${err.message}`);
  }
}

main().catch(console.error);
