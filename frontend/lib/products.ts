import { Product, Category } from "./types";
import { getCloudinaryUrl } from "./cloudinary";

export const CATEGORIES: Category[] = [
  { id: "all", name: "All Products", slug: "all", count: 9 },
  { id: "electrodes", name: "Earthing Electrodes", slug: "earthing-electrodes", count: 6 },
  { id: "lightning", name: "Lightning Protection", slug: "lightning-protection", count: 1 },
  { id: "enhancement", name: "Ground Enhancement", slug: "ground-enhancement", count: 1 },
  { id: "accessories", name: "Pit Covers & Accessories", slug: "pit-covers", count: 1 },
];

export const PRODUCTS: Product[] = [
  {
    slug: "gi-earthing-electrode",
    code: "1-FEGI",
    name: "GI Earthing Electrode",
    category: "Earthing Electrodes",
    categorySlug: "earthing-electrodes",
    tag: "High Durability",
    shortDescription: "Hot dip galvanized pipe-in-pipe earthing electrode designed for rapid fault current dissipation and long service life.",
    description: "Forecast Earthings GI Earthing Electrodes are manufactured using prime quality steel pipes treated with heavy hot-dip galvanization. The dual-pipe (pipe-in-pipe) technology filled with primary conductive crystalline mixture ensures ultra-fast fault current dissipation into the earth, preventing electrical hazards in residential, commercial, and industrial facilities.",
    features: [
      "Hot dip galvanized for maximum corrosion protection",
      "Fast fault current dissipation capability",
      "Low maintenance with long-lasting ground stability",
      "Easy and fast installation in diverse soil conditions",
      "Complies with IS 3043, IEEE 80, and international standards"
    ],
    specifications: [
      { label: "Available Diameters", value: "48 mm, 60 mm, 76 mm, 88 mm" },
      { label: "Standard Lengths", value: "2.0 m, 2.5 m, 3.0 m" },
      { label: "Inner Strip / Pipe Size", value: "25x3 mm / 32x6 mm" },
      { label: "Coating Thickness", value: "80-100 Microns (Hot Dip)" },
      { label: "Soil Suitability", value: "All Normal, Sandy & Rocky Soils" }
    ],
    applications: [
      "Substation and transformer earthing",
      "Residential & commercial building safety",
      "Industrial machinery and LT/HT panels",
      "Telecommunication towers and data centers"
    ],
    images: [getCloudinaryUrl("/images/products/gi-earthing-electrode.svg")],
    brochureAvailable: true
  },
  {
    slug: "copper-bonded-earthing-electrode",
    code: "2-FECB",
    name: "Copper Bonded Earthing Electrode",
    category: "Earthing Electrodes",
    categorySlug: "earthing-electrodes",
    tag: "Popular Choice",
    shortDescription: "Molecularly bonded copper earthing electrode delivering superior conductivity, mechanical strength, and extended operational lifespan.",
    description: "Engineered with high tensile low carbon steel core molecularly bonded with 99.9% pure electrolytic copper, the Forecast Earthings Copper Bonded Earthing Electrode offers exceptional current dissipation and anti-corrosive performance. Perfect for environments demanding low soil resistance and high reliability.",
    features: [
      "Molecular copper bonding guarantees no slipping or peeling",
      "High tensile strength steel core allows deep driving",
      "Enhanced electrical conductivity for lightning & fault currents",
      "Exceptional longevity in acidic and alkaline soils",
      "Maintenance-free design suitable for critical infrastructure"
    ],
    specifications: [
      { label: "Product Code", value: "2-FECB" },
      { label: "Core Material", value: "High Tensile Low Carbon Steel" },
      { label: "Bonding Material", value: "99.9% Pure Electrolytic Copper" },
      { label: "Copper Layer Thickness", value: "250 Microns (0.254mm)" },
      { label: "Outer Diameter", value: "14.2mm, 17.2mm, 25mm, 48mm, 50mm" },
      { label: "Standard Lengths", value: "2.0m, 3.0m" },
      { label: "Current Capacity", value: "High Fault Current Withstanding" },
      { label: "Service Life", value: "Designed for 30+ Years" }
    ],
    applications: [
      "Solar PV power plants and wind farms",
      "Heavy industrial manufacturing units",
      "Oil & gas refineries",
      "Railways and metro transit grounding"
    ],
    images: [getCloudinaryUrl("/images/products/copper-bonded-electrode.svg")],
    brochureAvailable: true
  },
  {
    slug: "copper-terminal-earthing-electrode",
    code: "3-FECT",
    name: "Copper Terminal Earthing Electrode",
    category: "Earthing Electrodes",
    categorySlug: "earthing-electrodes",
    tag: "Heavy Duty",
    shortDescription: "Specially designed earthing electrode featuring a heavy-duty copper terminal plate for robust busbar connection.",
    description: "The Forecast Earthings Copper Terminal Earthing Electrode combines a high-performance grounding rod with a precision welded or cold-formed pure copper terminal top plate. This design simplifies conductor clamping and ensures minimum resistance at the connection point.",
    features: [
      "Heavy-duty solid copper terminal head for direct busbar attachment",
      "High electrical conductivity and minimal contact resistance",
      "Corrosion-resistant terminal plate for harsh environments",
      "Factory-filled high conductive crystalline compound",
      "Simplified connection for multi-strip earthing grid networks"
    ],
    specifications: [
      { label: "Product Code", value: "3-FECT" },
      { label: "Terminal Material", value: "Heavy Duty Electrolytic Copper Plate" },
      { label: "Terminal Hole Size", value: "12mm / 14mm Dual Bolt Hole" },
      { label: "Rod Diameter", value: "50mm / 80mm Pipe Design" },
      { label: "Length", value: "2.0m, 3.0m" },
      { label: "Internal Filling", value: "High Conduction Crystalline Powder" },
      { label: "Fault Current Rate", value: "Up to 50kA for 1 sec" }
    ],
    applications: [
      "Power generation and transmission substations",
      "Heavy industrial motor control centers",
      "Captive power plants and switchyards"
    ],
    images: [getCloudinaryUrl("/images/products/copper-terminal-electrode.svg")],
    brochureAvailable: true
  },
  {
    slug: "pure-copper-earthing-electrode",
    code: "4-FEPC",
    name: "Pure Copper Earthing Electrode",
    category: "Earthing Electrodes",
    categorySlug: "earthing-electrodes",
    tag: "Premium Grade",
    shortDescription: "Manufactured from 99.9% pure electrolytic grade copper pipe-in-pipe structure for ultimate electrical conductivity and permanent protection.",
    description: "For maximum mission-critical applications where failure is not an option, Forecast Earthings Pure Copper Earthing Electrodes provide unmatched conductivity and lifetime stability. Constructed completely from 99.9% electrolytic grade copper pipes and filled with anti-corrosive chemical matrix, it is the highest tier earthing solution.",
    features: [
      "Constructed from 99.9% pure electrolytic grade copper",
      "Supreme electrical conductivity and zero rust formation",
      "Ultra-fast fault current dissipation to prevent equipment damage",
      "Zero periodic maintenance required over decades",
      "Superior performance in high-resistivity and corrosive soils"
    ],
    specifications: [
      { label: "Product Code", value: "4-FEPC" },
      { label: "Material Composition", value: "99.9% Pure Electrolytic Grade Copper" },
      { label: "Outer Pipe Size", value: "40mm / 50mm / 75mm OD" },
      { label: "Inner Strip Material", value: "Pure Copper Strip (25x3mm / 32x6mm)" },
      { label: "Standard Lengths", value: "1.0m, 2.0m, 3.0m" },
      { label: "Conductivity", value: "100% IACS Standard" },
      { label: "Service Life", value: "Permanent / Lifelong" }
    ],
    applications: [
      "Hospital ICU & medical diagnostic equipment earthing",
      "Defense, aerospace & radar stations",
      "Data centers & telecom hubs",
      "Nuclear & thermal power facilities"
    ],
    images: [getCloudinaryUrl("/images/products/pure-copper-electrode.svg")],
    brochureAvailable: true
  },
  {
    slug: "copper-bonded-4g-rod",
    code: "5-FECBR",
    name: "Copper Bonded 4G Rod",
    category: "Earthing Electrodes",
    categorySlug: "earthing-electrodes",
    tag: "Telecom Specialized",
    shortDescription: "High-tensile copper-bonded solid rod engineered specifically for telecom 4G/5G towers, distribution poles, and compact pits.",
    description: "Designed to meet the stringent grounding standards of telecommunication providers, the Forecast Earthings Copper Bonded 4G Rod offers deep soil penetration with cold-rolled steel core and uniform molecular copper jacket. Comes with precision-threaded ends or unthreaded options for deep driving.",
    features: [
      "Solid high-carbon steel core for hard ground driving without bending",
      "Uniform 250 micron copper bonding per IEC/UL standards",
      "Multiple model variants (Threaded / Pointed / Flat ends)",
      "High weather and chemical resistance in soil",
      "Optimized length and diameter for telecom earth pits"
    ],
    specifications: [
      { label: "Product Code", value: "5-FECBR" },
      { label: "Core Metal", value: "Cold Drawn Carbon Steel" },
      { label: "Copper Coating", value: "250 Micron Molecular Copper" },
      { label: "Rod Diameters", value: "14.2mm (5/8\"), 17.2mm (3/4\"), 20mm" },
      { label: "Length Variants", value: "1.2m, 2.4m, 3.0m" },
      { label: "Terminal Size", value: "M14 / M16 Threaded or Clamp Mount" },
      { label: "Compliance", value: "NABL & BIS Tested Standards" }
    ],
    applications: [
      "4G / 5G Mobile Base Stations & Telecom Towers",
      "Distribution transformers & utility poles",
      "CCTV & Traffic monitoring network grounding"
    ],
    images: [getCloudinaryUrl("/images/products/copper-bonded-4g-rod.svg")],
    brochureAvailable: true
  },
  {
    slug: "centrifugally-cast-iron-earthing-electrode",
    code: "6-FECI",
    name: "Centrifugally Cast Iron Earthing Electrode",
    category: "Earthing Electrodes",
    categorySlug: "earthing-electrodes",
    tag: "Heavy Industry",
    shortDescription: "Robust centrifugally cast iron pipe earthing electrode built for LT & HT power system grounding in tough terrain.",
    description: "Forecast Earthings Centrifugally Cast Iron Earthing Electrodes are manufactured using centrifugal casting technology, ensuring dense, pore-free grain structure and exceptional resistance against chemical corrosion. Ideal for heavy electrical installations, LT/HT switchyards, and rocky or saline soils.",
    features: [
      "Centrifugally cast iron construction with pore-free structure",
      "Available for both LT (Low Tension) & HT (High Tension) earthing",
      "Superior resistance against aggressive chemical and saline soils",
      "High mechanical durability and high current dissipation capacity",
      "Complete with top terminal flange and watering funnel attachment"
    ],
    specifications: [
      { label: "Product Code", value: "6-FECI" },
      { label: "Type / Grade", value: "LT Earthing & HT Earthing Grade" },
      { label: "Manufacturing Process", value: "Centrifugal Casting Method" },
      { label: "Pipe Diameter", value: "100mm (4\") / 150mm (6\") ID" },
      { label: "Flange Dimension", value: "Integrated Cast Iron Top Flange" },
      { label: "Wall Thickness", value: "7.5mm - 10mm Heavy Duty Wall" },
      { label: "Standard Length", value: "2.5m, 3.0m" }
    ],
    applications: [
      "HT/LT switchyards & sub-station grids",
      "Heavy engineering factories and steel plants",
      "Saline coastal zone grounding systems"
    ],
    images: [getCloudinaryUrl("/images/products/cast-iron-electrode.svg")],
    brochureAvailable: true
  },
  {
    slug: "pit-covers",
    code: "7-FECC",
    name: "Earth Pit Covers (FRP / Poly / Cast Iron)",
    category: "Pit Covers & Accessories",
    categorySlug: "pit-covers",
    tag: "Protection Enclosure",
    shortDescription: "Heavy-load rated protective earth pit enclosures available in FRP, High-Density Polypropylene, and Cast Iron variants.",
    description: "Forecast Earthings Earth Pit Covers provide secure, weatherproof, and traffic-rated protection for earthing electrode termination points. Designed for convenient periodic testing and inspection, these covers prevent debris accumulation while withstanding heavy vehicle wheel loads.",
    features: [
      "Available in FRP (Fiber Reinforced Plastic), Heavy Poly, and Cast Iron (CI)",
      "High load-bearing capacity suitable for industrial roadways",
      "UV resistant and weatherproof material composition",
      "Removable top lid with secure locking options for easy testing access",
      "Standard dimensions designed for easy installation over 4\" to 8\" holes"
    ],
    specifications: [
      { label: "Product Code", value: "7-FECC" },
      { label: "Material Options", value: "FRP / High-Density Poly / Cast Iron" },
      { label: "Load Capacity", value: "5 Ton to 15 Ton Rating Options" },
      { label: "Top Diameter", value: "250mm - 350mm" },
      { label: "Bottom Diameter", value: "330mm - 450mm" },
      { label: "Overall Height", value: "260mm - 300mm" },
      { label: "Color Options", value: "Industrial Green / Black / Gray" }
    ],
    applications: [
      "Industrial driveway earth pit protection",
      "Commercial building perimeter earth inspection chambers",
      "Substation grid test link enclosures"
    ],
    images: [getCloudinaryUrl("/images/products/pit-cover.svg")],
    brochureAvailable: true
  },
  {
    slug: "back-fill-earth-enhancement-compound",
    code: "8-FEEG",
    name: "Back Fill Earth Enhancement Compound",
    category: "Ground Enhancement",
    categorySlug: "ground-enhancement",
    tag: "NABL Tested",
    shortDescription: "NABL-tested ultra-conductive non-toxic ground enhancement material designed to permanently reduce soil resistivity around electrodes.",
    description: "Forecast Earthings Advanced Back Fill Earth Enhancement Compound is a specially formulated conductive material designed to lower earth resistance and improve grounding effectiveness in high-resistivity soils. Tested at NABL-accredited laboratories, it expands when hydrated and maintains low resistance over decades without washing away.",
    features: [
      "Tested and certified at NABL-accredited testing laboratories",
      "Highly conductive material dramatically reduces soil resistivity",
      "Non-toxic, environmentally friendly and non-polluting to groundwater",
      "Maintenance-free — retains moisture naturally without periodic watering",
      "Does not dissolve, leach, or wash away over time",
      "Protects earthing rod against soil corrosion"
    ],
    specifications: [
      { label: "Product Code", value: "8-FEEG" },
      { label: "Certification", value: "NABL Laboratory Tested & Approved" },
      { label: "Resistivity Value", value: "< 0.12 ohm-meter" },
      { label: "Standard Packing", value: "25 kg Heavy Duty Moisture-Proof Bags" },
      { label: "pH Range", value: "6.8 - 7.5 (Neutral / Non-Corrosive)" },
      { label: "Environmental Safety", value: "100% Non-Toxic & Lead/Heavy Metal Free" },
      { label: "Watering Requirement", value: "No periodic watering required after initial set" }
    ],
    applications: [
      "High resistivity soils (rocky, sandy, dry terrain)",
      "Substation earth pits and lightning protection grids",
      "Solar & Wind power project grounding"
    ],
    images: [getCloudinaryUrl("/images/products/backfill-compound.svg")],
    brochureAvailable: true
  },
  {
    slug: "ese-lightning-arrester",
    code: "9-FELA",
    name: "ESE Lightning Arrester",
    category: "Lightning Protection",
    categorySlug: "lightning-protection",
    tag: "NFC 17-102 Tested",
    shortDescription: "Non-electronic Early Streamer Emission (ESE) lightning arrester crafted from 304L stainless steel per NFC 17-102 (2011) standards.",
    description: "The Forecast Earthings ESE Lightning Arrester (Early Streamer Emission) delivers advanced, long-range external lightning protection for large structures, commercial complexes, and industrial plants. Built from premium 304L stainless steel, it triggers an early upward streamer (ΔT = 60 μs) to safely intercept lightning discharges before they hit the structure.",
    features: [
      "Non-electronic ESE technology — fully autonomous operation",
      "Tested in compliance with NFC 17-102 (2011) international standards",
      "Emission advance time: ΔT = 60 μs for wide protection radius",
      "High lightning current tested capability (100kA+ 10/350 μs curve)",
      "Requires no battery, external electrical power, or solar panel",
      "Constructed from corrosion-resistant 304L grade stainless steel",
      "Compatible with standard copper/GI down-conductor tapes and cables"
    ],
    specifications: [
      { label: "Product Code", value: "9-FELA" },
      { label: "Technology", value: "Early Streamer Emission (ESE) Non-Electronic" },
      { label: "Standard Reference", value: "NFC 17-102 (2011) & IEC 62305" },
      { label: "Advance Trigger Time (ΔT)", value: "60 Microseconds (60 μs)" },
      { label: "Material Construction", value: "Grade 304L Stainless Steel" },
      { label: "Power Source", value: "Self-Energizing (Atmosphere Electric Field)" },
      { label: "Protection Radius", value: "Up to 107 Meters (Level IV @ h=5m)" },
      { label: "Down Conductor Connection", value: "Suitable for M16 / 30x3mm Conductor Tape" }
    ],
    applications: [
      "High-rise commercial and residential towers",
      "Industrial manufacturing plants and warehouses",
      "Airports, stadiums, and educational campuses",
      "Solar power parks and hazardous storage facilities"
    ],
    images: [getCloudinaryUrl("/images/products/ese-lightning-arrester.svg")],
    brochureAvailable: true
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (!categorySlug || categorySlug === "all") {
    return PRODUCTS;
  }
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}
