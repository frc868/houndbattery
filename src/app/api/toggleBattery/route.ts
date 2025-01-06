import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import Prisma Client

export async function POST(request: Request) {
  const { batteryName } = await request.json();

  if (!batteryName) {
    return NextResponse.json({ message: 'Battery name is required' }, { status: 400 });
  }

  // Find the battery by name
  const battery = await prisma.battery.findUnique({
    where: { name: batteryName },
  });

  if (!battery) {
    return NextResponse.json({ message: 'Battery not found' }, { status: 404 });
  }

  // Toggle the battery status
  const updatedBattery = await prisma.battery.update({
    where: { name: batteryName },
    data: { status: battery.status === 'OUT' ? 'IN' : 'OUT' },
  });

  return NextResponse.json(updatedBattery);
}
