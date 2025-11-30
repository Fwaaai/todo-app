import chalk from "chalk";
import { prisma } from "../../lib/prisma";
import { logResponse } from "../../utils/logProcess";

export async function newTask(title: string, content: string,  whose: number, reqid: number) {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Creating task for UserID=${whose}.`));
  try {
    const task = await prisma.todo.create({
      data: {
        title,
        content,
        which: {
          connect: {
            id: whose,
          },
        }
      },
    });
    console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Task created successfully for UserID=${whose}.`));
    logResponse(201, "Task created successfully.", reqid);
    return { status: 201, body: { task }};
  } catch (error) {
    logResponse(500, "Something went wrong.", reqid);
    return { status: 500, body: { error: "Something went wrong" } };
  }
}
