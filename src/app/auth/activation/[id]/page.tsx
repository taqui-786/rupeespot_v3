import { activateUser } from "@/lib/actions/authActions";
import Image from "next/image";
import img from "../../../../../public/activatedAccount.png";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Metadata } from "next";
type Props = {
  params: {
    id: string;
  };
};
export const metadata: Metadata = {
  title: {
    absolute: "Account Verify",
  },
  description:
    "Rupeespot - Your Ultimate Destination for Affordable Deals Products.",
    robots:{
      index:false,
      nocache:true,
  }
};
const page: React.FC<Props> = async props => {
  const params = await props.params;
  const result = await activateUser(params.id);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <div className="max-w-md w-full bg-background rounded-lg  p-8 text-center">
        <Image
          src={img}
          alt="activatedImg"
          loading="eager"
          priority
          className="max-h-48 md:max-h-72 w-auto mx-auto mb-6"
        />
        
        <div className="space-y-4">
          {result === "NoUserExists" ? (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <h2 className="text-xl font-semibold text-red-600 mb-1">Account Not Found</h2>
              <p className="text-red-500">We couldn&apos;t find your account in our system.</p>
            </div>
          ) : result === "alreadyActivated" ? (
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <h2 className="text-xl font-semibold text-yellow-600 mb-1">Already Activated</h2>
              <p className="text-yellow-500">Your account has already been activated.</p>
            </div>
          ) : result === "Success" ? (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <h2 className="text-xl font-semibold text-green-600 mb-1">Success!</h2>
              <p className="text-green-500">Your account has been successfully activated.</p>
            </div>
          ) : null}
          
          <Link 
            href="/auth/signin" 
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full mt-6 transition-all hover:scale-105"
            )}
          >
            Continue to Sign In
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default page;