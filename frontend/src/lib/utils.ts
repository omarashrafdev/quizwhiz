import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateToken(token: string | null) {
  if (!token) return false;

  try {
    const decodedToken = jwtDecode<{ exp: number }>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};