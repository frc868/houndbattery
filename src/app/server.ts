// import express, { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// const app = express();
// const port = 3000;

// // Use express's built-in JSON parsing middleware
// app.use(express.json()); // Express's built-in JSON body parser

// // Static files
// app.use(express.static('public'));

// // Define the type for the request body
// interface BatteryRequestBody {
//   batteryName: string;
// }

// // Route to handle battery status
// app.post('/toggleBattery', async (req: Request<{}, {}, BatteryRequestBody>, res: Response) => {
//   const { batteryName } = req.body;

//   if (!batteryName) {
//     return res.status(400).send('Battery name is required');
//   }

//   try {
//     // Check if battery exists
//     const battery = await prisma.battery.findUnique({
//       where: { name: batteryName },
//     });

//     if (battery) {
//       const newStatus = battery.status === 'IN' ? 'OUT' : 'IN';
//       // Update the status of the battery
//       await prisma.battery.update({
//         where: { name: batteryName },
//         data: { status: newStatus },
//       });
//       return res.json({ name: batteryName, status: newStatus });
//     } else {
//       // If battery does not exist, create a new battery
//       await prisma.battery.create({
//         data: { name: batteryName, status: 'IN' },
//       });
//       return res.json({ name: batteryName, status: 'IN' });
//     }
//   } catch (error) {
//     console.error('Error toggling battery status:', error);
//     res.status(500).send('Internal server error');
//   }
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });
