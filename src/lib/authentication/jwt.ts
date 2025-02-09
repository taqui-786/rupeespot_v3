import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const DEFAULT_SIGN_OPTION: SignOptions = {
  expiresIn: 60 * 60 * 24 * 30,
};

export const signJwt = (
  payload: JwtPayload,
  option: SignOptions = DEFAULT_SIGN_OPTION
) => {
  const secretKey = process.env.JWT_USER_ID_SECRET!;
  const token = jwt.sign(payload, secretKey, option);
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