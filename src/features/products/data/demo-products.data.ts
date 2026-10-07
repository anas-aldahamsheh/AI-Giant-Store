import type { Product } from "@/features/products/types/product.types";

/**
 * Sample catalog loaded on a visitor's first visit so the store has
 * something to browse, compare and ask the assistant about.
 * Visitors can still remove these or add their own in the admin panel.
 */
export const demoProducts: Product[] = [
  {
    id: "demo_01",
    title: "Aurora ANC Headphones",
    slug: "aurora-anc-headphones",
    shortDescription:
      "Over-ear headphones with adaptive noise cancelling and 40-hour battery.",
    description:
      "Over-ear headphones with adaptive noise cancelling and 40-hour battery. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Audio",
    brand: "Sonix",
    imageUrl: "/demo-products/aurora-anc-headphones.svg",
    gallery: ["/demo-products/aurora-anc-headphones.svg"],
    price: 249,
    compareAtPrice: 299,
    currency: "USD",
    ratingAverage: 4.7,
    ratingCount: 312,
    stockStatus: "in_stock",
    tags: ["headphones", "noise cancelling", "wireless", "travel"],
    attributes: [
      {
        name: "Battery",
        value: "40 hours",
      },
      {
        name: "Connectivity",
        value: "Bluetooth 5.3",
      },
      {
        name: "Weight",
        value: "254 g",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_01_r1",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-02T09:00:00.000Z",
      },
      {
        id: "demo_01_r2",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-02T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-02T09:00:00.000Z",
    updatedAt: "2026-09-02T09:00:00.000Z",
  },
  {
    id: "demo_02",
    title: "Pulse Buds Pro",
    slug: "pulse-buds-pro",
    shortDescription:
      "True wireless earbuds with spatial audio and a pocket-size charging case.",
    description:
      "True wireless earbuds with spatial audio and a pocket-size charging case. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Audio",
    brand: "Sonix",
    imageUrl: "/demo-products/pulse-buds-pro.svg",
    gallery: ["/demo-products/pulse-buds-pro.svg"],
    price: 129,
    compareAtPrice: 159,
    currency: "USD",
    ratingAverage: 4.5,
    ratingCount: 488,
    stockStatus: "in_stock",
    tags: ["earbuds", "wireless", "gym", "commute"],
    attributes: [
      {
        name: "Battery",
        value: "8 h + 24 h case",
      },
      {
        name: "Water resistance",
        value: "IPX5",
      },
      {
        name: "Connectivity",
        value: "Bluetooth 5.3",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_02_r1",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-03T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-03T09:00:00.000Z",
    updatedAt: "2026-09-03T09:00:00.000Z",
  },
  {
    id: "demo_03",
    title: "Boom Cube Speaker",
    slug: "boom-cube-speaker",
    shortDescription:
      "Portable speaker with deep bass, splash resistance and 18-hour playback.",
    description:
      "Portable speaker with deep bass, splash resistance and 18-hour playback. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Audio",
    brand: "Resona",
    imageUrl: "/demo-products/boom-cube-speaker.svg",
    gallery: ["/demo-products/boom-cube-speaker.svg"],
    price: 89,
    currency: "USD",
    ratingAverage: 4.4,
    ratingCount: 205,
    stockStatus: "in_stock",
    tags: ["speaker", "portable", "outdoor", "party"],
    attributes: [
      {
        name: "Battery",
        value: "18 hours",
      },
      {
        name: "Water resistance",
        value: "IP67",
      },
      {
        name: "Output",
        value: "30 W",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_03_r1",
        authorName: "Lina K.",
        rating: 5,
        title: "Exactly what I needed",
        body: "Setup took two minutes and it feels premium in hand.",
        verifiedPurchase: true,
        createdAt: "2026-09-04T09:00:00.000Z",
      },
      {
        id: "demo_03_r2",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-04T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-04T09:00:00.000Z",
    updatedAt: "2026-09-04T09:00:00.000Z",
  },
  {
    id: "demo_04",
    title: "Chrono S2 Smartwatch",
    slug: "chrono-s2-smartwatch",
    shortDescription:
      "AMOLED smartwatch with GPS, heart-rate tracking and a 7-day battery.",
    description:
      "AMOLED smartwatch with GPS, heart-rate tracking and a 7-day battery. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Wearables",
    brand: "Chrono",
    imageUrl: "/demo-products/chrono-s2-smartwatch.svg",
    gallery: ["/demo-products/chrono-s2-smartwatch.svg"],
    price: 229,
    compareAtPrice: 279,
    currency: "USD",
    ratingAverage: 4.6,
    ratingCount: 640,
    stockStatus: "in_stock",
    tags: ["smart watch", "fitness", "gps", "health"],
    attributes: [
      {
        name: "Display",
        value: '1.43" AMOLED',
      },
      {
        name: "Battery",
        value: "7 days",
      },
      {
        name: "Water resistance",
        value: "5 ATM",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_04_r1",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-05T09:00:00.000Z",
      },
      {
        id: "demo_04_r2",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-05T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-05T09:00:00.000Z",
    updatedAt: "2026-09-05T09:00:00.000Z",
  },
  {
    id: "demo_05",
    title: "Stride Fitness Band",
    slug: "stride-fitness-band",
    shortDescription: "Slim fitness band that tracks steps, sleep and heart rate.",
    description:
      "Slim fitness band that tracks steps, sleep and heart rate. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Wearables",
    brand: "Chrono",
    imageUrl: "/demo-products/stride-fitness-band.svg",
    gallery: ["/demo-products/stride-fitness-band.svg"],
    price: 59,
    compareAtPrice: 79,
    currency: "USD",
    ratingAverage: 4.2,
    ratingCount: 931,
    stockStatus: "in_stock",
    tags: ["fitness", "band", "sleep", "budget"],
    attributes: [
      {
        name: "Battery",
        value: "14 days",
      },
      {
        name: "Sensors",
        value: "Heart rate, SpO2",
      },
      {
        name: "Weight",
        value: "24 g",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_05_r1",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-06T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-06T09:00:00.000Z",
    updatedAt: "2026-09-06T09:00:00.000Z",
  },
  {
    id: "demo_06",
    title: "Halo Smart Ring",
    slug: "halo-smart-ring",
    shortDescription:
      "Titanium smart ring that tracks sleep, recovery and activity without a screen.",
    description:
      "Titanium smart ring that tracks sleep, recovery and activity without a screen. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Wearables",
    brand: "Kinetic",
    imageUrl: "/demo-products/halo-smart-ring.svg",
    gallery: ["/demo-products/halo-smart-ring.svg"],
    price: 299,
    currency: "USD",
    ratingAverage: 4.3,
    ratingCount: 118,
    stockStatus: "low_stock",
    tags: ["ring", "sleep", "health", "premium"],
    attributes: [
      {
        name: "Material",
        value: "Titanium",
      },
      {
        name: "Battery",
        value: "6 days",
      },
      {
        name: "Sizes",
        value: "6 to 13",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_06_r1",
        authorName: "Lina K.",
        rating: 5,
        title: "Exactly what I needed",
        body: "Setup took two minutes and it feels premium in hand.",
        verifiedPurchase: true,
        createdAt: "2026-09-07T09:00:00.000Z",
      },
      {
        id: "demo_06_r2",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-07T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-07T09:00:00.000Z",
    updatedAt: "2026-09-07T09:00:00.000Z",
  },
  {
    id: "demo_07",
    title: "Lumen Z5 Mirrorless Camera",
    slug: "lumen-z5-mirrorless-camera",
    shortDescription:
      "24 MP full-frame mirrorless camera with 4K60 video and in-body stabilisation.",
    description:
      "24 MP full-frame mirrorless camera with 4K60 video and in-body stabilisation. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Cameras",
    brand: "Lumen",
    imageUrl: "/demo-products/lumen-z5-mirrorless-camera.svg",
    gallery: ["/demo-products/lumen-z5-mirrorless-camera.svg"],
    price: 1199,
    compareAtPrice: 1349,
    currency: "USD",
    ratingAverage: 4.8,
    ratingCount: 176,
    stockStatus: "in_stock",
    tags: ["camera", "creator", "4k", "photography"],
    attributes: [
      {
        name: "Sensor",
        value: "24 MP full frame",
      },
      {
        name: "Video",
        value: "4K 60 fps",
      },
      {
        name: "Stabilisation",
        value: "5-axis IBIS",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_07_r1",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-08T09:00:00.000Z",
      },
      {
        id: "demo_07_r2",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-08T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-08T09:00:00.000Z",
    updatedAt: "2026-09-08T09:00:00.000Z",
  },
  {
    id: "demo_08",
    title: "TrailCam 4K Action Camera",
    slug: "trailcam-4k-action-camera",
    shortDescription:
      "Rugged action camera with 4K video, horizon levelling and waterproof body.",
    description:
      "Rugged action camera with 4K video, horizon levelling and waterproof body. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Cameras",
    brand: "Lumen",
    imageUrl: "/demo-products/trailcam-4k-action-camera.svg",
    gallery: ["/demo-products/trailcam-4k-action-camera.svg"],
    price: 279,
    compareAtPrice: 329,
    currency: "USD",
    ratingAverage: 4.4,
    ratingCount: 402,
    stockStatus: "in_stock",
    tags: ["action camera", "travel", "outdoor", "4k"],
    attributes: [
      {
        name: "Video",
        value: "4K 60 fps",
      },
      {
        name: "Waterproof",
        value: "10 m",
      },
      {
        name: "Battery",
        value: "1720 mAh",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_08_r1",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-09T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-09T09:00:00.000Z",
    updatedAt: "2026-09-09T09:00:00.000Z",
  },
  {
    id: "demo_09",
    title: "Nova Wireless Controller",
    slug: "nova-wireless-controller",
    shortDescription:
      "Low-latency wireless controller with hall-effect sticks for PC and console.",
    description:
      "Low-latency wireless controller with hall-effect sticks for PC and console. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Gaming",
    brand: "Vanta",
    imageUrl: "/demo-products/nova-wireless-controller.svg",
    gallery: ["/demo-products/nova-wireless-controller.svg"],
    price: 69,
    currency: "USD",
    ratingAverage: 4.5,
    ratingCount: 766,
    stockStatus: "in_stock",
    tags: ["gaming", "controller", "pc", "console"],
    attributes: [
      {
        name: "Connectivity",
        value: "2.4 GHz + Bluetooth",
      },
      {
        name: "Battery",
        value: "30 hours",
      },
      {
        name: "Sticks",
        value: "Hall effect",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_09_r1",
        authorName: "Lina K.",
        rating: 5,
        title: "Exactly what I needed",
        body: "Setup took two minutes and it feels premium in hand.",
        verifiedPurchase: true,
        createdAt: "2026-09-10T09:00:00.000Z",
      },
      {
        id: "demo_09_r2",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-10T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-10T09:00:00.000Z",
    updatedAt: "2026-09-10T09:00:00.000Z",
  },
  {
    id: "demo_10",
    title: "Vector Pro Gaming Mouse",
    slug: "vector-pro-gaming-mouse",
    shortDescription: "Ultralight 58 g wireless mouse with a 26K DPI sensor.",
    description:
      "Ultralight 58 g wireless mouse with a 26K DPI sensor. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Gaming",
    brand: "Vanta",
    imageUrl: "/demo-products/vector-pro-gaming-mouse.svg",
    gallery: ["/demo-products/vector-pro-gaming-mouse.svg"],
    price: 79,
    compareAtPrice: 99,
    currency: "USD",
    ratingAverage: 4.6,
    ratingCount: 854,
    stockStatus: "in_stock",
    tags: ["gaming", "mouse", "esports", "wireless"],
    attributes: [
      {
        name: "Weight",
        value: "58 g",
      },
      {
        name: "Sensor",
        value: "26,000 DPI",
      },
      {
        name: "Battery",
        value: "90 hours",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_10_r1",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-11T09:00:00.000Z",
      },
      {
        id: "demo_10_r2",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-11T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-11T09:00:00.000Z",
    updatedAt: "2026-09-11T09:00:00.000Z",
  },
  {
    id: "demo_11",
    title: "Keyforge Mechanical Keyboard",
    slug: "keyforge-mechanical-keyboard",
    shortDescription:
      "Hot-swappable 75% mechanical keyboard with gasket mount and RGB.",
    description:
      "Hot-swappable 75% mechanical keyboard with gasket mount and RGB. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Accessories",
    brand: "Keyforge",
    imageUrl: "/demo-products/keyforge-mechanical-keyboard.svg",
    gallery: ["/demo-products/keyforge-mechanical-keyboard.svg"],
    price: 139,
    compareAtPrice: 169,
    currency: "USD",
    ratingAverage: 4.7,
    ratingCount: 523,
    stockStatus: "in_stock",
    tags: ["keyboard", "mechanical", "gaming", "office"],
    attributes: [
      {
        name: "Layout",
        value: "75%",
      },
      {
        name: "Switches",
        value: "Hot-swappable linear",
      },
      {
        name: "Connectivity",
        value: "USB-C, 2.4 GHz, Bluetooth",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_11_r1",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-12T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-12T09:00:00.000Z",
    updatedAt: "2026-09-12T09:00:00.000Z",
  },
  {
    id: "demo_12",
    title: "Glow Arc Desk Lamp",
    slug: "glow-arc-desk-lamp",
    shortDescription: "Dimmable LED desk lamp with warm-to-cool colour control.",
    description:
      "Dimmable LED desk lamp with warm-to-cool colour control. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Home",
    brand: "Luma",
    imageUrl: "/demo-products/glow-arc-desk-lamp.svg",
    gallery: ["/demo-products/glow-arc-desk-lamp.svg"],
    price: 49,
    compareAtPrice: 65,
    currency: "USD",
    ratingAverage: 4.3,
    ratingCount: 289,
    stockStatus: "in_stock",
    tags: ["lamp", "desk", "home office", "lighting"],
    attributes: [
      {
        name: "Brightness",
        value: "800 lm",
      },
      {
        name: "Colour temperature",
        value: "2700 to 6500 K",
      },
      {
        name: "Power",
        value: "USB-C",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_12_r1",
        authorName: "Lina K.",
        rating: 5,
        title: "Exactly what I needed",
        body: "Setup took two minutes and it feels premium in hand.",
        verifiedPurchase: true,
        createdAt: "2026-09-13T09:00:00.000Z",
      },
      {
        id: "demo_12_r2",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-13T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-13T09:00:00.000Z",
    updatedAt: "2026-09-13T09:00:00.000Z",
  },
  {
    id: "demo_13",
    title: "Breeze Air Purifier",
    slug: "breeze-air-purifier",
    shortDescription:
      "Quiet HEPA purifier for rooms up to 40 m² with an air-quality sensor.",
    description:
      "Quiet HEPA purifier for rooms up to 40 m² with an air-quality sensor. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Home",
    brand: "Luma",
    imageUrl: "/demo-products/breeze-air-purifier.svg",
    gallery: ["/demo-products/breeze-air-purifier.svg"],
    price: 179,
    compareAtPrice: 219,
    currency: "USD",
    ratingAverage: 4.5,
    ratingCount: 341,
    stockStatus: "in_stock",
    tags: ["air purifier", "home", "allergy", "smart home"],
    attributes: [
      {
        name: "Room size",
        value: "Up to 40 m²",
      },
      {
        name: "Filter",
        value: "True HEPA H13",
      },
      {
        name: "Noise",
        value: "From 22 dB",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_13_r1",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-14T09:00:00.000Z",
      },
      {
        id: "demo_13_r2",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-14T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-14T09:00:00.000Z",
    updatedAt: "2026-09-14T09:00:00.000Z",
  },
  {
    id: "demo_14",
    title: 'Vistra 27" 4K Monitor',
    slug: "vistra-27-4k-monitor",
    shortDescription:
      "27-inch 4K IPS monitor with USB-C 90 W charging and factory calibration.",
    description:
      "27-inch 4K IPS monitor with USB-C 90 W charging and factory calibration. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Electronics",
    brand: "Vistra",
    imageUrl: "/demo-products/vistra-27-4k-monitor.svg",
    gallery: ["/demo-products/vistra-27-4k-monitor.svg"],
    price: 389,
    compareAtPrice: 449,
    currency: "USD",
    ratingAverage: 4.6,
    ratingCount: 267,
    stockStatus: "in_stock",
    tags: ["monitor", "4k", "creator", "office"],
    attributes: [
      {
        name: "Panel",
        value: '27" IPS 4K',
      },
      {
        name: "Refresh rate",
        value: "60 Hz",
      },
      {
        name: "Ports",
        value: "USB-C 90 W, HDMI, DP",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_14_r1",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-15T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-15T09:00:00.000Z",
    updatedAt: "2026-09-15T09:00:00.000Z",
  },
  {
    id: "demo_15",
    title: "Nimbus 14 Laptop",
    slug: "nimbus-14-laptop",
    shortDescription:
      "14-inch ultralight laptop with a 2.8K display and all-day battery.",
    description:
      "14-inch ultralight laptop with a 2.8K display and all-day battery. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Electronics",
    brand: "Nexa",
    imageUrl: "/demo-products/nimbus-14-laptop.svg",
    gallery: ["/demo-products/nimbus-14-laptop.svg"],
    price: 1099,
    compareAtPrice: 1249,
    currency: "USD",
    ratingAverage: 4.6,
    ratingCount: 198,
    stockStatus: "in_stock",
    tags: ["laptop", "work", "student", "travel"],
    attributes: [
      {
        name: "Display",
        value: '14" 2.8K OLED',
      },
      {
        name: "Memory",
        value: "16 GB",
      },
      {
        name: "Storage",
        value: "1 TB SSD",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_15_r1",
        authorName: "Lina K.",
        rating: 5,
        title: "Exactly what I needed",
        body: "Setup took two minutes and it feels premium in hand.",
        verifiedPurchase: true,
        createdAt: "2026-09-16T09:00:00.000Z",
      },
      {
        id: "demo_15_r2",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-16T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-16T09:00:00.000Z",
    updatedAt: "2026-09-16T09:00:00.000Z",
  },
  {
    id: "demo_16",
    title: "Slate 11 Tablet",
    slug: "slate-11-tablet",
    shortDescription:
      "11-inch tablet with a 120 Hz screen, stylus support and quad speakers.",
    description:
      "11-inch tablet with a 120 Hz screen, stylus support and quad speakers. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Electronics",
    brand: "Nexa",
    imageUrl: "/demo-products/slate-11-tablet.svg",
    gallery: ["/demo-products/slate-11-tablet.svg"],
    price: 449,
    compareAtPrice: 499,
    currency: "USD",
    ratingAverage: 4.4,
    ratingCount: 233,
    stockStatus: "in_stock",
    tags: ["tablet", "drawing", "study", "entertainment"],
    attributes: [
      {
        name: "Display",
        value: '11" 120 Hz',
      },
      {
        name: "Storage",
        value: "128 GB",
      },
      {
        name: "Battery",
        value: "12 hours",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_16_r1",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-17T09:00:00.000Z",
      },
      {
        id: "demo_16_r2",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-17T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-17T09:00:00.000Z",
    updatedAt: "2026-09-17T09:00:00.000Z",
  },
  {
    id: "demo_17",
    title: "Drift Travel Backpack",
    slug: "drift-travel-backpack",
    shortDescription: "Weatherproof 24 L backpack with a padded 16-inch laptop sleeve.",
    description:
      "Weatherproof 24 L backpack with a padded 16-inch laptop sleeve. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Accessories",
    brand: "Nomad",
    imageUrl: "/demo-products/drift-travel-backpack.svg",
    gallery: ["/demo-products/drift-travel-backpack.svg"],
    price: 99,
    compareAtPrice: 119,
    currency: "USD",
    ratingAverage: 4.5,
    ratingCount: 377,
    stockStatus: "in_stock",
    tags: ["backpack", "travel", "laptop", "commute"],
    attributes: [
      {
        name: "Capacity",
        value: "24 L",
      },
      {
        name: "Laptop sleeve",
        value: 'Up to 16"',
      },
      {
        name: "Material",
        value: "Recycled ripstop",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_17_r1",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-18T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-18T09:00:00.000Z",
    updatedAt: "2026-09-18T09:00:00.000Z",
  },
  {
    id: "demo_18",
    title: "Volt 20K Power Bank",
    slug: "volt-20k-power-bank",
    shortDescription: "20,000 mAh power bank with 65 W USB-C that can charge a laptop.",
    description:
      "20,000 mAh power bank with 65 W USB-C that can charge a laptop. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Accessories",
    brand: "Helio",
    imageUrl: "/demo-products/volt-20k-power-bank.svg",
    gallery: ["/demo-products/volt-20k-power-bank.svg"],
    price: 59,
    currency: "USD",
    ratingAverage: 4.4,
    ratingCount: 612,
    stockStatus: "in_stock",
    tags: ["power bank", "charging", "travel", "laptop"],
    attributes: [
      {
        name: "Capacity",
        value: "20,000 mAh",
      },
      {
        name: "Output",
        value: "65 W USB-C PD",
      },
      {
        name: "Ports",
        value: "2× USB-C, 1× USB-A",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_18_r1",
        authorName: "Lina K.",
        rating: 5,
        title: "Exactly what I needed",
        body: "Setup took two minutes and it feels premium in hand.",
        verifiedPurchase: true,
        createdAt: "2026-09-19T09:00:00.000Z",
      },
      {
        id: "demo_18_r2",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-19T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-19T09:00:00.000Z",
    updatedAt: "2026-09-19T09:00:00.000Z",
  },
  {
    id: "demo_19",
    title: "Orbit 7-in-1 USB-C Hub",
    slug: "orbit-usb-c-hub",
    shortDescription:
      "Aluminium hub with 4K HDMI, 100 W pass-through, SD and USB ports.",
    description:
      "Aluminium hub with 4K HDMI, 100 W pass-through, SD and USB ports. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Office",
    brand: "Orbit",
    imageUrl: "/demo-products/orbit-usb-c-hub.svg",
    gallery: ["/demo-products/orbit-usb-c-hub.svg"],
    price: 45,
    compareAtPrice: 59,
    currency: "USD",
    ratingAverage: 4.3,
    ratingCount: 455,
    stockStatus: "in_stock",
    tags: ["hub", "usb-c", "office", "laptop"],
    attributes: [
      {
        name: "Ports",
        value: "7",
      },
      {
        name: "HDMI",
        value: "4K 60 Hz",
      },
      {
        name: "Pass-through",
        value: "100 W",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_19_r1",
        authorName: "Omar S.",
        rating: 4,
        title: "Great value",
        body: "Does everything I expected for the price. Battery life is solid.",
        verifiedPurchase: true,
        createdAt: "2026-09-20T09:00:00.000Z",
      },
      {
        id: "demo_19_r2",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-20T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-20T09:00:00.000Z",
    updatedAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "demo_20",
    title: "Apex 6 Smartphone",
    slug: "apex-6-smartphone",
    shortDescription: "6.3-inch smartphone with a 50 MP camera and 2-day battery.",
    description:
      "6.3-inch smartphone with a 50 MP camera and 2-day battery. Part of the Giant Store demo catalog, so you can try search, filters, comparison, the cart and the AI assistant right away.",
    category: "Electronics",
    brand: "Apex",
    imageUrl: "/demo-products/apex-6-smartphone.svg",
    gallery: ["/demo-products/apex-6-smartphone.svg"],
    price: 699,
    compareAtPrice: 799,
    currency: "USD",
    ratingAverage: 4.5,
    ratingCount: 289,
    stockStatus: "low_stock",
    tags: ["smartphone", "camera", "5g", "android"],
    attributes: [
      {
        name: "Display",
        value: '6.3" 120 Hz OLED',
      },
      {
        name: "Camera",
        value: "50 MP main",
      },
      {
        name: "Battery",
        value: "4,800 mAh",
      },
    ],
    variants: [],
    reviews: [
      {
        id: "demo_20_r1",
        authorName: "Maya R.",
        rating: 5,
        title: "Would buy again",
        body: "Quality is better than I thought from the photos.",
        verifiedPurchase: true,
        createdAt: "2026-09-21T09:00:00.000Z",
      },
    ],
    faqs: [
      {
        question: "Is this a real product?",
        answer:
          "No. It is a demo product so you can try the store; checkout does not charge anything.",
      },
    ],
    relatedProductSlugs: [],
    createdAt: "2026-09-21T09:00:00.000Z",
    updatedAt: "2026-09-21T09:00:00.000Z",
  },
];
