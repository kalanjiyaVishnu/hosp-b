import { PrismaClient, Role, BookingStatus, NotificationType } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  const patientHash = await bcrypt.hash("Patient@123", 10);

  // 1. Create Admin
  await prisma.user.upsert({
    where: { email: "admin@medicare.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@medicare.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  // 2. Create Doctors
  const doctorsConfigPath = path.join(__dirname, "../..", "web", "src", "config", "doctors.config.json");
  const doctorsConfig = JSON.parse(fs.readFileSync(doctorsConfigPath, "utf-8"));

  for (const doc of doctorsConfig.doctors) {
    // 2.1 Create Doctor User
    const docEmail = `${doc.name.toLowerCase().replace(/\s/g, ".")}@medicare.com`;
    const docUser = await prisma.user.upsert({
      where: { email: docEmail },
      update: {},
      create: {
        name: doc.name,
        email: docEmail,
        passwordHash,
        role: "DOCTOR",
      },
    });

    // 2.2 Create Doctor Profile
    await prisma.doctor.upsert({
      where: { configId: doc.id },
      update: {
        name: doc.name,
        department: doc.department,
        specialization: doc.specialization,
        availableDays: doc.availableDays,
        slotDuration: doc.slotDuration,
        consultationFee: doc.consultationFee,
      },
      create: {
        configId: doc.id,
        name: doc.name,
        department: doc.department,
        specialization: doc.specialization,
        availableDays: doc.availableDays,
        slotDuration: doc.slotDuration,
        consultationFee: doc.consultationFee,
      },
    });
  }

  // 3. Create Sample Patients
  const patient1 = await prisma.user.upsert({
    where: { email: "patient1@test.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "patient1@test.com",
      passwordHash: patientHash,
      role: "PATIENT",
      phone: "+91-9876543210",
    },
  });

  const patient2 = await prisma.user.upsert({
    where: { email: "patient2@test.com" },
    update: {},
    create: {
      name: "Sarah Smith",
      email: "patient2@test.com",
      passwordHash: patientHash,
      role: "PATIENT",
    },
  });

  // 4. Sample Bookings
  const doctors = await prisma.doctor.findMany();
  if (doctors.length > 0) {
    await prisma.booking.create({
      data: {
        patientId: patient1.id,
        doctorId: doctors[0].id,
        slotDate: new Date(),
        slotTime: "10:00 AM",
        status: "PENDING",
        reason: "General Checkup",
      },
    });

    await prisma.booking.create({
      data: {
        patientId: patient2.id,
        doctorId: doctors[0].id,
        slotDate: new Date(Date.now() + 86400000), // tomorrow
        slotTime: "11:30 AM",
        status: "APPROVED",
        reason: "Heart issues",
        approvedAt: new Date(),
      },
    });
  }

  // 5. Sample Notifications
  await prisma.notification.create({
    data: {
      userId: patient1.id,
      type: "SYSTEM",
      title: "Welcome aboard",
      message: "Welcome to MediCare Hospital system.",
    },
  });

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
