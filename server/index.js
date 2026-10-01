import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'newmarket_campus_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// In-Memory Database Store (Mirroring Prisma DBML Schema with Campus Marketplace Data)
let users = [
  {
    id: 'user-buyer-1',
    fullName: 'Tobi Adebayo',
    email: 'tobi@student.edu.ng',
    passwordHash: '$2a$10$e8WpG9X6bQ8g7H8K6T5Ue.3B0Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z',
    role: 'BUYER',
    campus: 'Obafemi Awolowo University (OAU)',
    hostel: 'Fajuyi Hall, Block 3, Room 14',
    createdAt: new Date(),
  },
  {
    id: 'user-vendor-1',
    fullName: 'Amina Bello (400L Food Sci)',
    email: 'amina@sweettooth.ng',
    passwordHash: '$2a$10$e8WpG9X6bQ8g7H8K6T5Ue.3B0Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z',
    role: 'VENDOR',
    campus: 'Obafemi Awolowo University (OAU)',
    storeId: 'store-1',
    createdAt: new Date(),
  },
  {
    id: 'user-vendor-2',
    fullName: 'David Okafor (300L Elect/Elect)',
    email: 'david@techplug.ng',
    passwordHash: '$2a$10$e8WpG9X6bQ8g7H8K6T5Ue.3B0Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z1Z',
    role: 'VENDOR',
    campus: 'Obafemi Awolowo University (OAU)',
    storeId: 'store-2',
    createdAt: new Date(),
  }
];

let stores = [
  {
    id: 'store-1',
    vendorId: 'user-vendor-1',
    vendorName: 'Amina Bello',
    storeName: 'Sweet Tooth Bakes',
    slug: 'sweet-tooth-bakes',
    tagline: 'Fresh hostel-baked pastries, cupcakes, cinnamon rolls & crunchy chinchin.',
    description: 'Hostel-based bakery preparing fresh oven treats daily. Verified campus baker with 100% hostel doorstep delivery.',
    category: 'pastry',
    avatar: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1000&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 142,
    deliveryTime: '15-25 mins',
    location: 'Moremi Hall, Block B',
    verified: true,
    badge: 'Campus Verified Vendor 🛡️',
    whatsApp: '+2348012345678',
    createdAt: new Date(),
  },
  {
    id: 'store-2',
    vendorId: 'user-vendor-2',
    vendorName: 'David Okafor',
    storeName: 'Campus Tech Plug',
    slug: 'campus-tech-plug',
    tagline: 'Fast chargers, ANC pods, OTG flash drives & laptop accessories.',
    description: 'Trusted campus gadget hub. All accessories tested, authentic and backed by a 7-day student swap guarantee.',
    category: 'tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1000&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 98,
    deliveryTime: '10-20 mins',
    location: 'Faculty of Tech, SUB Shop 4',
    verified: true,
    badge: 'Student Tech Plug ⚡',
    whatsApp: '+2348087654321',
    createdAt: new Date(),
  },
  {
    id: 'store-3',
    vendorId: 'user-vendor-3',
    vendorName: 'Chiamaka Nwosu',
    storeName: 'Campus Drip & Wear',
    slug: 'campus-drip-wear',
    tagline: 'Custom faculty hoodies, aesthetic tote bags & curated campus thrift.',
    description: 'Original campus streetwear, oversized tees, and cozy faculty hoodies made from premium heavyweight cotton.',
    category: 'fashion',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 210,
    deliveryTime: 'Same Day Pickup',
    location: 'SUB Complex, Floor 1',
    verified: true,
    badge: 'Top Fashion Vendor ✨',
    whatsApp: '+2348055554444',
    createdAt: new Date(),
  },
  {
    id: 'store-4',
    vendorId: 'user-vendor-4',
    vendorName: 'Kemi & Tobi',
    storeName: 'Hostel Glam & Skincare',
    slug: 'hostel-glam-skincare',
    tagline: 'Pocket sunscreens, lip glosses, press-on nails & roll-on fragrance oils.',
    description: 'Dorm-friendly skincare and everyday student beauty essentials curated for busy lecture schedules.',
    category: 'beauty',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewsCount: 84,
    deliveryTime: '20-30 mins',
    location: 'Akintola Hall, Wing C',
    verified: true,
    badge: 'Dorm Favorite 💖',
    whatsApp: '+2348033332222',
    createdAt: new Date(),
  },
];

