import { prisma } from "../../lib/prisma";
import { verifyPassword, hashPass } from "../../utils/hashPass";
import { logResponse } from "../../utils/logProcess";
import chalk from "chalk";

export async function changeEmail(password: string, newEmail: string, hashed: string, id: number, reqid: number) {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Password verification started for UserID=${id}.`));
  const matchPass = await verifyPassword(password, hashed);

  if (!matchPass) {
    logResponse(403, "Invalid credentials.", reqid);
    return { status: 403, body: { error: "Invalid credentials" } };
  }
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Password verified for UserID=${id}.`));
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { email: newEmail },
    });
    logResponse(200, "Email changed successfully.", reqid);
    return { status: 200, body: { id: user.id, name: user.name, email: user.email, creation: user.creation } };
  } catch (error:any) {
    if (error.code === "P2002") {
      const errorMsg = "Email already in use";
      logResponse(409, errorMsg, reqid);
      return { status: 409, body: { error: errorMsg } };
    }
    logResponse(500, "Something went wrong.", reqid);
    return { status: 500, body: { error: "Something went wrong" } };
  }
}