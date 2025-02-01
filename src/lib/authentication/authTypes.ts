export type userResponseType = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  isVerified: boolean;
  type: "google" | "credentials";
  createdAt: Date;
  updatedAt: Date;
};
