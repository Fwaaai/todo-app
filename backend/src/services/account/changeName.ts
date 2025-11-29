import { prisma } from "../../lib/prisma";
import { logResponse } from "../../utils/logProcess";
import chalk from "chalk";

export async function changeName(name: string, id: number, reqid: number) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name: name },
    });
    logResponse(200, "Name changed successfully.", reqid);
    return { status: 200, body: { id: user.id, name: user.name, email: user.email } };
  } catch (error) {
    logResponse(500, "Something went wrong.", reqid);
    return { status: 500, body: { error: "Something went wrong" } };
  }
}