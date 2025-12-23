import dotenv from "dotenv";
import connectDB from "../config/db";
import { ProductModel } from "../modules/product/product.model";

dotenv.config();

const sampleProducts = [
  // Hoodies
  {
    name: "Classic Pullover Hoodie",
    description: "Comfortable cotton blend hoodie perfect for everyday wear. Features a kangaroo pocket and adjustable drawstring hood.",
    price: 45.99,
    compareAtPrice: 59.99,
    category: "hoodies",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633",
    ],
    variants: [
      { size: "S", color: "Black", stock: 15, sku: "HOD-CLS-S-BLK" },
      { size: "M", color: "Black", stock: 20, sku: "HOD-CLS-M-BLK" },
      { size: "L", color: "Black", stock: 18, sku: "HOD-CLS-L-BLK" },
      { size: "XL", color: "Black", stock: 12, sku: "HOD-CLS-XL-BLK" },
      { size: "S", color: "Gray", stock: 10, sku: "HOD-CLS-S-GRY" },
      { size: "M", color: "Gray", stock: 15, sku: "HOD-CLS-M-GRY" },
      { size: "L", color: "Gray", stock: 12, sku: "HOD-CLS-L-GRY" },
      { size: "XL", color: "Gray", stock: 8, sku: "HOD-CLS-XL-GRY" },
    ],
    rating: { average: 4.5, count: 87 },
  },
  {
    name: "Premium Zip-Up Hoodie",
    description: "High-quality zip-up hoodie with fleece lining. Perfect for layering in cooler weather.",
    price: 65.99,
    compareAtPrice: 85.99,
    category: "hoodies",
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2",
    ],
    variants: [
      { size: "S", color: "Navy", stock: 8, sku: "HOD-ZIP-S-NAV" },
      { size: "M", color: "Navy", stock: 12, sku: "HOD-ZIP-M-NAV" },
      { size: "L", color: "Navy", stock: 10, sku: "HOD-ZIP-L-NAV" },
      { size: "S", color: "Burgundy", stock: 6, sku: "HOD-ZIP-S-BUR" },
      { size: "M", color: "Burgundy", stock: 8, sku: "HOD-ZIP-M-BUR" },
      { size: "L", color: "Burgundy", stock: 5, sku: "HOD-ZIP-L-BUR" },
    ],
    rating: { average: 4.8, count: 52 },
  },
  {
    name: "Oversized Hoodie",
    description: "Trendy oversized fit hoodie. Made from premium heavyweight cotton for ultimate comfort.",
    price: 55.99,
    category: "hoodies",
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
    ],
    variants: [
      { size: "M", color: "White", stock: 0, sku: "HOD-OVR-M-WHT" },
      { size: "L", color: "White", stock: 0, sku: "HOD-OVR-L-WHT" },
      { size: "XL", color: "White", stock: 0, sku: "HOD-OVR-XL-WHT" },
      { size: "M", color: "Beige", stock: 14, sku: "HOD-OVR-M-BEG" },
      { size: "L", color: "Beige", stock: 18, sku: "HOD-OVR-L-BEG" },
      { size: "XL", color: "Beige", stock: 10, sku: "HOD-OVR-XL-BEG" },
    ],
    rating: { average: 4.6, count: 134 },
  },

  // Sweaters
  {
    name: "Cable Knit Sweater",
    description: "Classic cable knit design in soft wool blend. Perfect for formal and casual occasions.",
    price: 75.99,
    compareAtPrice: 95.99,
    category: "sweaters",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    ],
    variants: [
      { size: "S", color: "Cream", stock: 12, sku: "SWT-CBL-S-CRM" },
      { size: "M", color: "Cream", stock: 16, sku: "SWT-CBL-M-CRM" },
      { size: "L", color: "Cream", stock: 14, sku: "SWT-CBL-L-CRM" },
      { size: "S", color: "Navy", stock: 10, sku: "SWT-CBL-S-NAV" },
      { size: "M", color: "Navy", stock: 15, sku: "SWT-CBL-M-NAV" },
      { size: "L", color: "Navy", stock: 12, sku: "SWT-CBL-L-NAV" },
    ],
    rating: { average: 4.7, count: 63 },
  },
  {
    name: "V-Neck Cashmere Sweater",
    description: "Luxurious cashmere sweater with elegant V-neck design. Ultra-soft and breathable.",
    price: 125.99,
    compareAtPrice: 159.99,
    category: "sweaters",
    images: [
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77",
    ],
    variants: [
      { size: "S", color: "Black", stock: 8, sku: "SWT-CSH-S-BLK" },
      { size: "M", color: "Black", stock: 10, sku: "SWT-CSH-M-BLK" },
      { size: "L", color: "Black", stock: 7, sku: "SWT-CSH-L-BLK" },
      { size: "S", color: "Charcoal", stock: 6, sku: "SWT-CSH-S-CHR" },
      { size: "M", color: "Charcoal", stock: 9, sku: "SWT-CSH-M-CHR" },
    ],
    rating: { average: 4.9, count: 41 },
  },
  {
    name: "Turtleneck Sweater",
    description: "Modern turtleneck sweater in premium merino wool. Slim fit design for a sleek look.",
    price: 68.99,
    category: "sweaters",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
    ],
    variants: [
      { size: "S", color: "Burgundy", stock: 11, sku: "SWT-TRT-S-BUR" },
      { size: "M", color: "Burgundy", stock: 15, sku: "SWT-TRT-M-BUR" },
      { size: "L", color: "Burgundy", stock: 13, sku: "SWT-TRT-L-BUR" },
      { size: "S", color: "Forest Green", stock: 9, sku: "SWT-TRT-S-GRN" },
      { size: "M", color: "Forest Green", stock: 12, sku: "SWT-TRT-M-GRN" },
    ],
    rating: { average: 4.4, count: 78 },
  },

  // Jackets
  {
    name: "Denim Jacket",
    description: "Classic denim jacket with vintage wash. Features button closure and multiple pockets.",
    price: 89.99,
    compareAtPrice: 119.99,
    category: "jackets",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    ],
    variants: [
      { size: "S", color: "Light Blue", stock: 14, sku: "JKT-DNM-S-LBL" },
      { size: "M", color: "Light Blue", stock: 18, sku: "JKT-DNM-M-LBL" },
      { size: "L", color: "Light Blue", stock: 16, sku: "JKT-DNM-L-LBL" },
      { size: "XL", color: "Light Blue", stock: 12, sku: "JKT-DNM-XL-LBL" },
      { size: "S", color: "Dark Blue", stock: 10, sku: "JKT-DNM-S-DBL" },
      { size: "M", color: "Dark Blue", stock: 14, sku: "JKT-DNM-M-DBL" },
      { size: "L", color: "Dark Blue", stock: 12, sku: "JKT-DNM-L-DBL" },
    ],
    rating: { average: 4.6, count: 92 },
  },
  {
    name: "Leather Bomber Jacket",
    description: "Premium leather bomber jacket with quilted lining. Timeless style for any wardrobe.",
    price: 195.99,
    compareAtPrice: 249.99,
    category: "jackets",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
    ],
    variants: [
      { size: "S", color: "Black", stock: 5, sku: "JKT-LTR-S-BLK" },
      { size: "M", color: "Black", stock: 8, sku: "JKT-LTR-M-BLK" },
      { size: "L", color: "Black", stock: 6, sku: "JKT-LTR-L-BLK" },
      { size: "S", color: "Brown", stock: 4, sku: "JKT-LTR-S-BRN" },
      { size: "M", color: "Brown", stock: 7, sku: "JKT-LTR-M-BRN" },
      { size: "L", color: "Brown", stock: 5, sku: "JKT-LTR-L-BRN" },
    ],
    rating: { average: 4.8, count: 35 },
  },
  {
    name: "Windbreaker Jacket",
    description: "Lightweight windbreaker jacket. Water-resistant and perfect for outdoor activities.",
    price: 52.99,
    category: "jackets",
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
    ],
    variants: [
      { size: "M", color: "Neon Yellow", stock: 20, sku: "JKT-WND-M-NYL" },
      { size: "L", color: "Neon Yellow", stock: 18, sku: "JKT-WND-L-NYL" },
      { size: "XL", color: "Neon Yellow", stock: 15, sku: "JKT-WND-XL-NYL" },
      { size: "M", color: "Royal Blue", stock: 16, sku: "JKT-WND-M-RBL" },
      { size: "L", color: "Royal Blue", stock: 14, sku: "JKT-WND-L-RBL" },
    ],
    rating: { average: 4.3, count: 108 },
  },

  // Pants
  {
    name: "Slim Fit Chinos",
    description: "Modern slim fit chinos in premium cotton twill. Versatile for work or casual wear.",
    price: 58.99,
    compareAtPrice: 75.99,
    category: "pants",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a",
    ],
    variants: [
      { size: "30", color: "Khaki", stock: 16, sku: "PNT-CHN-30-KHK" },
      { size: "32", color: "Khaki", stock: 22, sku: "PNT-CHN-32-KHK" },
      { size: "34", color: "Khaki", stock: 20, sku: "PNT-CHN-34-KHK" },
      { size: "36", color: "Khaki", stock: 14, sku: "PNT-CHN-36-KHK" },
      { size: "30", color: "Navy", stock: 14, sku: "PNT-CHN-30-NAV" },
      { size: "32", color: "Navy", stock: 18, sku: "PNT-CHN-32-NAV" },
      { size: "34", color: "Navy", stock: 16, sku: "PNT-CHN-34-NAV" },
    ],
    rating: { average: 4.5, count: 145 },
  },
  {
    name: "Cargo Pants",
    description: "Functional cargo pants with multiple pockets. Durable fabric with relaxed fit.",
    price: 64.99,
    category: "pants",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80",
    ],
    variants: [
      { size: "30", color: "Olive Green", stock: 12, sku: "PNT-CRG-30-OLV" },
      { size: "32", color: "Olive Green", stock: 16, sku: "PNT-CRG-32-OLV" },
      { size: "34", color: "Olive Green", stock: 14, sku: "PNT-CRG-34-OLV" },
      { size: "30", color: "Black", stock: 10, sku: "PNT-CRG-30-BLK" },
      { size: "32", color: "Black", stock: 15, sku: "PNT-CRG-32-BLK" },
      { size: "34", color: "Black", stock: 13, sku: "PNT-CRG-34-BLK" },
    ],
    rating: { average: 4.4, count: 87 },
  },
  {
    name: "Jogger Pants",
    description: "Comfortable jogger pants with elastic waistband and ankle cuffs. Perfect for athleisure.",
    price: 45.99,
    category: "pants",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    ],
    variants: [
      { size: "S", color: "Gray", stock: 0, sku: "PNT-JOG-S-GRY" },
      { size: "M", color: "Gray", stock: 0, sku: "PNT-JOG-M-GRY" },
      { size: "L", color: "Gray", stock: 0, sku: "PNT-JOG-L-GRY" },
      { size: "S", color: "Black", stock: 18, sku: "PNT-JOG-S-BLK" },
      { size: "M", color: "Black", stock: 24, sku: "PNT-JOG-M-BLK" },
      { size: "L", color: "Black", stock: 20, sku: "PNT-JOG-L-BLK" },
    ],
    rating: { average: 4.6, count: 203 },
  },
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await ProductModel.deleteMany({});
    console.log("Cleared existing products");

    // Insert new products
    const products = await ProductModel.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${products.length} products`);
    
    // Display summary
    console.log("\n📊 Products Summary:");
    console.log(`   Hoodies: ${products.filter(p => p.category === "hoodies").length}`);
    console.log(`   Sweaters: ${products.filter(p => p.category === "sweaters").length}`);
    console.log(`   Jackets: ${products.filter(p => p.category === "jackets").length}`);
    console.log(`   Pants: ${products.filter(p => p.category === "pants").length}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
