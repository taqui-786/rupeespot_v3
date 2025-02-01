import { RegisterUserForm } from "@/components/forms/RegisterUserForm";
import { authOpitions } from "@/lib/authentication/AuthOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

type Props = {};

const page: React.FC<Props> = async ({}) => {
  const session = await getServerSession(authOpitions);
  if (session?.user) return notFound();
  return (
    <div className="grid place-content-center h-dvh w-full">
      <RegisterUserForm />
    </div>
  );
};
export default page;
