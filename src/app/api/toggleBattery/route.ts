import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import Prisma Client

export async function POST(request: Request) {
  const { batteryName } = await request.json();

  if (!batteryName) {
    return NextResponse.json({ message: 'Battery name is required' }, { status: 400 });
  }

  // Find the battery by name2
  const battery = await prisma.battery.findFirst({
    where: { name2: batteryName },
  });

  if (!battery) {
    return NextResponse.json({ message: 'Battery not found' }, { status: 404 });
  }

  // Toggle the battery status and increment cycles if scanning IN
  const newStatus = battery.status === 'OUT' ? 'IN' : 'OUT';
  const updatedBattery = await prisma.battery.update({
    where: { id: battery.id },
    data: {
      status: newStatus,
      lastCheckedIn: newStatus === 'IN' ? new Date() : battery.lastCheckedIn,
      cycles: newStatus === 'IN' ? { increment: 1 } : battery.cycles,
    },
  });

  return NextResponse.json(updatedBattery);
}