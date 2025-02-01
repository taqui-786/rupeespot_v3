import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { verifyJwt } from "@/lib/authentication/jwt";
import { Metadata } from "next";
import { notFound } from "next/navigation";


export const metadata: Metadata = {
    title:{
        absolute:'Change Password'
      },
    description:'Rupeespot - Your Ultimate Destination for Affordable Deals Products.',
    robots:{
        index:false,
        nocache:true,
    }
    }

type Props = {
    params:{
        jwt:string
    }
};

const page:React.FC<Props> = async props => {
    const params = await props.params;

    const payload = verifyJwt(params.jwt)
    if(!payload) {
        return notFound()
    }

    return <ResetPasswordForm jwtUserId={params.jwt }/>
};
export default page;