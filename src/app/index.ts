import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function toggleBatteryStatus(batteryName: string) {
  const battery = await prisma.battery.findUnique({
    where: { name: batteryName },
  });

  if (battery) {
    // Toggle the status
    const newStatus = battery.status === 'IN' ? 'OUT' : 'IN';
    await prisma.battery.update({
      where: { name: batteryName },
      data: { status: newStatus },
    });
    console.log(`Battery '${batteryName}' is now ${newStatus}`);
  } else {
    // Create a new battery entry
    await prisma.battery.create({
      data: { name: batteryName, status: 'IN' },
    });
    console.log(`Battery '${batteryName}' signed IN`);
  }
}

// Example usage
(async () => {
  const batteryName = process.argv[2]; // Get battery name from command-line arguments
  if (batteryName) {
    await toggleBatteryStatus(batteryName);
  } else {
    console.log('Please provide a battery name.');
  }

  await prisma.$disconnect();
})();
