import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { batteryName } = await request.json();

  if (!batteryName) {
    return NextResponse.json({ message: 'Battery name is required' }, { status: 400 });
  }

  const battery = await prisma.battery.findFirst({
    where: { name2: batteryName },
  });

  if (!battery) {
    return NextResponse.json({ message: 'Battery not found' }, { status: 404 });
  }

  const now = new Date();

  // Calculate the duration the battery has been plugged in
  const pluggedInDuration = battery.status === 'IN' && battery.lastCheckedIn
    ? now.getTime() - new Date(battery.lastCheckedIn).getTime()
    : 0;

  // Toggle the battery status and increment cycles if scanning IN
  const newStatus = battery.status === 'OUT' ? 'IN' : 'OUT';
  const updatedBattery = await prisma.battery.update({
    where: { id: battery.id },
    data: {
      status: newStatus,
      lastCheckedIn: newStatus === 'IN' ? now : battery.lastCheckedIn,
      cycles: newStatus === 'IN' ? { increment: 1 } : battery.cycles,
      pluggedInDuration: { increment: pluggedInDuration },
    },
  });

  return NextResponse.json(updatedBattery);
}