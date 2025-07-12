import { UserRoles } from "../models"
import { generateAccessToken, generateRefreshToken } from "./jwt.util";

interface payloadType{
    id: number;
  name: string;
  email: string;
  role: string;
}

export function isValidRole(value: unknown): value is UserRoles {
  return typeof value === "string" && Object.values(UserRoles).includes(value as UserRoles);
}


export function resolveRole(value: unknown): UserRoles {
  if (isValidRole(value)) {
    return value;
  }
  throw new Error("Invalid role provided");
}



export function createToken(payload: payloadType){
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }
}