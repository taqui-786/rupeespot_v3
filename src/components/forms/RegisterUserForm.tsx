"use client";

import * as React from "react";

import { Button } from "../ui/button";
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

import { cn } from "@/lib/utils";
import bcrypt from "bcryptjs";
import {
  RegisterCredentialsValidator,
  TypeRegisterCredentialsValidator,
} from "@/lib/Validators";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getUserByEmail } from "@/lib/actions/authActions";
import GoogleLoginBtn from "@/components/forms/GoogleLoginBtn";
import { useRegisterUser } from "@/lib/authentication/AuthApis";
export function RegisterUserForm() {
  const { mutateAsync: RegisterUser} = useRegisterUser();
  const router = useRouter();
  // REGISTER USER FUNCTION
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TypeRegisterCredentialsValidator>({
    resolver: zodResolver(RegisterCredentialsValidator),
  });

  // ON SUBMIT FUNCTION
  const processForm = async ({
    firstname,
    lastname,
    email,
    password,
  }: TypeRegisterCredentialsValidator) => {
    try {
      const emailExists = await getUserByEmail(email);

      if (emailExists) {
        toast.info("Email Already Exists !");
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await RegisterUser(
        {
          firstname,
          lastname,
          email,
          password: hashedPassword,
        },
        {
          onSuccess: () => {
            toast.success("Verification email sent!");
            router.push("/auth/sent");
          },
          onError: () => {
            toast.error("Internal Server Error");
          },
        }
      );
    } catch (error) {
      console.log("Sign-up Error" + error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="space-y-0 p-2">
        <div className="w-full grid place-content-center">
          <Image src={Logo} alt="logo" height={125} width={125} priority />
        </div>
        <CardTitle className="text-2xl text-center">
          Create your account
        </CardTitle>
        <CardDescription className="text-center text-sm">
          Fill all the credentials below to create your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(processForm)}>
        <CardContent className="grid gap-4 p-2 ">
          <div className=" flex gap-1">
            <div className="flex-1 grid gap-2">
              <Label htmlFor="fullname">First name</Label>
              <Input
                {...register("firstname")}
                className={cn({
                  "focus-visible:ring-red-500": errors.firstname,
                })}
                id="fullname"
                placeholder="John"
                type="text"
                required={true}
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isSubmitting}
              />
              <p className="w-full text-center text-xs font-medium text-red-500">
                {errors.firstname && errors.firstname?.message}
              </p>
            </div>
            <div className="flex-1 grid gap-2">
              <Label htmlFor="lastname">Last name</Label>
              <Input
                {...register("lastname")}
                className={cn({
                  "focus-visible:ring-red-500": errors.lastname,
                })}
                id="lastname"
                placeholder="Doe"
                type="text"
                required={true}
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isSubmitting}
              />
              <p className="w-full text-center text-xs font-medium text-red-500">
                {errors.lastname && errors.lastname?.message}
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              className={cn({ "focus-visible:ring-red-500": errors.email })}
              placeholder="johndoe@gmail.com"
              type="email"
              required={true}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              className={cn({ "focus-visible:ring-red-500": errors.password })}
              {...register("password")}
              id="password"
              type="password"
              placeholder="******"
              required={true}
            />
            <p className="w-full text-center text-xs font-medium text-red-500">
              {errors.password && errors.password?.message}
            </p>
          </div>
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 text-card animate-spin" />
            ) : (
              "Create your account"
            )}
          </Button>
        </CardContent>
      </form>

      <CardFooter className="grid gap-4 p-2 pt-0">
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

        <GoogleLoginBtn myCallbackUrl={"/"} />
        <Link
          href="/auth/signin"
          className=" w-full text-center text-xs text-primary underline hover:text-black"
        >
          Already have an account?
        </Link>
      </CardFooter>
    </Card>
  );
}
