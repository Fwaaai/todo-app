import { verifyPassword } from "../../utils/hashPass"
import { prisma } from "../../lib/prisma"
import { createToken } from "./handToken"

export async function verifyLogin(email: string, password: string) {
  try {
    if (!email || !password) {
      return {status: 400, body: {error: "Missing required fields" }}
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
      return {status: 404, body: {error: "User not found" }}
    }  

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return {status: 401, body: {error: "Invalid credentials" }}
    }

    const token = await createToken(user.id);
    return {status: 200, body: {id: user.id, name: user.name, email: user.email, token}}
  } catch (error) {
    return {status: 500, body: {error: "Something went wrong" }}
  }
}