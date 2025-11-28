import { hashPass } from "../../utils/hashPass";
import { prisma } from "../../lib/prisma";
import { createToken } from "./handToken";

export async function createAccount(name: string, email: string, password: string) {
  try {
    if (!name || !email || !password) {
      return {status: 400, body: {error: "Missing required fields" }}
    }

    if (email.trim() === "" || password.trim() === "" || name.trim() === "") {
      return {status: 400, body: {error: "Name, email, and password cannot be empty" }}
    }

    if (email.includes("@") && email.includes(".") === false) {
      return {status: 400, body: {error: "Invalid email format" }}
    }

    if (password.length < 8) {
      return {status: 400, body: {error: "Password must be at least 8 characters long" }}
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      return {status: 400, body: {error: "Password must contain both uppercase and lowercase letters" }}
    }
    if (!/[0-9]/.test(password)) {
      return {status: 400, body: {error: "Password must include at least one number" }}
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return {status: 400, body: {error: "Password must have at least one special character" }}
    }


    const hashed = await hashPass(password);
    const creation = new Date();
    console.log(`${name}, ${email}, ${hashed}, ${creation}`);
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashed,
            creation: creation
        }
    })

    const token = createToken(user.id);

    return {status: 201, body: {id: user.id, name: user.name, email: user.email, creation: user.creation, token}}
  } catch (error: any) {
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return {status: 409, body: {error: "Email already in use" }}
    }
    return {status: 500, body: {error: "Something went wrong" }}
  }
}