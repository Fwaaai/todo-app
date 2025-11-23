import jwt from "jsonwebtoken";

export function createToken(id: number, email: string) {
  const token = jwt.sign({ id, email }, process.env.SECRET_KEY!, {
    expiresIn: "1d",
  });
  return token;
}
