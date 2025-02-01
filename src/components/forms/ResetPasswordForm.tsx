"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { resetPassword } from "@/lib/actions/authActions";


type Props = {
  jwtUserId: string;
};

const FormSchema = z
  .object({
    password: z
      .string()
      .min(6, "password must be at least 6 characters!")
      .max(52, "Password Not More Than 52 characters!"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match !",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

const ResetPasswordForm: React.FC<Props> = ({ jwtUserId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  const router = useRouter();
  const processForm: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await resetPassword(jwtUserId, data.password);
      if (result === "success") {
        toast.success("Password changed successfully");
        reset();
      }
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <Card className="w-[355px] sm:min-w-[370px] centerIt">
      <form onSubmit={handleSubmit(processForm)}>
        <CardHeader>
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>
            Enter your new 6 digit password carefully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">New Password</Label>
              <Input
                {...register("password")}
                className={cn({
                  "focus-visible:ring-red-500": errors.password,
                })}
                id="password"
                type="password"
                placeholder="Enter your new password"
              />
              <p className="w-full text-center text-xs font-medium text-red-500">
                {errors.password && errors.password?.message}
              </p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                {...register("confirmPassword")}
                className={cn({
                  "focus-visible:ring-red-500": errors.confirmPassword,
                })}
                id="confirmPassword"
                type="password"
                placeholder="Enter your password again"
              />
              <p className="w-full text-center text-xs font-medium text-red-500">
                {errors.confirmPassword && errors.confirmPassword?.message}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" isLoading={isSubmitting}>
            Submit
          </Button>
          {isSubmitSuccessful && (
            <Alert className="bg-green-100">
              <AlertTitle>Your Password Changed</AlertTitle>
              <AlertDescription>
                Now sign-in with your new password.
              </AlertDescription>
              <AlertDescription>
                <Link
                  href="/auth/signin"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  Sign-in
                </Link>
              </AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};
export default ResetPasswordForm;