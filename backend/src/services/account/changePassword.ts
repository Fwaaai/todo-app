import { prisma } from "../../lib/prisma";
import { verifyPassword, hashPass } from "../../utils/hashPass";

export async function changePassword(password: string, newPassword: string, hashed: string, id: number) {
  const matchPass = await verifyPassword(password, hashed);

  if (!matchPass) {
    return { status: 401, body: { error: "Invalid credentials" } };
  }

  const newHashed = await hashPass(newPassword);

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { password: newHashed },
    });
    return { status: 200, body: { id: user.id, name: user.name, email: user.email, creation: user.creation } };
  } catch (error) {
    return { status: 500, body: { error: "Something went wrong" } };
  }
}