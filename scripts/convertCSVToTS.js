// Script to convert all_prebuilds.csv to TypeScript data
const fs = require('fs');
const path = require('path');
const ratingsData = require('./ratingsData');

// Read CSV
const csvPath = path.join(__dirname, '..', 'all_prebuilds.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');

const builds = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const values = line.split(',');
  
  const build = {
    id: parseInt(values[0]),
    series: values[1],
    model: values[2],
    sku: values[3],
    platform: values[4],
    gpu: values[5],
    cpu: values[6],
    ram: values[7],
    storage: values[8],
    motherboard: values[9],
    case: values[10],
    cooler: values[11],
    psu: values[12]
  };
  
  builds.push(build);
}

// Generate badge based on GPU
function generateBadge(gpu) {
  if (gpu.includes("5090") || gpu.includes("7900 XTX")) return "FLAGSHIP BUILD";
  if (gpu.includes("5080") || gpu.includes("5070 Ti")) return "PERFORMANCE BUILD";
  if (gpu.includes("5070") || gpu.includes("9070 XT")) return "GAMING BUILD";
  if (gpu.includes("5060 Ti") || gpu.includes("9070")) return "ESSENTIAL BUILD";
  if (gpu.includes("5060") || gpu.includes("9060")) return "BUDGET BUILD";
  if (gpu.includes("4070")) return "GAMING BUILD";
  if (gpu.includes("4060")) return "STARTER BUILD";
  if (gpu.includes("3060") || gpu.includes("3050")) return "ENTRY BUILD";
  return "CUSTOM BUILD";
}

// Shorten GPU name - remove brand/model variations
function shortenGPU(gpu) {
  // Extract core spec: RTX/RX model + VRAM
  let short = gpu;
  
  // Remove everything in parentheses
  short = short.replace(/\([^)]*\)/g, '').trim();
  
  // Remove brand-specific terms
  short = short.replace(/\b(OC|White|Black|TUF|Prime|Dual|Gaming|TRIO|Eagle|Ventus|Shadow|Solid|ROG|Astral|SUPRIM|Liquid|SOC|Swift|Triple|Duo|Ultra|Max|SFF|NB|Vapor-X|Nitro\+|ProArt|X3)\b/gi, '').trim();
  
  // Clean up extra spaces
  short = short.replace(/\s+/g, ' ').trim();
  
  return short;
}

// Shorten CPU name - remove Intel Core / AMD prefix
function shortenCPU(cpu) {
  return cpu
    .replace(/Intel Core /gi, '')
    .replace(/AMD /gi, '')
    .trim();
}

// Separate by series
const lizard = builds.filter(b => b.series === "LIZARD SERIES").map(b => {
  const { series, ...rest } = b;
  const ratingInfo = ratingsData[b.sku] || { rating: 8.0, badges: ["Custom Build"], why: "Quality pre-built PC." };
  return {
    ...rest,
    badge: generateBadge(b.gpu),
    rating: ratingInfo.rating,
    badges: ratingInfo.badges,
    why: ratingInfo.why,
    gpuShort: shortenGPU(b.gpu),
    cpuShort: shortenCPU(b.cpu)
  };
});
const falcon = builds.filter(b => b.series === "FALCON SERIES").map(b => {
  const { series, ...rest } = b;
  const ratingInfo = ratingsData[b.sku] || { rating: 8.0, badges: ["Custom Build"], why: "Quality pre-built PC." };
  return {
    ...rest,
    badge: generateBadge(b.gpu),
    rating: ratingInfo.rating,
    badges: ratingInfo.badges,
    why: ratingInfo.why,
    gpuShort: shortenGPU(b.gpu),
    cpuShort: shortenCPU(b.cpu)
  };
});
const apex = builds.filter(b => b.series === "APEX SERIES").map(b => {
  const { series, ...rest } = b;
  const ratingInfo = ratingsData[b.sku] || { rating: 8.0, badges: ["Custom Build"], why: "Quality pre-built PC." };
  return {
    ...rest,
    badge: generateBadge(b.gpu),
    rating: ratingInfo.rating,
    badges: ratingInfo.badges,
    why: ratingInfo.why,
    gpuShort: shortenGPU(b.gpu),
    cpuShort: shortenCPU(b.cpu)
  };
});

// Generate TypeScript file
const tsContent = `// Auto-generated from all_prebuilds.csv
// DO NOT EDIT MANUALLY - Run: node scripts/convertCSVToTS.js

export interface PreBuiltPC {
  id: number;
  model: string;
  sku: string;
  platform: string;
  gpu: string;
  cpu: string;
  ram: string;
  storage: string;
  motherboard: string;
  case: string;
  cooler: string;
  psu: string;
  badge: string;
  rating: number;
  badges: string[];
  why: string;
  gpuShort: string;
  cpuShort: string;
}

export const LIZARD_BUILDS: PreBuiltPC[] = ${JSON.stringify(lizard, null, 2)};

export const FALCON_BUILDS: PreBuiltPC[] = ${JSON.stringify(falcon, null, 2)};

export const APEX_BUILDS: PreBuiltPC[] = ${JSON.stringify(apex, null, 2)};

export const ALL_BUILDS = [...LIZARD_BUILDS, ...FALCON_BUILDS, ...APEX_BUILDS];
`;

// Write to file
const outputPath = path.join(__dirname, '..', 'lib', 'prebuiltData.ts');
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log(`✅ Generated ${outputPath}`);
console.log(`📊 Total builds: ${builds.length}`);
console.log(`   - LIZARD: ${lizard.length}`);
console.log(`   - FALCON: ${falcon.length}`);
console.log(`   - APEX: ${apex.length}`);
