import "dotenv/config";

const requiredEnvs = ["CLIENT_URL", "JWT_SECRET"];

for (const key of requiredEnvs) {
    if (!process.env[key]) {
        console.error(`FATAL ERROR: ${key} is missing`);
        process.exit(1);
    }
}

export const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    clientUrl: process.env.CLIENT_URL,
}