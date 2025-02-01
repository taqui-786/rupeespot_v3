"use client";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/actions/authActions";
type Props = {};
const FormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});
type InputType = z.infer<typeof FormSchema>;
const ForgotPasswordForm: React.FC<Props> = ({}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });
  // for error => errors.email.message

  const processForm: SubmitHandler<InputType> = async (data) => {
    try {
      await forgotPassword(data.email);

      reset();
      toast.success("Change Password Link has been sent to your Email");
      router.push("/auth/sent");
    } catch (error) {
      console.log(error);
      toast.error("No User Exists with this email!");
    }
  };
  return (
    <form onSubmit={handleSubmit(processForm)}>
      <CardHeader>
        <CardTitle className="text-xl">Forgot Password</CardTitle>
        <CardDescription>
          Enter Your valid email address to change password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            className={cn({ "focus-visible:ring-red-500": errors.email })}
            id="email"
            type="email"
            placeholder="example@gmail.com"
            disabled={isSubmitting}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start ">
        <Button
          type={"submit"}
          isLoading={isSubmitting}
          isLoadingText="Sending..."
        >
          Confirm
        </Button>
      </CardFooter>
    </form>
  );
};
export default ForgotPasswordForm;
