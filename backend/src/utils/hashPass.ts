import bcrypt from "bcrypt";

export async function hashPass(password: string) {
  const saltRounds = 12;

  try {
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to hash password");
  }
}

export async function verifyPassword(password: string, hashed: string){
  return await bcrypt.compare(password, hashed);
}