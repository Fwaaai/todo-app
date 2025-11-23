import { prisma } from "../../lib/prisma";

export async function changeName(name: string, id: number) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name: name },
    });
    return { status: 200, body: { id: user.id, name: user.name, email: user.email, creation: user.creation } };
  } catch (error) {
    return { status: 500, body: { error: "Something went wrong" } };
  }
}