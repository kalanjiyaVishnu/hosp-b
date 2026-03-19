import prisma from "../config/db";

export const generateSlots = async (doctorId: string, date: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
  });

  if (!doctor) throw new Error("Doctor not found");

  const queryDate = new Date(date);
  const dayName = queryDate.toLocaleDateString("en-US", { weekday: "long" });

  if (!doctor.availableDays.includes(dayName)) {
    return [];
  }

  const slots = [];
  const startHour = 9; // 9:00 AM
  const endHour = 18; // 6:00 PM
  const slotDuration = doctor.slotDuration;

  let current = new Date(queryDate);
  current.setHours(startHour, 0, 0, 0);

  const end = new Date(queryDate);
  end.setHours(endHour, 0, 0, 0);

  // Fetch existing bookings for this doctor and date
  const existingBookings = await prisma.booking.findMany({
    where: {
      doctorId,
      slotDate: {
        gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        lte: new Date(queryDate.setHours(23, 59, 59, 999)),
      },
      status: {
        in: ["PENDING", "APPROVED", "COMPLETED"],
      },
    },
    select: {
      slotTime: true,
    },
  });

  const bookedTimes = new Set(existingBookings.map((b: { slotTime: string }) => b.slotTime));

  while (current < end) {
    const timeString = current.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    slots.push({
      time: timeString,
      available: !bookedTimes.has(timeString),
    });

    current.setMinutes(current.getMinutes() + slotDuration);
  }

  return slots;
};
