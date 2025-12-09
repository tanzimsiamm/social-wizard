import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env") });

interface Config {
  nodeEnv: string;
  port: number;
  database: {
    url: string;
  };
  jwt: {
    secret: any;
    expiresIn: any;
  };
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),

  database: {
    url: process.env.DATABASE_URL || "",
  },

  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
};

export default config;
