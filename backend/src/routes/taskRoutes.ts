import { Router } from "express";
import { authasync } from "../middleware/auth"
import { logResponse } from "../utils/logProcess";
import chalk from "chalk";
import { newTask } from "../services/tasks/newTask"
import { endProcessID } from "../middleware/processID";
import { deleteTask } from "../services/tasks/deleteTask";
import { getTasks } from "../services/tasks/getTasks";
import { toggleDone } from "../services/tasks/toggleDone";
const router = Router();

// create task

router.post("/", authasync, async (req, res) => {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] Received request to create task for UserID=${req.user!.id}.`));
  const result = await newTask(req.body.title, req.body.content, req.user!.id, req.reqid!);
  endProcessID(req.reqid!);
  res.status(result.status).json(result.body);
})

// delete task 
router.post("/delete", authasync, async (req, res) => {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] Received request to delete task {${req.body.id}} for UserID=${req.user!.id}.`));
  const result = await deleteTask(req.body.id, req.user!.id, req.reqid!);
  endProcessID(req.reqid!);
  res.status(result.status).json(result.body);
})


// get tasks by user id and sort them by internal id
router.get("/", authasync, async (req, res) => {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] Received request to get tasks for UserID=${req.user!.id}.`));
  const result = await getTasks(req.user!.id, req.reqid!);
  endProcessID(req.reqid!);
  res.status(result.status).json(result.body);
})

router.patch("/toggle", authasync, async (req, res) => {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] Received request to toggle task {${req.body.id}} for UserID=${req.user!.id}.`));
  const result = await toggleDone(req.body.id, req.user!.id, req.reqid!);
  endProcessID(req.reqid!);
  res.status(result.status).json(result.body);
})

export default router;
