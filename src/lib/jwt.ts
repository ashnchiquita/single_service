import { SignJWT, jwtVerify } from "jose";

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function signJWT(
  payload: { sub: string },
  options: { expiresIn: string }
) {
  try {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(options.expiresIn)
      .setIssuedAt()
      .setSubject(payload.sub)
      .sign(jwtSecret);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function verifyJWT(token: string) {
  try {
    const verifiedPayload = (await jwtVerify(token, jwtSecret)).payload;
    if (!verifiedPayload.sub) {
      throw new Error("Invalid token");
    }
    return verifiedPayload.sub;
  } catch (err) {
    console.error(err);
    throw new Error("Expired token");
  }
}
