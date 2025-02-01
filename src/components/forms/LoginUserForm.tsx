"use client";

import * as React from "react";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Logo from "../../../public/MyLogo.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginCredentialsValidator,
  TypeLoginCredentialsValidator,
} from "@/lib/Validators";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import GoogleLoginBtn from "./GoogleLoginBtn";

type Props = {
  callbackUrl?: string;
};

const LoginUserForm: React.FC<Props> = ({ callbackUrl }) => {
  const router = useRouter();

  // LOGIN USER FUNCTION
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TypeLoginCredentialsValidator>({
    resolver: zodResolver(LoginCredentialsValidator),
  });

  // ON SUBMIT FUNCTION
  const processForm = async ({
    email,
    password,
  }: TypeLoginCredentialsValidator) => {
    try {
      const result: any = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (!result?.ok) {
        toast.info(result?.error);
        return;
      }
   

      toast.success("Welcome Back !");

      router.push(callbackUrl ? callbackUrl : "/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card className="border-none shadow-none z-50 mt-4 ">
      <CardHeader className="space-y-1 pt-0">
        <div className="w-full grid place-content-center">
          <Image src={Logo} alt="logo" height={125} width={125} priority />
        </div>
        <CardTitle className="text-2xl text-center">
          Welcome back to RupeeSpot
        </CardTitle>
        <CardDescription className="text-center">
          Fill the credentials below to Sign-in.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(processForm)}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              className={cn({ "focus-visible:ring-red-500": errors.email })}
              id="email"
              placeholder="example@gmail.com"
              type="email"
              required={true}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="flex w-full justify-between">
              <span>Password</span>{" "}
              <Link
                href="/auth/forgotpassword"
                className="text-xs text-primary"
              >
                forgot password?
              </Link>
            </Label>
            <Input
              className={cn({ "focus-visible:ring-red-500": errors.password })}
              {...register("password")}
              id="password"
              type="password"
              placeholder="******"
              required={true}
            />
            <p className="w-full text-center text-xs font-medium text-red-400">
              {errors.password && errors.password?.message}
            </p>
          </div>
          <Button type="submit" className="w-full " isLoading={isSubmitting} isLoadingText="Signing in...">
            Sign-in
          </Button>
        </CardContent>
      </form>
      <CardFooter className="grid gap-4 pb-0">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleLoginBtn myCallbackUrl={callbackUrl ? callbackUrl : "/"} />
        <Link
          href="/auth/signup"
          className=" w-full text-center text-xs text-primary underline hover:text-black"
        >
          Don&#39;t have an account?
        </Link>
      </CardFooter>
    </Card>
  );
};
export default LoginUserForm;