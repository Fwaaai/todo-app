import e, { Router } from "express";
import { createAccount } from "../services/account/createAccount"
import { verifyLogin } from "../services/account/verifyLogin"
import { authasync } from "../middleware/auth"
import { changeName } from "../services/account/changeName";
import { changePassword } from "../services/account/changePassword";
import { changeEmail } from "../services/account/changeEmail";
import { logResponse } from "../utils/logProcess";
import { deleteAccount } from "../services/account/deleteAccount";
import { endProcessID } from "../middleware/processID";
import chalk from "chalk";
const router = Router();

router.get("/", (req, res) => {
  res.status(405).json({ error: "Endpoint not available -- You cannot view all users!" });
});

router.post("/", async (req, res) => {
  const { name, email, password} = req.body
  const reqid = req.reqid!;
  if (!name || !email || !password) {
    logResponse(400, "Name, email, or password missing.", reqid);
    endProcessID(reqid);
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  const result = await createAccount(name, email, password, reqid);
  if ("token" in result.body) {
    const { token, ...userData } = result.body;
    res.cookie('auth_token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 24 * 60 * 60 * 1000 
    });
    console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}]`), "Setting cookie successful");
    res.status(result.status).json({ ...userData});
  } else {
    res.status(result.status).json(result.body);
  }
  endProcessID(reqid);
})

router.post("/logout", (req, res) => {
  const reqid = req.reqid!;
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}] Cleared auth cookie, user logged out.`));
  endProcessID(reqid);
  res.status(200).json({ message: "Logged out" });
});

router.post("/login", async (req, res) => {
  const { email, password} = req.body
  const reqid = req.reqid!;
  if (!email || !password) {
    logResponse(400, "Email or password missing.", reqid);
    endProcessID(reqid);
    return res.status(400).json({ error: "Email and password are required." });
  }
  const result = await verifyLogin(email, password, reqid);
  if ("token" in result.body) {
    const { token, ...userData } = result.body;
    res.cookie('auth_token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 24 * 60 * 60 * 1000 
    });
    console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${reqid}]`), "Setting cookie successful");
    res.status(result.status).json({ ...userData});
  } else {
    res.status(result.status).json(result.body);
  }
  endProcessID(reqid);
});

router.get("/me", authasync, (req, res) => {
  
  if (!req.user) {
    console.log(chalk.red(`[${new Date().toISOString()}][ReqID=${req.reqid}] 401: User not found or not authenticated.`));
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] Fetching profile data for UserID=${req.user!.id}.`));
  const {id, name, email, creation} = req.user!;
  console.log(chalk.green(`[${new Date().toISOString()}][ReqID=${req.reqid}] 200: Returning profile data for UserID=${id}`));
  endProcessID(req.reqid!);
  res.status(200).json({id, name, email, creation});
})  

router.post("/me/delete", authasync, async (req, res) => {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] User account deletion for UserID=${req.user!.id}.`));
  const result = await deleteAccount(req.body.enteredPassword, req.user!.password, req.user!.id, req.reqid!);
  endProcessID(req.reqid!);
  res.status(result.status).json(result.body);
});

router.patch("/me/name", authasync, async (req, res) => {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] Received request to change name for UserID=${req.user!.id}.`));
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] New name: ${req.body.name}`));
  const result = await changeName(req.body.name, req.user!.id, req.reqid!);
  endProcessID(req.reqid!);
  res.status(result.status).json(result.body);
})

router.patch("/me/password", authasync, async (req, res) => {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] Received request to change password for UserID=${req.user!.id}.`));
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] New password: [HIDDEN]`));
  const result = await changePassword(req.body.enteredPassword, req.body.newPassword , req.user!.password, req.user!.id, req.reqid!);
  endProcessID(req.reqid!);
  res.status(result.status).json(result.body);
});

router.patch("/me/email", authasync, async (req, res) => {
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] Received request to change email for UserID=${req.user!.id}.`));  
  console.log(chalk.blue(`[${new Date().toISOString()}][ReqID=${req.reqid}] New email: ${req.body.newEmail}`));
  // was enabled for debugging, not recommended console.log(chalk.gray(`[${new Date().toISOString()}][ReqID=${req.reqid}] Args: ${req.body.enteredPassword}, ${req.body.newEmail}, ${req.user!.password}, ${req.user!.id}.`));
  const result = await changeEmail(req.body.enteredPassword, req.body.newEmail , req.user!.password, req.user!.id, req.reqid!);
  endProcessID(req.reqid!);
  res.status(result.status).json(result.body);
});
router.use((req, res, next) => {
  console.log(chalk.red(`[${new Date().toISOString()}][ReqID=${req.reqid}] 404: Route not found or method not allowed.`));
  endProcessID(req.reqid!);
  res.status(404).send('Route not found or method not allowed.');
});


export default router;
