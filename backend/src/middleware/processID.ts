import type { Request, Response, NextFunction } from "express";
import chalk from "chalk";
import e from "express";
let running: number[] = [];

export function processID(req: Request, res: Response, next: NextFunction) {
  let reqid: number;
  do {
    reqid = Math.floor(Math.random() * 100000000000);
  } while (running.includes(reqid));
  req.reqid = reqid;
  console.log(
    chalk.grey(
      `[${new Date().toISOString()}][ReqID=${reqid}] Started processing request.`
    )
  );
  running.push(reqid);
  next();
}

export function endProcessID(reqid: number) {
  running = running.filter((id) => id !== reqid);
  console.log(
    chalk.grey(
      `[${new Date().toISOString()}][ReqID=${reqid}] Finished processing request.`
    )
  );
  console.log(
    chalk.grey(
      `[${new Date().toISOString()}][ReqID=${reqid}] Current running processes: [${running.join(", ")}]`
    )
  );
}