import { jwtDecode } from "jwt-decode";

const decodeToken = (token: string | null) => {
  if (!token || typeof token !== "string") return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

export default decodeToken;
