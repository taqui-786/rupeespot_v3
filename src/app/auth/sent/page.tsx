import { Metadata } from 'next';
import img from '../../../../public/emailSent.png'
import Image from "next/image";
type Props = {};
export const metadata: Metadata = {
  title:{
    absolute:'Email Sent'
  },
  description:'Rupeespot - Your Ultimate Destination for Affordable Deals Products.',
  robots:{
    index:false,
    nocache:true,
}
  }
const page: React.FC<Props> = ({}) => {
  return (
      <div className="p-2 centerIt flex flex-col gap-4 items-center"> 
        <div className="">
        <h2 className="text-2xl font-bold text-center text-gray-900">Check Your Email</h2>
        <p className="text-gray-500 text-center mt-2">We&apos;ve sent a magic link to your email address</p>
        </div>
        <Image 
          src={img} 
          alt="activatedImg" 
          loading="eager" 
          priority 
          className="max-w-64 md:max-w-96 w-auto"
        />
      </div>
  );
};
export default page;