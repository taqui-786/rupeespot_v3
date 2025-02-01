import jwt, { JwtPayload } from "jsonwebtoken";

type SignOpition = {
  expiresIn: string | number;
};

const DEFAULT_SIGN_OPITION: SignOpition = {
  expiresIn: "1d",
};

export const signJwt = (
  payload: JwtPayload,
  opition: SignOpition = DEFAULT_SIGN_OPITION
) => {
  const secretKey = process.env.JWT_USER_ID_SECRET!;
  const token = jwt.sign(payload, secretKey, opition);
  return token;
};

export function verifyJwt(token: string) {
  try {
    const secretKey = process.env.JWT_USER_ID_SECRET!;
    const decode = jwt.verify(token, secretKey);

    return decode as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}