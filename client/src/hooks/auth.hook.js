import { loginUser, registerUser } from "../api/auth.api";
import { loginSchema, registerSchema } from "../feature/auth/auth.schema";

export function useAuth() {
  const login = async (data) => {
    loginSchema.parse(data);
    return await loginUser(data);
  };

  const register = async (data) => {
    registerSchema.parse(data);
    return await registerUser(data);
  };

  return { login, register };
}