let products = [
  {
    id: 'prod-1',
    storeId: 'store-1',
    storeName: 'Sweet Tooth Bakes',
    name: 'Red Velvet Gourmet Cupcakes (6-Pack)',
    description: 'Moist red velvet cupcakes topped with cream cheese frosting and gold sprinkles.',
    price: 4500,
    originalPrice: 5500,
    stockQuantity: 16,
    category: 'pastry',
    imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f930f2?w=600&auto=format&fit=crop&q=80',
    isBestseller: true,
    rating: 5.0,
    reviews: 46,
    badge: 'Fresh Today 🔥',
    createdAt: new Date(),
  },
  {
    id: 'prod-2',
    storeId: 'store-1',
    storeName: 'Sweet Tooth Bakes',
    name: 'Crunchy Milky ChinChin (500g Tub)',
    description: 'Golden, extra-milky crispy chinchin. Perfect companion for late-night study sessions.',
    price: 2500,
    originalPrice: 3000,
    stockQuantity: 40,
    category: 'pastry',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.8,
    reviews: 32,
    badge: 'Study Fuel ⚡',
    createdAt: new Date(),
  },
  {
    id: 'prod-3',
    storeId: 'store-2',
    storeName: 'Campus Tech Plug',
    name: 'ANC Noise-Canceling Wireless Earbuds',
    description: 'Active Noise Cancellation with 30-hour battery life. Ideal for library focus and noisy hostels.',
    price: 18500,
    originalPrice: 22000,
    stockQuantity: 12,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    isBestseller: true,
    rating: 4.9,
    reviews: 89,
    badge: 'Popular Plug ⚡',
    createdAt: new Date(),
  },
  {
    id: 'prod-4',
    storeId: 'store-2',
    storeName: 'Campus Tech Plug',
    name: '20,000mAh Dual Fast-Charge Power Bank',
    description: 'Heavy-duty 22.5W fast-charging power bank with LED percentage display and dual Type-C.',
    price: 24000,
    originalPrice: 28000,
    stockQuantity: 9,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1609592424074-b529735d4546?w=600&auto=format&fit=crop&q=80',
    isBestseller: true,
    rating: 4.9,
    reviews: 73,
    badge: 'Exam Essential 🔋',
    createdAt: new Date(),
  },
  {
    id: 'prod-5',
    storeId: 'store-3',
    storeName: 'Campus Drip & Wear',
    name: 'Heavyweight Campus Varsity Hoodie',
    description: '450GSM cozy cotton fleece with embroidered campus patch. Soft, warm interior.',
    price: 19500,
    originalPrice: 23000,
    stockQuantity: 14,
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    isBestseller: true,
    rating: 5.0,
    reviews: 118,
    badge: 'Best Drip ✨',
    createdAt: new Date(),
  },
  {
    id: 'prod-6',
    storeId: 'store-3',
    storeName: 'Campus Drip & Wear',
    name: 'Aesthetic Canvas Lecture Tote Bag',
    description: 'Reinforced canvas book bag with inner zipper pocket, fits standard 14-inch laptops and notebooks.',
    price: 6500,
    originalPrice: 8000,
    stockQuantity: 28,
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.7,
    reviews: 52,
    badge: 'Campus Classic 🎒',
    createdAt: new Date(),
  },
  {
    id: 'prod-7',
    storeId: 'store-4',
    storeName: 'Hostel Glam & Skincare',
    name: 'Hydrating Sunscreen Stick SPF50+',
    description: 'Zero white-cast, non-greasy sunscreen stick for rapid reapplying under Nigerian sunshine.',
    price: 9500,
    originalPrice: 11000,
    stockQuantity: 22,
    category: 'beauty',
    imageUrl: 'https://images.unsplash.com/photo-1608248597261-833258657b45?w=600&auto=format&fit=crop&q=80',
    isBestseller: true,
    rating: 4.8,
    reviews: 61,
    badge: 'Hot Pick ☀️',
    createdAt: new Date(),
  },
  {
    id: 'prod-8',
    storeId: 'store-4',
    storeName: 'Hostel Glam & Skincare',
    name: 'Roll-On Pocket Fragrance Oil (Set of 3)',
    description: 'Concentrated perfume oil pack (Vanilla Amber, Fresh Linen, Sweet Citrus). Long lasting 24-hour scent.',
    price: 7500,
    originalPrice: 9000,
    stockQuantity: 15,
    category: 'beauty',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.9,
    reviews: 44,
    badge: 'Dorm Gem 🌸',
    createdAt: new Date(),
  },
  {
    id: 'prod-9',
    storeId: 'store-1',
    storeName: 'Sweet Tooth Bakes',
    name: 'Cinnamon Rolls (Box of 4)',
    description: 'Fluffy, glazed cinnamon rolls with cream cheese icing. Perfect for breakfast or late-night snacking.',
    price: 3500,
    originalPrice: 4200,
    stockQuantity: 20,
    category: 'pastry',
    imageUrl: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.8,
    reviews: 28,
    badge: 'Warm & Fresh 🍥',
    createdAt: new Date(),
  },
  {
    id: 'prod-10',
    storeId: 'store-1',
    storeName: 'Sweet Tooth Bakes',
    name: 'Banana Bread Loaf (Whole)',
    description: 'Moist banana bread with walnuts and a hint of vanilla. Homemade in the hostel kitchen.',
    price: 3000,
    originalPrice: 3800,
    stockQuantity: 12,
    category: 'pastry',
    imageUrl: 'https://images.unsplash.com/photo-1605090930601-03c155cfa11b?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.7,
    reviews: 19,
    badge: 'Homemade 🏠',
    createdAt: new Date(),
  },
  {
    id: 'prod-11',
    storeId: 'store-2',
    storeName: 'Campus Tech Plug',
    name: 'USB-C Hub 7-in-1 Adapter',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, SD card reader. Perfect for lecture hall presentations.',
    price: 15000,
    originalPrice: 19000,
    stockQuantity: 8,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.6,
    reviews: 34,
    badge: 'Study Tool 🔧',
    createdAt: new Date(),
  },
  {
    id: 'prod-12',
    storeId: 'store-2',
    storeName: 'Campus Tech Plug',
    name: 'LED Desk Lamp with USB Charging',
    description: 'Adjustable LED desk lamp with 3 brightness levels and built-in USB port for phone charging.',
    price: 8500,
    originalPrice: 11000,
    stockQuantity: 15,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&auto=format&fit=crop&q=80',
    isBestseller: true,
    rating: 4.8,
    reviews: 56,
    badge: 'Night Owl 🦉',
    createdAt: new Date(),
  },
  {
    id: 'prod-13',
    storeId: 'store-3',
    storeName: 'Campus Drip & Wear',
    name: 'Oversized Graphic Tee — "Campus Life"',
    description: 'Premium 300GSM cotton tee with exclusive campus-themed graphic print. Unisex fit.',
    price: 8500,
    originalPrice: 10000,
    stockQuantity: 30,
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format&fit=crop&q=80',
    isBestseller: true,
    rating: 4.9,
    reviews: 87,
    badge: 'Trending 🔥',
    createdAt: new Date(),
  },
  {
    id: 'prod-14',
    storeId: 'store-3',
    storeName: 'Campus Drip & Wear',
    name: 'Corduroy Bucket Hat',
    description: 'Trendy corduroy bucket hat. Available in beige, forest green, and navy. One size fits most.',
    price: 4500,
    originalPrice: 5500,
    stockQuantity: 25,
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.7,
    reviews: 41,
    badge: 'Style Pick 🎩',
    createdAt: new Date(),
  },
  {
    id: 'prod-15',
    storeId: 'store-4',
    storeName: 'Hostel Glam & Skincare',
    name: 'Vitamin C Brightening Serum (30ml)',
    description: 'Lightweight vitamin C serum for dark spots and uneven skin tone. Dermatologist-tested formula.',
    price: 12000,
    originalPrice: 15000,
    stockQuantity: 18,
    category: 'beauty',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    isBestseller: true,
    rating: 4.9,
    reviews: 72,
    badge: 'Glow Up ✨',
    createdAt: new Date(),
  },
  {
    id: 'prod-16',
    storeId: 'store-4',
    storeName: 'Hostel Glam & Skincare',
    name: 'Press-On Nails Set (24 pieces)',
    description: 'Salon-quality press-on nails in assorted designs. Includes nail glue and mini file.',
    price: 5500,
    originalPrice: 7000,
    stockQuantity: 35,
    category: 'beauty',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.6,
    reviews: 38,
    badge: 'Glam Ready 💅',
    createdAt: new Date(),
  },
  {
    id: 'prod-17',
    storeId: 'store-1',
    storeName: 'Sweet Tooth Bakes',
    name: 'Chocolate Chip Cookies (12-Pack)',
    description: 'Chewy double chocolate chip cookies. Made with Belgian cocoa and real butter.',
    price: 3200,
    originalPrice: 4000,
    stockQuantity: 25,
    category: 'pastry',
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80',
    isBestseller: true,
    rating: 4.9,
    reviews: 65,
    badge: 'Fan Favorite 🍪',
    createdAt: new Date(),
  },
  {
    id: 'prod-18',
    storeId: 'store-2',
    storeName: 'Campus Tech Plug',
    name: 'Laptop Stand — Adjustable Aluminum',
    description: 'Ergonomic aluminum laptop stand with adjustable height. Fits 10-17 inch laptops.',
    price: 12000,
    originalPrice: 16000,
    stockQuantity: 10,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.8,
    reviews: 29,
    badge: 'Posture Fix 💻',
    createdAt: new Date(),
  },
  {
    id: 'prod-19',
    storeId: 'store-3',
    storeName: 'Campus Drip & Wear',
    name: 'Minimalist Leather Wristwatch',
    description: 'Sleek Japanese quartz movement watch with genuine leather strap. Water-resistant 3ATM.',
    price: 14000,
    originalPrice: 18000,
    stockQuantity: 8,
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.8,
    reviews: 33,
    badge: 'Classic Piece ⌚',
    createdAt: new Date(),
  },
  {
    id: 'prod-20',
    storeId: 'store-4',
    storeName: 'Hostel Glam & Skincare',
    name: 'Lip Gloss Trio — Nude Collection',
    description: 'Set of 3 high-shine lip glosses in nude shades. Non-sticky, moisturizing formula.',
    price: 4800,
    originalPrice: 6000,
    stockQuantity: 20,
    category: 'beauty',
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.7,
    reviews: 55,
    badge: 'Must Have 💋',
    createdAt: new Date(),
  },
  {
    id: 'prod-21',
    storeId: 'store-2',
    storeName: 'Campus Tech Plug',
    name: 'Wireless Keyboard & Mouse Combo',
    description: 'Slim 2.4GHz wireless keyboard and mouse set. Silent keys, long battery life. Great for dorms.',
    price: 11500,
    originalPrice: 14000,
    stockQuantity: 12,
    category: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.7,
    reviews: 42,
    badge: 'Dorm Setup 🖥️',
    createdAt: new Date(),
  },
  {
    id: 'prod-22',
    storeId: 'store-1',
    storeName: 'Sweet Tooth Bakes',
    name: 'Mini Meat Pie (10-Pack)',
    description: 'Crispy golden crust filled with seasoned minced meat and vegetables. Perfect for sharing.',
    price: 5000,
    originalPrice: 6500,
    stockQuantity: 18,
    category: 'pastry',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.8,
    reviews: 37,
    badge: 'Party Pack 🥧',
    createdAt: new Date(),
  },
  {
    id: 'prod-23',
    storeId: 'store-3',
    storeName: 'Campus Drip & Wear',
    name: 'Cargo Jogger Pants — Olive Green',
    description: 'Relaxed fit cargo joggers with side pockets. Elastic waistband and ankle cuffs.',
    price: 11000,
    originalPrice: 13500,
    stockQuantity: 16,
    category: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.6,
    reviews: 26,
    badge: 'Streetwear 🛹',
    createdAt: new Date(),
  },
  {
    id: 'prod-24',
    storeId: 'store-4',
    storeName: 'Hostel Glam & Skincare',
    name: 'Facial Cleansing Brush — Silicone',
    description: 'Gentle silicone cleansing pad for deep pore cleaning. Waterproof and travel-friendly.',
    price: 3500,
    originalPrice: 4500,
    stockQuantity: 30,
    category: 'beauty',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop&q=80',
    isBestseller: false,
    rating: 4.5,
    reviews: 21,
    badge: 'Clean Skin 🧼',
    createdAt: new Date(),
  },
];

