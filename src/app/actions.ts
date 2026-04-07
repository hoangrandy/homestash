'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getItems(searchQuery?: string) {
  if (searchQuery) {
    return await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchQuery } },
          { sku: { contains: searchQuery } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDistinctCategories(): Promise<string[]> {
  const results = await prisma.product.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  });
  return results.map((r: { category: string | null }) => r.category as string);
}

export async function getDistinctLocations(): Promise<string[]> {
  const results = await prisma.product.findMany({
    where: { sku: { not: null } },
    select: { sku: true },
    distinct: ['sku'],
    orderBy: { sku: 'asc' },
  });
  return results.map((r: { sku: string | null }) => r.sku as string);
}

export async function addItem(formData: FormData) {
  const name = formData.get('name') as string;
  const category = formData.get('category') as string | null;
  const description = formData.get('description') as string | null;
  const sku = formData.get('sku') as string | null;

  if (!name) {
    throw new Error('Name is required');
  }

  await prisma.product.create({
    data: {
      name,
      category: category || null,
      description: description || null,
      sku: sku || null,
    },
  });

  revalidatePath('/');
}
export async function updateItem(id: string, data: { name?: string; category?: string | null; description?: string | null; sku?: string | null; imageUrl?: string | null }) {
  if (data.name === '') {
    throw new Error('Name is required');
  }

  const updateData: any = { ...data };

  await prisma.product.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/');
}

export async function deleteItem(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath('/');
}

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadImage(id: string, formData: FormData) {
  const file = formData.get('image') as File | null;
  if (!file) {
    throw new Error('No file uploaded');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Define upload directory
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  // ensure directory exists
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch(e) {}

  const extension = file.name.split('.').pop() || 'tmp';
  const filename = `${id}-${Date.now()}.${extension}`;
  const filepath = join(uploadDir, filename);

  await writeFile(filepath, buffer);

  const imageUrl = `/uploads/${filename}`;
  await prisma.product.update({
    where: { id },
    data: { imageUrl }
  });

  revalidatePath('/');
}
