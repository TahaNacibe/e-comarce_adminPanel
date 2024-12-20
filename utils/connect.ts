import { PrismaClient } from "@prisma/client";

// Singleton function to return an instance of PrismaClient
const PrismaClientSingleton = () => {
    return new PrismaClient();
}

// Declare `globalThis` and extend it to store the Prisma instance
declare const globalThis: {
    prisma: ReturnType<typeof PrismaClientSingleton>;
    prismaGlobal: ReturnType<typeof PrismaClientSingleton> | undefined;
} & typeof global;

// Initialize `prisma` with either the global instance or a new one if not found
const prisma = globalThis.prismaGlobal ?? PrismaClientSingleton();

// Export `prisma` for use throughout your application
export default prisma;

// Assign `prisma` to `globalThis.prismaGlobal` in development to avoid multiple instances
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