let orders = [
  {
    id: 'ORD-8421',
    buyerId: 'user-buyer-1',
    buyerName: 'Tobi Adebayo',
    buyerEmail: 'tobi@student.edu.ng',
    buyerHostel: 'Fajuyi Hall, Block 3, Room 14 (OAU)',
    campus: 'Obafemi Awolowo University (OAU)',
    totalAmount: 23000,
    paymentStatus: 'ESCROW_PAID',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    items: [
      {
        id: 'item-8421-1',
        orderId: 'ORD-8421',
        storeId: 'store-1',
        storeName: 'Sweet Tooth Bakes',
        productId: 'prod-1',
        productName: 'Red Velvet Gourmet Cupcakes (6-Pack)',
        quantity: 1,
        unitPrice: 4500,
        status: 'PROCESSING', // ESCROW_PAID -> PROCESSING -> READY_FOR_PICKUP -> DELIVERED
      },
      {
        id: 'item-8421-2',
        orderId: 'ORD-8421',
        storeId: 'store-2',
        storeName: 'Campus Tech Plug',
        productId: 'prod-3',
        productName: 'ANC Noise-Canceling Wireless Earbuds',
        quantity: 1,
        unitPrice: 18500,
        status: 'READY_FOR_PICKUP',
      }
    ]
  }
];

