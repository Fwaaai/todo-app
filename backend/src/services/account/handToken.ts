import jwt from "jsonwebtoken";
import type { UserPayload } from "../../types/jwt";
import type { TokenVerificationResult } from "../../types/types";
import chalk from "chalk";  
const SECRET = process.env.SECRET_KEY!;

export function createToken(id: number, reqid: number) {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Creating token for UserID=${id}`));
  const token = jwt.sign({ id }, process.env.SECRET_KEY!, {
    expiresIn: "1d",
  });
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Token created successfully for UserID=${id}`));
  return token;
}
