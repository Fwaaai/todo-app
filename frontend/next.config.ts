import type { NextConfig } from "next";

const allowedDevOriginsEnv = process.env.ALLOWED_ORIGINS;

let allowedDevOrigins: string[] = [];

if (allowedDevOriginsEnv) {
  try {
    allowedDevOrigins = JSON.parse(allowedDevOriginsEnv);
    if (!Array.isArray(allowedDevOrigins)) {
      throw new Error("ALLOWED_ORIGINS is not an array");
    }
  } catch (error) {
    console.error("Error parsing ALLOWED_ORIGINS:", error);
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins: allowedDevOrigins,
  
};

export default nextConfig;
