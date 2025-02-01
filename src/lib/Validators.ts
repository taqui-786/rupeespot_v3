import { z } from "zod";

 // REGISTER USER CREDENTIALS VALIDATOR
export  const RegisterCredentialsValidator = z.object({
    firstname: z.string().min(3, {message:" At least 3 character"}),
    lastname: z.string().min(2, {message:"At least 2 character"}),
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

 export  type TypeRegisterCredentialsValidator = z.infer<typeof RegisterCredentialsValidator>;
 // REGISTER USER CREDENTIALS VALIDATOR
export  const LoginCredentialsValidator = z.object({
    email: z.string().email({
      message:"Email is required"
    }),
    password: z.string().min(6, {
      message: "Password should be at least 6 digit",
    }),
  });

 export  type TypeLoginCredentialsValidator = z.infer<typeof LoginCredentialsValidator>;