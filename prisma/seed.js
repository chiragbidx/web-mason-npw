import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ---------------- MOCK DATA ---------------- */

const MOCK_HOTELS = [
  {
    name: "The Grand Palace",
    location: "London, UK",
    price: 250,
    rating: 4.8,
    type: "Hotel",
    amenities: ["Wifi", "Pool", "Spa"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    description: "Luxury hotel in the heart of London.",
  },
  {
    name: "Ocean View Resort",
    location: "Maldives",
    price: 450,
    rating: 4.9,
    type: "Resort",
    amenities: ["Wifi", "Pool", "Beach Access", "Breakfast"],
    images: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
    ],
    description: "Paradise resort with ocean views.",
  },
  {
    name: "Alpine Lodge",
    location: "Aspen, USA",
    price: 350,
    rating: 4.7,
    type: "Cabin",
    amenities: ["Wifi", "Fireplace", "Ski Access", "Hot Tub"],
    images: [
      "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d5?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    description: "Cozy cabin perfect for winter getaways.",
  },
  {
    name: "Santorini Blue",
    location: "Santorini, Greece",
    price: 400,
    rating: 4.8,
    type: "Villa",
    amenities: ["Wifi", "Pool", "Sea View", "Breakfast"],
    images: [
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    description: "Stunning white villa overlooking the Aegean Sea.",
  },
  {
    name: "Desert Oasis",
    location: "Dubai, UAE",
    price: 550,
    rating: 4.6,
    type: "Resort",
    amenities: ["Wifi", "Pool", "Spa", "Gym"],
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    description: "Luxury desert resort with world-class amenities.",
  },
  {
    name: "Rainforest Eco Lodge",
    location: "Costa Rica",
    price: 180,
    rating: 4.7,
    type: "Cabin",
    amenities: ["Wifi", "Hiking Trails", "Breakfast"],
    images: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    description: "Immersive nature experience in the rainforest.",
  },
  {
    name: "Parisian Apartment",
    location: "Paris, France",
    price: 220,
    rating: 4.5,
    type: "Apartment",
    amenities: ["Wifi", "Kitchen", "City View"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    description: "Chic apartment near the Eiffel Tower.",
  },
  {
    name: "Sydney Harbour Hotel",
    location: "Sydney, Australia",
    price: 300,
    rating: 4.6,
    type: "Hotel",
    amenities: ["Wifi", "Pool", "Gym", "Bar"],
    images: [
      "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    description: "Modern hotel with views of the Opera House.",
  },
  {
    name: "Tuscan Villa",
    location: "Tuscany, Italy",
    price: 500,
    rating: 4.9,
    type: "Villa",
    amenities: ["Wifi", "Pool", "Kitchen", "Vineyard"],
    images: [
      "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    description: "Rustic villa surrounded by rolling vineyards.",
  },
  {
    name: "Manhattan Penthouse",
    location: "New York, USA",
    price: 800,
    rating: 4.8,
    type: "Apartment",
    amenities: ["Wifi", "Gym", "Concierge", "Skyline View"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
    ],
    description: "Exclusive penthouse in the heart of NYC.",
  },
];

/* ---------------- HELPER FUNCTIONS ---------------- */

function getDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(0, 0, 0, 0);
  return date;
}

function calculateNights(startDate, endDate) {
  return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
}

function generateTransactionId() {
  return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

/* ---------------- SEED ---------------- */

async function main() {
  console.log("🌱 Seeding started...");

  /* ---------- CREATE DEMO USER ---------- */
  const user = await prisma.user.upsert({
    where: { email: "demo@pandahotel.com" },
    update: {},
    create: {
      email: "demo@pandahotel.com",
      name: "Demo User",
      password: "password123",
    },
  });

  console.log("👤 User created:", user.email);

  /* ---------- CREATE LISTINGS ---------- */
  const listings = [];
  for (const hotel of MOCK_HOTELS) {
    const listing = await prisma.listing.create({
      data: {
        title: hotel.name,
        description: hotel.description,
        location: hotel.location,
        price: hotel.price,
        type: hotel.type,
        rating: hotel.rating,
        images: {
          create: hotel.images.map((url) => ({ url })),
        },
        amenities: {
          create: hotel.amenities.map((name) => ({
            amenity: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      },
    });
    listings.push(listing);
    console.log("🏨 Listing created:", listing.title);
  }

  /* ---------- CREATE AVAILABILITY (NEXT 90 DAYS) ---------- */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const listing of listings) {
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      await prisma.availability.upsert({
        where: {
          listingId_date: {
            listingId: listing.id,
            date: date,
          },
        },
        update: {},
        create: {
          listingId: listing.id,
          date: date,
          price: listing.price,
          isBooked: false,
        },
      });
    }
  }

  console.log("📅 Availability created for next 90 days");

  /* ---------- CREATE PAST BOOKINGS (3 bookings) ---------- */
  const pastBookings = [];

  // Past Booking 1: Completed with review
  const pastBooking1 = await prisma.booking.create({
    data: {
      userId: user.id,
      listingId: listings[0].id, // The Grand Palace
      startDate: getDate(-30),
      endDate: getDate(-27),
      totalPrice: listings[0].price * 3 * 2, // 3 nights, 2 guests
      status: "CONFIRMED",
      guests: {
        create: [
          { name: "Demo User", email: user.email, age: 30 },
          { name: "Guest User", email: "guest@example.com", age: 28 },
        ],
      },
    },
  });
  pastBookings.push(pastBooking1);

  // Mark availability as booked
  for (let i = -30; i < -27; i++) {
    const date = getDate(i);
    await prisma.availability.updateMany({
      where: {
        listingId: listings[0].id,
        date: date,
      },
      data: { isBooked: true },
    });
  }

  // Payment for past booking 1
  await prisma.payment.create({
    data: {
      bookingId: pastBooking1.id,
      userId: user.id,
      amount: pastBooking1.totalPrice,
      status: "COMPLETED",
      method: "Credit Card",
      transactionId: generateTransactionId(),
      createdAt: getDate(-30),
    },
  });

  // Review for past booking 1
  await prisma.review.create({
    data: {
      userId: user.id,
      listingId: listings[0].id,
      bookingId: pastBooking1.id,
      rating: 5,
      comment: "Amazing stay! The hotel was beautiful and the service was exceptional. Highly recommend!",
      createdAt: getDate(-25),
    },
  });

  // Past Booking 2: Completed without review
  const pastBooking2 = await prisma.booking.create({
    data: {
      userId: user.id,
      listingId: listings[1].id, // Ocean View Resort
      startDate: getDate(-60),
      endDate: getDate(-57),
      totalPrice: listings[1].price * 3 * 1, // 3 nights, 1 guest
      status: "CONFIRMED",
      guests: {
        create: [{ name: "Demo User", email: user.email, age: 30 }],
      },
    },
  });
  pastBookings.push(pastBooking2);

  for (let i = -60; i < -57; i++) {
    const date = getDate(i);
    await prisma.availability.updateMany({
      where: {
        listingId: listings[1].id,
        date: date,
      },
      data: { isBooked: true },
    });
  }

  await prisma.payment.create({
    data: {
      bookingId: pastBooking2.id,
      userId: user.id,
      amount: pastBooking2.totalPrice,
      status: "COMPLETED",
      method: "Debit Card",
      transactionId: generateTransactionId(),
      createdAt: getDate(-60),
    },
  });

  // Past Booking 3: Completed with review
  const pastBooking3 = await prisma.booking.create({
    data: {
      userId: user.id,
      listingId: listings[2].id, // Alpine Lodge
      startDate: getDate(-15),
      endDate: getDate(-12),
      totalPrice: listings[2].price * 3 * 2, // 3 nights, 2 guests
      status: "CONFIRMED",
      guests: {
        create: [
          { name: "Demo User", email: user.email, age: 30 },
          { name: "Partner User", email: "partner@example.com", age: 29 },
        ],
      },
    },
  });
  pastBookings.push(pastBooking3);

  for (let i = -15; i < -12; i++) {
    const date = getDate(i);
    await prisma.availability.updateMany({
      where: {
        listingId: listings[2].id,
        date: date,
      },
      data: { isBooked: true },
    });
  }

  await prisma.payment.create({
    data: {
      bookingId: pastBooking3.id,
      userId: user.id,
      amount: pastBooking3.totalPrice,
      status: "COMPLETED",
      method: "Credit Card",
      transactionId: generateTransactionId(),
      createdAt: getDate(-15),
    },
  });

  await prisma.review.create({
    data: {
      userId: user.id,
      listingId: listings[2].id,
      bookingId: pastBooking3.id,
      rating: 4,
      comment: "Great location and cozy atmosphere. Perfect for a winter getaway!",
      createdAt: getDate(-10),
    },
  });

  console.log("✅ Created 3 past bookings with payments and reviews");

  /* ---------- CREATE UPCOMING BOOKINGS (3 bookings) ---------- */
  const upcomingBookings = [];

  // Upcoming Booking 1
  const upcomingBooking1 = await prisma.booking.create({
    data: {
      userId: user.id,
      listingId: listings[3].id, // Kyoto Ryokan
      startDate: getDate(10),
      endDate: getDate(13),
      totalPrice: listings[3].price * 3 * 2, // 3 nights, 2 guests
      status: "CONFIRMED",
      guests: {
        create: [
          { name: "Demo User", email: user.email, age: 30 },
          { name: "Guest User", email: "guest@example.com", age: 28 },
        ],
      },
    },
  });
  upcomingBookings.push(upcomingBooking1);

  for (let i = 10; i < 13; i++) {
    const date = getDate(i);
    await prisma.availability.updateMany({
      where: {
        listingId: listings[3].id,
        date: date,
      },
      data: { isBooked: true },
    });
  }

  await prisma.payment.create({
    data: {
      bookingId: upcomingBooking1.id,
      userId: user.id,
      amount: upcomingBooking1.totalPrice,
      status: "COMPLETED",
      method: "Credit Card",
      transactionId: generateTransactionId(),
      createdAt: getDate(-5),
    },
  });

  // Upcoming Booking 2
  const upcomingBooking2 = await prisma.booking.create({
    data: {
      userId: user.id,
      listingId: listings[4].id, // Santorini Blue
      startDate: getDate(25),
      endDate: getDate(28),
      totalPrice: listings[4].price * 3 * 1, // 3 nights, 1 guest
      status: "CONFIRMED",
      guests: {
        create: [{ name: "Demo User", email: user.email, age: 30 }],
      },
    },
  });
  upcomingBookings.push(upcomingBooking2);

  for (let i = 25; i < 28; i++) {
    const date = getDate(i);
    await prisma.availability.updateMany({
      where: {
        listingId: listings[4].id,
        date: date,
      },
      data: { isBooked: true },
    });
  }

  await prisma.payment.create({
    data: {
      bookingId: upcomingBooking2.id,
      userId: user.id,
      amount: upcomingBooking2.totalPrice,
      status: "COMPLETED",
      method: "PayPal",
      transactionId: generateTransactionId(),
      createdAt: getDate(-3),
    },
  });

  // Upcoming Booking 3 (Pending)
  const upcomingBooking3 = await prisma.booking.create({
    data: {
      userId: user.id,
      listingId: listings[5].id, // Desert Oasis
      startDate: getDate(45),
      endDate: getDate(48),
      totalPrice: listings[5].price * 3 * 2, // 3 nights, 2 guests
      status: "PENDING",
      guests: {
        create: [
          { name: "Demo User", email: user.email, age: 30 },
          { name: "Guest User", email: "guest@example.com", age: 28 },
        ],
      },
    },
  });
  upcomingBookings.push(upcomingBooking3);

  for (let i = 45; i < 48; i++) {
    const date = getDate(i);
    await prisma.availability.updateMany({
      where: {
        listingId: listings[5].id,
        date: date,
      },
      data: { isBooked: true },
    });
  }

  await prisma.payment.create({
    data: {
      bookingId: upcomingBooking3.id,
      userId: user.id,
      amount: upcomingBooking3.totalPrice,
      status: "PENDING",
      method: "Credit Card",
      transactionId: null,
      createdAt: getDate(-1),
    },
  });

  console.log("✅ Created 3 upcoming bookings with payments");

  /* ---------- CREATE CANCELLED BOOKINGS (2 bookings) ---------- */
  const cancelledBookings = [];

  // Cancelled Booking 1
  const cancelledBooking1 = await prisma.booking.create({
    data: {
      userId: user.id,
      listingId: listings[6].id, // Rainforest Eco Lodge
      startDate: getDate(5),
      endDate: getDate(8),
      totalPrice: listings[6].price * 3 * 1, // 3 nights, 1 guest
      status: "CANCELLED",
      guests: {
        create: [{ name: "Demo User", email: user.email, age: 30 }],
      },
    },
  });
  cancelledBookings.push(cancelledBooking1);

  // Release availability for cancelled booking
  for (let i = 5; i < 8; i++) {
    const date = getDate(i);
    await prisma.availability.updateMany({
      where: {
        listingId: listings[6].id,
        date: date,
      },
      data: { isBooked: false },
    });
  }

  await prisma.payment.create({
    data: {
      bookingId: cancelledBooking1.id,
      userId: user.id,
      amount: cancelledBooking1.totalPrice,
      status: "CANCELLED",
      method: "Credit Card",
      transactionId: generateTransactionId(),
      createdAt: getDate(-20),
    },
  });

  // Cancelled Booking 2
  const cancelledBooking2 = await prisma.booking.create({
    data: {
      userId: user.id,
      listingId: listings[7].id, // Parisian Apartment
      startDate: getDate(-10),
      endDate: getDate(-7),
      totalPrice: listings[7].price * 3 * 2, // 3 nights, 2 guests
      status: "CANCELLED",
      guests: {
        create: [
          { name: "Demo User", email: user.email, age: 30 },
          { name: "Guest User", email: "guest@example.com", age: 28 },
        ],
      },
    },
  });
  cancelledBookings.push(cancelledBooking2);

  await prisma.payment.create({
    data: {
      bookingId: cancelledBooking2.id,
      userId: user.id,
      amount: cancelledBooking2.totalPrice,
      status: "CANCELLED",
      method: "Debit Card",
      transactionId: generateTransactionId(),
      createdAt: getDate(-12),
    },
  });

  console.log("✅ Created 2 cancelled bookings with payments");

  /* ---------- UPDATE LISTING RATINGS BASED ON REVIEWS ---------- */
  for (const listing of listings) {
    const reviews = await prisma.review.findMany({
      where: { listingId: listing.id },
      select: { rating: true },
    });

    if (reviews.length > 0) {
      const averageRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await prisma.listing.update({
        where: { id: listing.id },
        data: { rating: Math.round(averageRating * 10) / 10 },
      });
    }
  }

  console.log("✅ Updated listing ratings based on reviews");

  console.log("\n📊 Summary:");
  console.log(`   👤 User: ${user.email}`);
  console.log(`   🏨 Listings: ${listings.length}`);
  console.log(`   📅 Past Bookings: ${pastBookings.length}`);
  console.log(`   🔮 Upcoming Bookings: ${upcomingBookings.length}`);
  console.log(`   ❌ Cancelled Bookings: ${cancelledBookings.length}`);
  console.log(`   💳 Total Payments: ${pastBookings.length + upcomingBookings.length + cancelledBookings.length}`);
  console.log("\n✅ Seeding finished successfully!");
}

/* ---------------- RUN ---------------- */

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
