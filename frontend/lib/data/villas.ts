export interface Villa {
  id: number;
  name: string;
  location: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  guests: number;
  rooms: number;
  baths: number;
  tag: string;
  type: string;
  img: string;
  additionalImages: string[];
  amenities: string[];
  breakfastIncluded: boolean;
  dinnerIncluded: boolean;
  description: string;
  houseRules: string[];
}

export const VILLAS: Villa[] = [
  {
    id: 1,
    name: "Methlang Villa",
    location: "Pokhara, Nepal",
    address: "Lakeside, Pokhara, Gandaki",
    price: 17600,
    rating: 4.6,
    reviews: 92,
    guests: 12,
    rooms: 4,
    baths: 2,
    tag: "popular",
    type: "Lakeside",
    img: "https://l.icdbcdn.com/oh/bae4bc48-3f95-4610-b83e-0e02eb91110e.jpg",
    additionalImages: [
      "https://l.icdbcdn.com/oh/6f45d2cf-9f4a-48a7-98a0-46c0a88517ba.jpg?w=1920",
      "https://l.icdbcdn.com/oh/e7238812-54cd-4b28-8c8e-bdb6f21f7184.jpg?w=1920",
      "https://l.icdbcdn.com/oh/299f5e44-2588-4432-be72-0757613e8af5.jpg?w=1920",
      "https://l.icdbcdn.com/oh/e82139f2-6544-40f2-ad02-44101b77b749.jpg?w=1920",
    ],
    amenities: ["Pool", "Mountain View", "WiFi", "Kitchen", "Air Conditioning", "Parking", "Garden", "BBQ"],
    breakfastIncluded: true,
    dinnerIncluded: true,
    description:
      "Perched on the serene shores of Pokhara's Fewa Lake, Methlang Villa offers an unparalleled retreat with sweeping Annapurna views. This spacious four-bedroom villa blends traditional Nepali architecture with modern comforts — think hand-carved wooden windows, stone courtyards, and a private infinity pool overlooking the mountains. Perfect for families and groups seeking privacy and luxury.",
    houseRules: [
      "No smoking inside the villa premises",
      "Pets are not allowed",
      "Check-in from 2:00 PM, check-out by 11:00 AM",
      "Quiet hours observed between 10:00 PM and 8:00 AM",
      "Parties and events require prior approval",
    ],
  },
  {
    id: 2,
    name: "The Hideout Villa",
    location: "Pokhara, Nepal",
    address: "Fewa Lakeside, Pokhara, Gandaki",
    price: 15200,
    rating: 4.5,
    reviews: 68,
    guests: 8,
    rooms: 4,
    baths: 2,
    tag: "immediate",
    type: "Lakeside",
    img: "https://villathehideoutpokhara.np-hotel.com/data/Photos/OriginalPhoto/15839/1583906/1583906483/photo-the-hideout-villa-pokhara-pokhara-5.JPEG",
    additionalImages: [
      "https://villa-the-hideout.pokharahotelspage.com/data/Pics/OriginalPhoto/16165/1616563/1616563572/the-hideout-villa-pokhara-pokhara-pic-9.JPEG",
      "https://villa-the-hideout.pokharahotelspage.com/data/Pics/OriginalPhoto/16165/1616563/1616563570/the-hideout-villa-pokhara-pokhara-pic-8.JPEG",
    ],
    amenities: ["WiFi", "Lake View", "Kitchen", "Air Conditioning"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description:
      "A hidden gem tucked away from the bustle of Pokhara, The Hideout Villa is your private sanctuary on the shores of Fewa Lake. With four bedrooms, a fully equipped kitchen, and stunning lake views from every room, this villa is perfect for those seeking tranquility and natural beauty.",
    houseRules: [
      "No smoking inside the villa",
      "Check-in from 3:00 PM, check-out by 12:00 PM",
      "Guests are responsible for any damages",
    ],
  },
  {
    id: 3,
    name: "Villa Karma Pokhara",
    location: "Pokhara, Nepal",
    address: "Lakeside, Pokhara, Gandaki",
    price: 14200,
    rating: 4.5,
    reviews: 54,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "new",
    type: "Lakeside",
    img: "https://a0.muscache.com/im/pictures/miso/Hosting-1135974458065631357/original/b39e7d07-95cf-40fb-828b-5ae4dd376397.jpeg?im_w=1440",
    additionalImages: [
      "https://a0.muscache.com/im/pictures/miso/Hosting-1135974458065631357/original/8e00a174-fc10-4180-9c49-26c799ffd26e.jpeg?im_w=1680",
      "https://a0.muscache.com/im/pictures/miso/Hosting-1135974458065631357/original/812358b8-798e-4adf-8dd4-7fab045df196.jpeg?im_w=1440",
      "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEzNTk3NDQ1ODA2NTYzMTM1Nw%3D%3D/original/0a2d246b-38e6-49fa-bd7e-e904f947d15e.jpeg?im_w=960&im_q=medq",
    ],
    amenities: ["WiFi", "Lake View", "Garden", "Parking"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description:
      "A brand new lakeside retreat offering breathtaking views of Fewa Lake and the Annapurna range. Modern, clean, and peaceful — perfect for couples and small families.",
    houseRules: ["No smoking", "Check-in from 2:00 PM"],
  },
  {
    id: 4,
    name: "The Pipal Tree",
    location: "Kathmandu, Nepal",
    address: "Patan Durbar, Lalitpur, Bagmati",
    price: 12400,
    rating: 4.3,
    reviews: 41,
    guests: 8,
    rooms: 3,
    baths: 2,
    tag: "new",
    type: "Heritage",
    img: "https://media.vrbo.com/lodging/100000000/99800000/99794400/99794388/9ead10f2.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    additionalImages: [
      "https://pix8.agoda.net/hotelImages/76067756/0/a35c11b4e6f8f4bfde926f4e2372fef9.jpg?ce=2&s=1024x",
      "https://pix8.agoda.net/hotelImages/76067756/0/1993e397be874e3bf7bdea35eec367b9.jpg?ce=2&s=1024x",
      "https://pix8.agoda.net/hotelImages/76067756/0/0937a0907bb3c81aaaa1034154e62f33.jpg?ce=2&s=1024x",
    ],
    amenities: ["WiFi", "Kitchen", "Garden", "Parking"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description:
      "A beautifully restored heritage home in the heart of Patan, offering an authentic glimpse into traditional Newari architecture and culture. Surrounded by courtyards and a mature pipal tree.",
    houseRules: ["No smoking", "Respect local heritage", "Quiet hours after 10 PM"],
  },
  {
    id: 5,
    name: "Villa De Amore",
    location: "Kathmandu, Nepal",
    address: "Bhaktapur Durbar, Bagmati",
    price: 19500,
    rating: 4.8,
    reviews: 116,
    guests: 10,
    rooms: 4,
    baths: 3,
    tag: "immediate",
    type: "Heritage",
    img: "https://www.villasnepal.com/storage/802/conversions/01KWTWP3A7QH4BZMQXAXNDW9Y8-hero_avif.webp",
    additionalImages: [
      "https://www.villasnepal.com/storage/799/conversions/01KWTWNQ8EYF6C2NBWBNP660VV-thumb_avif.webp",
      "https://www.villasnepal.com/storage/798/conversions/01KWTWNJQK7Z9D785SXMQXMBTQ-thumb_avif.webp",
    ],
    amenities: ["Pool", "WiFi", "Kitchen", "Mountain View", "Garden", "BBQ"],
    breakfastIncluded: true,
    dinnerIncluded: false,
    description:
      "Villa De Amore is a romantic heritage estate on the outskirts of Bhaktapur, blending antique Nepali craftsmanship with contemporary luxury. A private pool, lush gardens, and mountain views make it ideal for special occasions.",
    houseRules: ["No smoking inside", "Pets allowed with prior notice", "Check-in from 2:00 PM"],
  },
  {
    id: 6,
    name: "Archid Villa",
    location: "Nagarkot, Nepal",
    address: "Nagarkot Hill, Bhaktapur, Bagmati",
    price: 24000,
    rating: 4.7,
    reviews: 88,
    guests: 12,
    rooms: 5,
    baths: 3,
    tag: "popular",
    type: "Mountain",
    img: "https://archidvilla.com/wp-content/uploads/2026/05/6.jpeg",
    additionalImages: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80",
    ],
    amenities: ["WiFi", "Pool", "Kitchen", "Mountain View", "Heating", "Fireplace", "Parking"],
    breakfastIncluded: true,
    dinnerIncluded: true,
    description:
      "Perched at 2,175 metres on Nagarkot Hill, Archid Villa commands stunning 360° Himalayan panoramas including Everest on clear days. Five luxurious bedrooms, a heated pool, and a roaring fireplace make this the ultimate mountain retreat.",
    houseRules: ["No smoking", "Check-in from 2:00 PM, check-out by 11:00 AM", "Firewood is provided — no outside fires"],
  },
  {
    id: 7,
    name: "Farmhouse In Dhulikhel",
    location: "Kathmandu, Nepal",
    address: "Dhulikhel, Kathmandu, Nepal",
    price: 9500,
    rating: 4.9,
    reviews: 34,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "popular",
    type: "Mountain",
    img: "https://www.villasnepal.com/storage/213/conversions/01KCR3VQMHGZC8RC5HFJW17D36-hero_avif.webp",
    additionalImages: [],
    amenities: ["WiFi", "Fireplace", "Heater", "Kitchen"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description:
      "A traditional stone house in the mystical walled city of Lo Manthang, Upper Mustang. Rustic, authentic, and utterly remote — this is Nepal's best-kept secret for intrepid travellers.",
    houseRules: ["Special permit required for Upper Mustang", "No plastic bags inside", "Respect local Buddhist customs"],
  },
  {
    id: 8,
    name: "Bella Vista Thecho",
    location: "Kathmandu, Nepal",
    address: "Thecho, Lalitpur, Kathmandu",
    price: 11500,
    rating: 4.6,
    reviews: 72,
    guests: 10,
    rooms: 4,
    baths: 4,
    tag: "popular",
    type: "Jungle",
    img: "https://www.villasnepal.com/storage/890/conversions/01KXSRPJ7HWBMGA4YRMQGMQF7D-hero_avif.webp",
    additionalImages: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80",
    ],
    amenities: ["WiFi", "Air Conditioning", "Garden", "Restaurant", "Safari Access", "Pool"],
    breakfastIncluded: true,
    dinnerIncluded: true,
    description:
      "Immerse yourself in Nepal's wildlife at Chitwan Safari Lodge, nestled on the edge of Chitwan National Park. Wake up to jungle sounds, spot rhinos and elephants on guided safaris, and unwind by the pool at sunset.",
    houseRules: ["No loud noise after 9 PM — wildlife nearby", "Do not feed animals", "Follow safari guide instructions at all times"],
  },
  {
    id: 9,
    name: "Leopard Villa at Tiger Palace by Soaltee",
    location: "Lumbini, Nepal",
    address: "Lumbini Peace Zone, Rupandehi",
    price: 7500,
    rating: 4.7,
    reviews: 29,
    guests: 5,
    rooms: 2,
    baths: 2,
    tag: "immediate",
    type: "Jungle",
    img: "https://www.villasnepal.com/storage/330/conversions/01KHWRQJY78ARMKX5KVWWGX712-thumb_avif.webp",
    additionalImages: [
      "https://www.villasnepal.com/storage/330/conversions/01KHWRQJY78ARMKX5KVWWGX712-thumb_avif.webp",
      "https://www.villasnepal.com/storage/318/conversions/01KHWRQJP4YWS06VN9FT87D80Z-orig_avif.webp",
    ],
    amenities: ["WiFi", "Meditation Space", "Bicycles", "Garden"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description:
      "Find inner peace at Lumbini Zen Villa, a minimalist retreat in the birthplace of the Buddha. Surrounded by sacred gardens and monasteries, this villa offers guided meditation sessions, bicycle tours, and a deeply calming atmosphere.",
    houseRules: ["Meditation silence observed 6–8 AM", "Vegetarian meals only on premises", "No alcohol"],
  },
  {
    id: 10,
    name: "Farmhouse In Nagarkot",
    location: "Nagarkot, Nepal",
    address: "Nagarkot, Bhaktapur, Province 3",
    price: 8900,
    rating: 4.4,
    reviews: 47,
    guests: 6,
    rooms: 3,
    baths: 2,
    tag: "new",
    type: "Jungle",
    img: "https://www.villasnepal.com/storage/364/conversions/01KK6B9NDV1YBWNYNE92DGEPNS-hero_avif.webp",
    additionalImages: [],
    amenities: ["WiFi", "Garden Terrace", "Tea Tasting", "Kitchen", "Hiking Access"],
    breakfastIncluded: false,
    dinnerIncluded: false,
    description:
      "Surrounded by rolling tea gardens in Nepal's eastern hills, Ilam Tea Garden Villa offers a peaceful escape with guided tea estate tours, sunrise views, and fresh mountain air. A unique and offbeat experience for nature lovers.",
    houseRules: ["No smoking near tea gardens", "Check-in from 2:00 PM", "Hiking boots recommended"],
  },
];

export function getVillaById(id: number): Villa | undefined {
  return VILLAS.find((v) => v.id === id);
}