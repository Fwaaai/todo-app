import { prisma } from "../../lib/prisma";
import { verifyPassword, hashPass } from "../../utils/hashPass";

export async function changeEmail(password: string, newEmail: string, hashed: string, id: number) {
  const matchPass = await verifyPassword(password, hashed);

  if (!matchPass) {
    return { status: 401, body: { error: "Invalid credentials" } };
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { email: newEmail },
    });
    return { status: 200, body: { id: user.id, name: user.name, email: user.email, creation: user.creation } };
  } catch (error) {
    return { status: 500, body: { error: "Something went wrong" } };
  }
}