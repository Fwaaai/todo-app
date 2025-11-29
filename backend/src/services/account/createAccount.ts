import { hashPass } from "../../utils/hashPass";
import { prisma } from "../../lib/prisma";
import { createToken } from "./handToken";
import chalk from "chalk";
import { logResponse } from "../../utils/logProcess";

export async function createAccount(
  name: string,
  email: string,
  password: string,
  reqid: number
) {

  try {
    console.log(
      chalk.yellow(
        `[${new Date().toISOString()}][ReqID=${reqid}] User Creation Attempt: Name=${name}, Email=${email}, Password=[HIDDEN]`
      )
    );
    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] Validation Started`
      )
    );
    if (!name || !email || !password) {
      const errorMsg = "Missing required fields";
      logResponse(400, errorMsg, reqid);
      return { status: 400, body: { error: errorMsg } };
    }
    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] Fields look complete`
      )
    );

    if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
      const errorMsg = "Name, email, and password cannot be empty";
      logResponse(400, errorMsg, reqid);
      return { status: 400, body: { error: errorMsg } };
    }

    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] Name, email, and password are non-empty`
      )
    );

    if (email.includes("@") && !email.includes(".")) {
      const errorMsg = "Invalid email format";
      logResponse(400, errorMsg, reqid);
      return { status: 400, body: { error: errorMsg } };
    }
    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] Email format looks valid`
      )
    );

    if (password.length < 8) {
      const errorMsg = "Password must be at least 8 characters long";
      logResponse(400, errorMsg, reqid);
      return { status: 400, body: { error: errorMsg } };
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      const errorMsg =
        "Password must contain both uppercase and lowercase letters";
      logResponse(400, errorMsg, reqid);
      return { status: 400, body: { error: errorMsg } };
    }
    if (!/[0-9]/.test(password)) {
      const errorMsg = "Password must include at least one number";
      logResponse(400, errorMsg, reqid);
      return { status: 400, body: { error: errorMsg } };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      const errorMsg = "Password must have at least one special character";
      logResponse(400, errorMsg, reqid);
      return { status: 400, body: { error: errorMsg } };
    }
    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] Password meets complexity requirements`
      )
    );

    const hashed = await hashPass(password);
    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] Password hashed successfully`
      )
    );
    const creation = new Date();
    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] Creating user in database`
      )
    );
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        creation,
      },
    });
    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] User created with ID=${
          user.id
        }`
      )
    );

    const token = createToken(user.id, reqid);

    console.log(
      chalk.blue(
        `[${new Date().toISOString()}][ReqID=${reqid}] Handing token...`
      )
    );

    const successMsg = `User created successfully: ID=${user.id}, Name=${user.name}, Email=${user.email}`;
    logResponse(201, successMsg, reqid);

    return {
      status: 201,
      body: {
        id: user.id,
        name: user.name,
        email: user.email,
        creation: user.creation,
        token,
      },
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      const errorMsg = "Email already in use";
      logResponse(409, errorMsg, reqid);
      return { status: 409, body: { error: errorMsg } };
    }

    const errorMsg = "Something went wrong";
    logResponse(500, `${errorMsg}: ${error.message || error}`, reqid);
    return { status: 500, body: { error: errorMsg } };
  }
}