let orderItems = [];
orders.forEach(o => {
  o.items.forEach(it => orderItems.push(it));
});

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = users[0];
    return next();
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- API ENDPOINTS ---

// 1. Auth: Register
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, role, campus } = req.body;
    const existing = users.find((u) => u.email === email);
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password || 'password123', 10);
    const newUser = {
      id: `user-${Date.now()}`,
      fullName,
      email,
      passwordHash,
      role: role || 'BUYER',
      campus: campus || 'Obafemi Awolowo University (OAU)',
      createdAt: new Date(),
    };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role, campus: newUser.campus } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Auth: Login
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    const user = users.find((u) => u.email === email) || users[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, campus: user.campus } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Stores: Get all active storefronts
app.get('/api/v1/stores', (req, res) => {
  res.json(stores);
});

// 4. Stores: Create new student storefront
app.post('/api/v1/stores', authenticateToken, (req, res) => {
  const { storeName, description, tagline, category, location, whatsApp, banner, avatar } = req.body;
  const newStore = {
    id: `store-${Date.now()}`,
    vendorId: req.user.id,
    vendorName: req.user.fullName || 'Student Vendor',
    storeName,
    slug: storeName.toLowerCase().replace(/\s+/g, '-'),
    tagline: tagline || 'Quality student goods delivered right to your hostel!',
    description: description || 'Verified student-run business.',
    category: category || 'pastry',
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    banner: banner || 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1000&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 1,
    deliveryTime: '15-25 mins',
    location: location || 'Campus SUB Block',
    verified: true,
    badge: 'Campus Verified Vendor 🛡️',
    whatsApp: whatsApp || '+2348000000000',
    createdAt: new Date(),
  };
  stores.unshift(newStore);
  res.status(201).json(newStore);
});

