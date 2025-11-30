import { prisma } from "../../lib/prisma";
import { logResponse } from "../../utils/logProcess";
import chalk from "chalk";

export async function toggleDone(id: number, whose: number, reqid: number) {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Toggling task {${id}}.`));
  try {
    console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Checking if task {${id}} exists and belongs to UserID=${whose}.`));
    const existing = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existing) {
      logResponse(404, "Task not found.", reqid);
      return { status: 404, body: { error: "Task not found" } };
    }

    if (existing.whichId !== whose) {
      logResponse(403, "Task does not belong to user.", reqid);
      return { status: 403, body: { error: "Task does not belong to user" } };
    }

    console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Toggling task {${id}}.`));

    const task = await prisma.todo.update({
      where: { id },
      data: { done: !existing.done },
    });

    logResponse(200, "Task toggled successfully.", reqid);
    return { status: 200, body: { task } };
  } catch (error) {
    console.error(error);
    logResponse(500, "Something went wrong.", reqid);
    return { status: 500, body: { error: "Something went wrong" } };
  }
}
