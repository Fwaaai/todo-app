import chalk from "chalk";
import { prisma } from "../../lib/prisma";
import { logResponse } from "../../utils/logProcess";

export async function deleteTask(id: number, whose: number, reqid: number) {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Deleting task {${id}} for UserID=${whose}.`));
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Checking if task {${id}} belongs to UserID=${whose}.`));
  try {
    const task = await prisma.todo.findUnique({
      where: {
        id,
      },
    })
    if (!task) {
      logResponse(404, "Task not found.", reqid);
      return { status: 404, body: { error: "Task not found" } };
    }

    if (task.whichId !== whose) {
      logResponse(403, "Task does not belong to user.", reqid);
      return { status: 403, body: { error: "Task does not belong to user" } };
    }
  } catch (error) {
    logResponse(500, "Something went wrong.", reqid);
    return { status: 500, body: { error: "Something went wrong" } };
  }
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Verified, deleting task {${id}}.`));
  try {
    const task = await prisma.todo.delete({
      where: {
        id,
      },
    })
    console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Task deleted successfully for UserID=${whose}.`));
    logResponse(204, "Task deleted successfully.", reqid);
    return { status: 204, body: {}};
  } catch (error) {
    logResponse(500, "Something went wrong.", reqid);
    return { status: 500, body: { error: "Something went wrong" } };
  }
  
  
  
}
