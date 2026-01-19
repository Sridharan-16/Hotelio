const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
require('dotenv').config();

const sampleHotels = [
  // --- Existing hotels above ---
  // --- Add missing cities below ---
  {
    name: "Saigon Riverside Hotel",
    description: "Modern hotel on the riverbank in Ho Chi Minh City, Vietnam.",
    address: {
      street: "1 Nguyen Hue Blvd",
      city: "Ho Chi Minh",
      state: "Ho Chi Minh",
      zipCode: "700000",
      country: "Vietnam"
    },
    location: { latitude: 10.7769, longitude: 106.7009 },
    images: [
      { url: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800", alt: "Saigon Riverside" }
    ],
    rating: 4.2,
    reviewCount: 120,
    amenities: ["WiFi", "Parking", "Restaurant"],
    rooms: [ { type: "Deluxe", price: 3500, available: 10, maxGuests: 2, amenities: ["AC", "TV"] } ],
    policies: { checkIn: "14:00", checkOut: "11:00", cancellation: "Free cancellation" },
    contact: { phone: "+84-28-12345678", email: "info@saigonriverside.com" }
  },
  {
    name: "Paris Central Hotel",
    description: "Chic hotel in the heart of Paris, France.",
    address: {
      street: "12 Rue de Rivoli",
      city: "Paris",
      state: "Île-de-France",
      zipCode: "75001",
      country: "France"
    },
    location: { latitude: 48.8566, longitude: 2.3522 },
    images: [
      { url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800", alt: "Paris Central" }
    ],
    rating: 4.6,
    reviewCount: 210,
    amenities: ["WiFi", "Parking", "Restaurant"],
    rooms: [ { type: "Double", price: 6000, available: 8, maxGuests: 2, amenities: ["AC", "TV"] } ],
    policies: { checkIn: "15:00", checkOut: "11:00", cancellation: "Free cancellation" },
    contact: { phone: "+33-1-23456789", email: "info@pariscentral.com" }
  },
  {
    name: "Krabi Beach Resort",
    description: "Tropical beach resort in Krabi, Thailand.",
    address: {
      street: "Ao Nang Beach",
      city: "Krabi",
      state: "Krabi",
      zipCode: "81000",
      country: "Thailand"
    },
    location: { latitude: 8.0632, longitude: 98.9063 },
    images: [
      { url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800", alt: "Krabi Beach" }
    ],
    rating: 4.4,
    reviewCount: 88,
    amenities: ["WiFi", "Pool", "Restaurant"],
    rooms: [ { type: "Suite", price: 7000, available: 6, maxGuests: 3, amenities: ["AC", "TV"] } ],
    policies: { checkIn: "13:00", checkOut: "11:00", cancellation: "Free cancellation" },
    contact: { phone: "+66-75-123456", email: "info@krabibeach.com" }
  },
  {
    name: "Maldives Lagoon Villa",
    description: "Luxury villa on the water in the Maldives.",
    address: {
      street: "Lagoon Road",
      city: "Maldives",
      state: "Malé",
      zipCode: "20000",
      country: "Maldives"
    },
    location: { latitude: 3.2028, longitude: 73.2207 },
    images: [
      { url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800", alt: "Maldives Lagoon" }
    ],
    rating: 4.9,
    reviewCount: 340,
    amenities: ["WiFi", "Pool", "Spa"],
    rooms: [ { type: "Villa", price: 15000, available: 3, maxGuests: 2, amenities: ["AC", "TV"] } ],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation" },
    contact: { phone: "+960-1234567", email: "info@maldiveslagoon.com" }
  },
  {
    name: "Udaipur Lake Palace",
    description: "Palatial hotel on the lake in Udaipur, India.",
    address: {
      street: "Lake Pichola",
      city: "Udaipur",
      state: "Rajasthan",
      zipCode: "313001",
      country: "India"
    },
    location: { latitude: 24.5854, longitude: 73.7125 },
    images: [
      { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", alt: "Udaipur Lake Palace" }
    ],
    rating: 4.7,
    reviewCount: 160,
    amenities: ["WiFi", "Restaurant", "Spa"],
    rooms: [ { type: "Deluxe", price: 9000, available: 5, maxGuests: 2, amenities: ["AC", "TV"] } ],
    policies: { checkIn: "14:00", checkOut: "11:00", cancellation: "Free cancellation" },
    contact: { phone: "+91-294-1234567", email: "info@udaipurlakepalace.com" }
  },
  {
    name: "Phuket Paradise Resort",
    description: "Seaside resort in Phuket, Thailand.",
    address: {
      street: "Patong Beach",
      city: "Phuket",
      state: "Phuket",
      zipCode: "83150",
      country: "Thailand"
    },
    location: { latitude: 7.8804, longitude: 98.3923 },
    images: [
      { url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800", alt: "Phuket Paradise" }
    ],
    rating: 4.5,
    reviewCount: 110,
    amenities: ["WiFi", "Pool", "Restaurant"],
    rooms: [ { type: "Suite", price: 8000, available: 7, maxGuests: 2, amenities: ["AC", "TV"] } ],
    policies: { checkIn: "13:00", checkOut: "11:00", cancellation: "Free cancellation" },
    contact: { phone: "+66-76-123456", email: "info@phuketparadise.com" }
  },
  {
    name: "Bali Bliss Hotel",
    description: "Tropical escape in Bali, Indonesia.",
    address: {
      street: "Jl. Legian",
      city: "Bali",
      state: "Bali",
      zipCode: "80361",
      country: "Indonesia"
    },
    location: { latitude: -8.3405, longitude: 115.0920 },
    images: [
      { url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", alt: "Bali Bliss" }
    ],
    rating: 4.8,
    reviewCount: 200,
    amenities: ["WiFi", "Pool", "Restaurant"],
    rooms: [ { type: "Deluxe", price: 7500, available: 9, maxGuests: 2, amenities: ["AC", "TV"] } ],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation" },
    contact: { phone: "+62-361-1234567", email: "info@balibliss.com" }
  },
  {
    name: "Langkawi Island Resort",
    description: "Island resort in Langkawi, Malaysia.",
    address: {
      street: "Pantai Cenang",
      city: "Langkawi",
      state: "Kedah",
      zipCode: "07000",
      country: "Malaysia"
    },
    location: { latitude: 6.3126, longitude: 99.8547 },
    images: [
      { url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800", alt: "Langkawi Island" }
    ],
    rating: 4.3,
    reviewCount: 90,
    amenities: ["WiFi", "Pool", "Restaurant"],
    rooms: [ { type: "Double", price: 6500, available: 6, maxGuests: 2, amenities: ["AC", "TV"] } ],
    policies: { checkIn: "13:00", checkOut: "11:00", cancellation: "Free cancellation" },
    contact: { phone: "+60-4-1234567", email: "info@langkawiisland.com" }
  },
  {
    name: "Manali Mountain Resort",
    description: "Scenic mountain resort in Manali, India.",
    address: {
      street: "Mall Road",
      city: "Manali",
      state: "Himachal Pradesh",
      zipCode: "175131",
      country: "India"
    },
    location: { latitude: 32.2396, longitude: 77.1887 },
    images: [
      { url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800", alt: "Manali Mountain" }
    ],
    rating: 4.5,
    reviewCount: 140,
    amenities: ["WiFi", "Restaurant"],
    rooms: [ { type: "Suite", price: 6500, available: 5, maxGuests: 2, amenities: ["AC", "TV"] } ],
    policies: { checkIn: "14:00", checkOut: "11:00", cancellation: "Free cancellation" },
    contact: { phone: "+91-1902-123456", email: "info@manalimountain.com" }
  },
  {
    name: "Amsterdam Canal Hotel",
    description: "Boutique hotel by the canal in Amsterdam, Netherlands.",
    address: {
      street: "Herengracht 123",
      city: "Amsterdam",
      state: "North Holland",
      zipCode: "1015",
      country: "Netherlands"
    },
    location: { latitude: 52.3676, longitude: 4.9041 },
    images: [
      { url: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800", alt: "Amsterdam Canal" }
    ],
    rating: 4.6,
    reviewCount: 110,
    amenities: ["WiFi", "Restaurant"],
    rooms: [ { type: "Double", price: 7000, available: 4, maxGuests: 2, amenities: ["AC", "TV"] } ],
    policies: { checkIn: "15:00", checkOut: "11:00", cancellation: "Free cancellation" },
    contact: { phone: "+31-20-1234567", email: "info@amsterdamcanal.com" }
  },
  {
    name: "Singapore Skyline Hotel",
    description: "Modern hotel with city views in Singapore.",
    address: {
      street: "Marina Bay Sands",
      city: "Singapore",
      state: "Singapore",
      zipCode: "018956",
      country: "Singapore"
    },
    location: { latitude: 1.3521, longitude: 103.8198 },
    images: [
      { url: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800", alt: "Singapore Skyline" }
    ],
    rating: 4.7,
    reviewCount: 170,
    amenities: ["WiFi", "Pool", "Restaurant"],
    rooms: [ { type: "Deluxe", price: 9000, available: 6, maxGuests: 2, amenities: ["AC", "TV"] } ],
    policies: { checkIn: "14:00", checkOut: "12:00", cancellation: "Free cancellation" },
    contact: { phone: "+65-12345678", email: "info@singaporeskyline.com" }
  },
  // Add more as needed for other missing cities
  {
    name: "Grand Plaza Hotel",
    description: "A luxurious 5-star hotel located in the heart of the city, offering world-class amenities and exceptional service. Perfect for both business and leisure travelers.",
    address: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    },
    location: {
      latitude: 19.0760,
      longitude: 72.8777
    },
    images: [
      { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", alt: "Grand Plaza Hotel exterior" },
      { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800", alt: "Hotel lobby" },
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800", alt: "Hotel room" }
    ],
    rating: 4.5,
    reviewCount: 245,
    amenities: ["WiFi", "Parking", "Pool", "Restaurant", "Gym", "Spa", "Room Service"],
    rooms: [
      {
        type: "Deluxe",
        price: 5000,
        available: 15,
        maxGuests: 2,
        amenities: ["AC", "TV", "Mini Bar", "WiFi"]
      },
      {
        type: "Suite",
        price: 8000,
        available: 8,
        maxGuests: 4,
        amenities: ["AC", "TV", "Mini Bar", "WiFi", "Jacuzzi"]
      }
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "11:00",
      cancellation: "Free cancellation until 24 hours before check-in"
    },
    contact: {
      phone: "+91-22-12345678",
      email: "info@grandplaza.com"
    }
  },
  {
    name: "Ocean View Resort",
    description: "A beautiful beachfront resort with stunning ocean views. Enjoy the serene atmosphere and modern amenities.",
    address: {
      street: "Beach Road",
      city: "Goa",
      state: "Goa",
      zipCode: "403001",
      country: "India"
    },
    location: {
      latitude: 15.2993,
      longitude: 74.1240
    },
    images: [
      { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", alt: "Ocean View Resort" },
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", alt: "Beach view" }
    ],
    rating: 4.7,
    reviewCount: 189,
    amenities: ["WiFi", "Parking", "Pool", "Restaurant", "Beach Access", "Spa"],
    rooms: [
      {
        type: "Single",
        price: 3500,
        available: 20,
        maxGuests: 1,
        amenities: ["AC", "TV", "WiFi", "Ocean View"]
      },
      {
        type: "Double",
        price: 4500,
        available: 12,
        maxGuests: 2,
        amenities: ["AC", "TV", "WiFi", "Ocean View", "Balcony"]
      }
    ],
    policies: {
      checkIn: "15:00",
      checkOut: "12:00",
      cancellation: "Free cancellation until 48 hours before check-in"
    },
    contact: {
      phone: "+91-832-1234567",
      email: "info@oceanview.com"
    }
  },
  {
    name: "Business Tower Hotel",
    description: "Modern business hotel in the financial district, perfect for corporate travelers. Features state-of-the-art conference facilities.",
    address: {
      street: "456 Business Park",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      country: "India"
    },
    location: {
      latitude: 12.9716,
      longitude: 77.5946
    },
    images: [
      { url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800", alt: "Business Tower Hotel" },
      { url: "https://images.unsplash.com/photo-1596436889106-be35e843f975?w=800", alt: "Conference room" }
    ],
    rating: 4.3,
    reviewCount: 156,
    amenities: ["WiFi", "Parking", "Restaurant", "Gym", "Business Center", "Conference Rooms"],
    rooms: [
      {
        type: "Twin",
        price: 4000,
        available: 18,
        maxGuests: 2,
        amenities: ["AC", "TV", "WiFi", "Work Desk"]
      },
      {
        type: "Suite",
        price: 7000,
        available: 5,
        maxGuests: 3,
        amenities: ["AC", "TV", "WiFi", "Work Desk", "Living Area"]
      }
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "11:00",
      cancellation: "Free cancellation until 12 hours before check-in"
    },
    contact: {
      phone: "+91-80-12345678",
      email: "info@businesstower.com"
    }
  },
  {
    name: "Heritage Palace Hotel",
    description: "Experience royal luxury in this heritage property. Beautifully restored palace with traditional architecture and modern comforts.",
    address: {
      street: "Palace Road",
      city: "Jaipur",
      state: "Rajasthan",
      zipCode: "302001",
      country: "India"
    },
    location: {
      latitude: 26.9124,
      longitude: 75.7873
    },
    images: [
      { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", alt: "Heritage Palace Hotel" },
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800", alt: "Palace interior" }
    ],
    rating: 4.8,
    reviewCount: 312,
    amenities: ["WiFi", "Parking", "Pool", "Restaurant", "Spa", "Heritage Tours", "Cultural Shows"],
    rooms: [
      {
        type: "Deluxe",
        price: 6000,
        available: 10,
        maxGuests: 2,
        amenities: ["AC", "TV", "WiFi", "Heritage Decor"]
      },
      {
        type: "Suite",
        price: 12000,
        available: 3,
        maxGuests: 4,
        amenities: ["AC", "TV", "WiFi", "Heritage Decor", "Private Balcony", "Butler Service"]
      }
    ],
    policies: {
      checkIn: "14:00",
      checkOut: "11:00",
      cancellation: "Free cancellation until 72 hours before check-in"
    },
    contact: {
      phone: "+91-141-1234567",
      email: "info@heritagepalace.com"
    }
  },
  {
    name: "Mountain View Lodge",
    description: "Cozy mountain lodge with breathtaking views. Perfect for nature lovers and adventure enthusiasts.",
    address: {
      street: "Hill Station Road",
      city: "Shimla",
      state: "Himachal Pradesh",
      zipCode: "171001",
      country: "India"
    },
    location: {
      latitude: 31.1048,
      longitude: 77.1734
    },
    images: [
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", alt: "Mountain View Lodge" },
      { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", alt: "Mountain view" }
    ],
    rating: 4.4,
    reviewCount: 98,
    amenities: ["WiFi", "Parking", "Restaurant", "Fireplace", "Mountain View", "Trekking Guides"],
    rooms: [
      {
        type: "Single",
        price: 2500,
        available: 12,
        maxGuests: 1,
        amenities: ["Heater", "TV", "WiFi", "Mountain View"]
      },
      {
        type: "Double",
        price: 3500,
        available: 8,
        maxGuests: 2,
        amenities: ["Heater", "TV", "WiFi", "Mountain View", "Fireplace"]
      }
    ],
    policies: {
      checkIn: "13:00",
      checkOut: "10:00",
      cancellation: "Free cancellation until 48 hours before check-in"
    },
    contact: {
      phone: "+91-177-1234567",
      email: "info@mountainview.com"
    }
  }
];

async function seedHotels() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-reservation';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing hotels
    await Hotel.deleteMany({});
    console.log('Cleared existing hotels');

    // Insert sample hotels
    const hotels = await Hotel.insertMany(sampleHotels);
    console.log(`Inserted ${hotels.length} hotels`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding hotels:', error);
    process.exit(1);
  }
}

seedHotels();

