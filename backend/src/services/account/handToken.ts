import jwt from "jsonwebtoken";

export function createToken(id: number) {
  const token = jwt.sign({ id }, process.env.SECRET_KEY!, {
    expiresIn: "1d",
  });
  return token;
}
