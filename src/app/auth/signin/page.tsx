

import LoginUserForm from "@/components/forms/LoginUserForm";
import { authOpitions } from "@/lib/authentication/AuthOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";



export const metadata: Metadata = {
  title:{
    absolute:'Sign-in'
  },
description:'Welcome back to rupeespot .'
}
type Props = {
  searchParams:{
    callbackUrl?:string
  }
};

// LOGIN USER PAGE 

const page: React.FC<Props> = async props => {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOpitions)
  if(session?.user){
    if(searchParams.callbackUrl){

      return redirect(`/${searchParams.callbackUrl}`)
    }else{

      return notFound()
    }
  }

  return (
    <div className="grid place-content-center h-[calc(100vh-65px)] w-full">
      <LoginUserForm callbackUrl={searchParams.callbackUrl as string} />
    </div>
  );
};
export default page;