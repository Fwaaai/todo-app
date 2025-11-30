import chalk from "chalk";
import { logResponse } from "../../utils/logProcess"; 
import { prisma } from "../../lib/prisma";
export async function getTasks(id: number, reqid: number) {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Getting tasks for UserID=${id}.`));
  try {
    const tasks = await prisma.todo.findMany({
      where: {
        whichId: id,
      },
    })
    console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Tasks fetched successfully for UserID=${id}, found ${tasks.length}`));
    logResponse(200, "Tasks fetched successfully.", reqid);
    return { status: 200, body: { tasks } }
  } catch (error) {
    logResponse(500, "Something went wrong.", reqid);
    return { status: 500, body: { error: "Something went wrong" } }
  }
}