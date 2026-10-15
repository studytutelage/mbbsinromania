import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkFmge() {
    const rates = await prisma.universityFmgeRate.findMany({
        where: { status: true },
        include: { university: { select: { name: true } } },
        orderBy: [{ year: "desc" }],
    });
    console.log(JSON.stringify(rates, null, 2));
}

checkFmge()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
