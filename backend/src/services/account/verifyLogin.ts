import { verifyPassword } from "../../utils/hashPass";
import { prisma } from "../../lib/prisma";
import { createToken } from "./handToken";
import { logResponse } from "../../utils/logProcess";
import { log } from "console";
import chalk from "chalk";

export async function verifyLogin(
  email: string,
  password: string,
  reqid: number
) {
  try {
    if (!email || !password) {
      logResponse(400, "Email or password missing.", reqid);
      return { status: 400, body: { error: "Missing required fields" } };
    }
    console.log(
      chalk.yellow(
        `[${new Date().toISOString()}][ReqID=${reqid}] Login Attempt: Email=${email}, Password=[HIDDEN]`
      )
      
    );
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logResponse(404, "User not found.", reqid);
      return { status: 404, body: { error: "User not found" } };
    }

    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] User found: UserID=${user.id}, Email=${user.email}`
      )
      
    );
    
    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      logResponse(401, "Wrong password.", reqid);
      return { status: 401, body: { error: "Invalid credentials" } };
    }
    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] Password verified for UserID=${user.id}`
      )
    );

    const token = await createToken(user.id, reqid);
    logResponse(200, "Login successful.", reqid);
    return {
      status: 200,
      body: { id: user.id, name: user.name, email: user.email, token },
    };
  } catch (error) {
    logResponse(500, "Something went wrong during login.", reqid);
    return { status: 500, body: { error: "Something went wrong" } };
  }
}
