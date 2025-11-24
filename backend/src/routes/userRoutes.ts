import { Router } from "express";
import { createAccount } from "../services/account/createAccount"
import { verifyLogin } from "../services/account/verifyLogin"
import { authasync } from "../middleware/auth"
import { changeName } from "../services/account/changeName";
import { changePassword } from "../services/account/changePassword";
import { changeEmail } from "../services/account/changeEmail";

const router = Router();

router.get("/", (req, res) => {
  res.status(405).json({ error: "Endpoint not available -- You cannot view all users!" });
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body
  const result = await createAccount(name, email, password);
  res.status(result.status).json(result.body);
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  const result = await verifyLogin(email, password);
  res.status(result.status).json(result.body);
});

router.get("/me", authasync, (req, res) => {
  const {id, name, email, creation} = req.user!;
  res.status(200).json({id, name, email, creation});
})  

router.patch("/me/name", authasync, async (req, res) => {
  const result = await changeName(req.body.name, req.user!.id);
  res.status(result.status).json(result.body);
})

router.patch("/me/password", authasync, async (req, res) => {
  const result = await changePassword(req.body.enteredPassword, req.body.newPassword , req.user!.password, req.user!.id);
  res.status(result.status).json(result.body);
});

router.patch("/me/email", authasync, async (req, res) => {
  const result = await changeEmail(req.body.enteredPassword, req.body.newEmail , req.user!.password, req.user!.id);
  res.status(result.status).json(result.body);
});


export default router;