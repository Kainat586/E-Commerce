// import { PrismaClient } from '@prisma/client';
const { PrismaClient } = require('../generated/prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword1 = await bcrypt.hash('kainat123', 10);
  const hashedPassword2 = await bcrypt.hash('menahil123', 10);
  const hashedPassword3 = await bcrypt.hash('charlie123', 10);

  const user1 = await prisma.user.create({
    data: { name: 'Kainat', email: 'kainat@gmail.com', password: hashedPassword1, role: 'BUYER' },
  });
  const user2 = await prisma.user.create({
    data: { name: 'Menahil', email: 'menahil@gmail.com', password: hashedPassword2, role: 'SELLER' },
  });
  const user3 = await prisma.user.create({
    data: { name: 'Charlie', email: 'charlie@gmail.com', password: hashedPassword3, role: 'BUYER' },
  });

  const store1 = await prisma.store.create({
    data: {
      name: "Menahil's Electronics",
      description: 'Best electronics store',
      address: 'Downtown',
      logo: "https://i.postimg.cc/9MTGQSdC/download.jpg",
      sellerId: user2.id,
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 1200,
      stock: 10,
      imageUrl: "https://i.postimg.cc/xTQPc0Fn/download.jpg",
      storeId: store1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Headphones',
      description: 'Noise-cancelling headphones',
      price: 150,
      stock: 20,
      imageUrl: "https://i.postimg.cc/3RPnLmBv/download.jpg",
      storeId: store1.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Smartphone',
      description: 'Latest model smartphone',
      price: 800,
      stock: 15,
      imageUrl: "https://i.postimg.cc/fRjpJ2vV/download.jpg",
      storeId: store1.id,
    },
  });

  await prisma.cart.createMany({
    data: [
      { userId: user1.id, productId: product1.id, quantity: 1 },
      { userId: user1.id, productId: product2.id, quantity: 2 },
      { userId: user3.id, productId: product3.id, quantity: 1 },
    ],
  });

  await prisma.order.createMany({
    data: [
      {
        userId: user1.id,
        productId: product1.id,
        quantity: 1,
        totalPrice: 1200,
        customerName: 'Kainat',
        customerEmail: 'kainat@gmail.com',
        customerPhone: '1234567890',
        address: '123 Street, City',
      },
      {
        userId: user3.id,
        productId: product3.id,
        quantity: 1,
        totalPrice: 800,
        customerName: 'Charlie',
        customerEmail: 'charlie@gmail.com',
        customerPhone: '0987654321',
        address: '456 Avenue, City',
      },
    ],
  });

  
  await prisma.reviews.createMany({
    data: [
      { userId: user1.id, productId: product1.id, rating: 5, comment: 'Excellent laptop!' },
      { userId: user3.id, productId: product3.id, rating: 4, comment: 'Good phone, battery could be better.' },
    ],
  });

 
  await prisma.siteReviews.createMany({
    data: [
      { userId: user1.id, rating: 5, comment: 'Great shopping experience!' },
      { userId: user3.id, rating: 4, comment: 'Nice site, easy to use.' },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
