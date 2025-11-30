import { prisma } from "../../lib/prisma";
import { verifyPassword, hashPass } from "../../utils/hashPass";
import { logResponse } from "../../utils/logProcess";
import chalk from "chalk";
export async function deleteAccount(password: string, hashed: string, id: number, reqid: number) {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Password verification started for UserID=${id}.`));
  const matchPass = await verifyPassword(password, hashed);


  if (!matchPass) {
    logResponse(403, "Invalid credentials.", reqid);
    return { status: 403, body: { error: "Invalid credentials" } };
  }

  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Password verified for UserID=${id}.`));

  try {
    console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Deleting account for UserID=${id}...`));
    const user = await prisma.user.delete({
      where: { id },
    });
    logResponse(204, "Account deleted successfully.", reqid);
    return { status: 204, body: { } };
  } catch (error) {
    logResponse(500, "Something went wrong.", reqid);
    return { status: 500, body: { error: "Something went wrong" } };
  }
}