// 5. Products: Get catalog
app.get('/api/v1/products', (req, res) => {
  const { store_id, category, search } = req.query;
  let result = products;
  if (store_id) result = result.filter((p) => p.storeId === store_id);
  if (category && category !== 'all') result = result.filter((p) => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q));
  }
  res.json(result);
});

// 6. Products: Add product
app.post('/api/v1/products', authenticateToken, (req, res) => {
  const { storeId, storeName, name, description, price, originalPrice, stockQuantity, imageUrl, category, badge } = req.body;
  const newProduct = {
    id: `prod-${Date.now()}`,
    storeId: storeId || stores[0].id,
    storeName: storeName || stores[0].storeName,
    name,
    description: description || '',
    price: parseFloat(price),
    originalPrice: originalPrice ? parseFloat(originalPrice) : null,
    stockQuantity: parseInt(stockQuantity, 10) || 10,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    category: category || 'pastry',
    isBestseller: false,
    rating: 5.0,
    reviews: 1,
    badge: badge || 'New Arrival ✨',
    createdAt: new Date(),
  };
  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// 7. Orders: Multi-Vendor Order Splitting Checkout
app.post('/api/v1/orders/checkout', authenticateToken, (req, res) => {
  const { cartItems, totalAmount, buyerHostel, buyerName, buyerEmail, campus } = req.body;
  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const parentOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Create split items for each vendor
  const splitItems = cartItems.map((item, idx) => {
    const orderItem = {
      id: `item-${Date.now()}-${idx}`,
      orderId: parentOrderId,
      storeId: item.storeId,
      storeName: item.storeName || 'Campus Store',
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      status: 'ESCROW_PAID', // Escrow protected: funds held safely until delivery
    };
    orderItems.unshift(orderItem);
    return orderItem;
  });

  const parentOrder = {
    id: parentOrderId,
    buyerId: req.user?.id || 'user-buyer-1',
    buyerName: buyerName || req.user?.fullName || 'Tobi Adebayo',
    buyerEmail: buyerEmail || req.user?.email || 'tobi@student.edu.ng',
    buyerHostel: buyerHostel || 'Fajuyi Hall, Block 3, Room 14',
    campus: campus || 'Obafemi Awolowo University (OAU)',
    totalAmount: parseFloat(totalAmount),
    paymentStatus: 'ESCROW_PAID',
    createdAt: new Date().toISOString(),
    items: splitItems,
  };

  orders.unshift(parentOrder);

  res.status(201).json({
    message: 'Unified order processed with escrow protection and split across vendor sub-orders.',
    order: parentOrder,
  });
});

// 8. Orders: Buyer order history
app.get('/api/v1/orders/my-orders', authenticateToken, (req, res) => {
  res.json(orders);
});

// 9. Vendor: Get incoming sub-orders
app.get('/api/v1/vendor/orders', authenticateToken, (req, res) => {
  const vendorStoreId = req.query.storeId || 'store-1';
  const incoming = orderItems.filter((item) => item.storeId === vendorStoreId);
  res.json(incoming);
});

// 10. Vendor: Update order item status in state machine
app.patch('/api/v1/vendor/orders/:id/status', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  let found = false;
  // Update in orderItems list
  orderItems = orderItems.map((item) => {
    if (item.id === id) {
      found = true;
      return { ...item, status };
    }
    return item;
  });

  // Also update in parent orders array
  orders = orders.map((order) => {
    const updatedItems = order.items.map((item) => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });
    return { ...order, items: updatedItems };
  });

  res.json({ message: 'Sub-order status updated', id, status });
});

// Health endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', storesCount: stores.length, productsCount: products.length, ordersCount: orders.length });
});

app.listen(PORT, () => {
  console.log(`🚀 NewMarket Express API running on http://localhost:${PORT}`);
});
