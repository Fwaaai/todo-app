import express from "express";
import { prisma } from "./lib/prisma";
import { hashPass } from "./utils/hashPass";
import userRoutes from "./routes/userRoutes";
import { setJson } from "./middleware/setJson";
import cors from "cors";



const app = express();

app.use(cors({ origin: "http://localhost:3000"}));
app.use(express.json());
app.use(setJson);

app.use("/api/users",  userRoutes);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});