export const USER_KEY = "user";

export type Role = "PROFESSOR" | "STUDENT";

export type User = {
  id: number;
  email?: string;
  role: Role;
  token: string;
  refreshToken: string;
};

export default function getApiToken(token: string | null) {
  if (token === null) {
    return null;
  }

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function isTokenValid(token?: any) {
  if (token === null) {
    return false;
  }

  const expiry = new Date(token["exp"] * 1000);
  const isValid = expiry > new Date();
  if (!isValid) {
    localStorage.removeItem(USER_KEY);
  }
  return isValid;
}

export function getUserFromStorage() {
  const user = sessionStorage.getItem(USER_KEY);
  return user ? (JSON.parse(user) as User) : null;
}
