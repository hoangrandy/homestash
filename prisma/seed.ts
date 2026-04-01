import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;
try {
  prisma = new PrismaClient();
} catch (e: any) {
  console.error("PRISMA INIT ERROR:", e.message);
  process.exit(1);
}

async function main() {
  console.log('Start seeding...');
  
  const products = [
    {
      name: 'Mechanical Keyboard (Cherry MX Red)',
      sku: 'KBD-MECH-RED-001',
    },
    {
      name: 'Wireless Ergonomic Mouse',
      sku: 'MSE-WRL-ERG-002',
    },
    {
      name: '27-inch 4K USB-C Monitor',
      sku: 'MON-4K-27-003',
    },
    {
      name: 'Adjustable Standing Desk (120x60cm)',
      sku: 'DSK-STD-120-004',
    },
  ];

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    });
    console.log(`Created product with id: ${createdProduct.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
