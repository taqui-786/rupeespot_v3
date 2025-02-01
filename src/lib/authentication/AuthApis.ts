import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const API_KEY = process.env.NEXT_PUBLIC_APP_API_KEY;

// Types
interface RegisterUserDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

// API endpoints
const authEndpoints = {
  register: "/api/user",
  login: "/api/auth/login",
};

// Query tags for cache management
export const AUTH_TAGS = {
  auth: "auth",
  user: "user",
} as const;

// Register mutation hook
export const useRegisterUser = () => {
  return useMutation({
    mutationKey: [AUTH_TAGS.auth, "register"],
    mutationFn: async (userData: RegisterUserDto) => {
      const { data } = await axios.post<RegisterUserResponse>(
        authEndpoints.register,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY,
          },
        }
      );
      return data;
    },
 
  });
};

// Usage example in component:
/*
const RegisterComponent = () => {
  const register = useRegisterUser();
  
  const handleRegister = async (formData: RegisterUserDto) => {
    try {
      const user = await register.mutateAsync(formData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
};
*/
