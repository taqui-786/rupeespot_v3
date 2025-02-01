

import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:{
    absolute:'Forgot Password'
  },
  description:'Rupeespot - Your Ultimate Destination for Affordable Deals Products.',
  robots:{
    index:false,
    nocache:true,
}
}
type Props = {};

const page: React.FC<Props> = ({}) => {
 
  return (
    <div className="centerIt">
      <Card className="w-[355px] sm:min-w-[370px]">
       <ForgotPasswordForm/>
      </Card>
    </div>
  );
};
export default page;
