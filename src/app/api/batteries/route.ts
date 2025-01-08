import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const batteries = await prisma.battery.findMany();
  return NextResponse.json(batteries);
}