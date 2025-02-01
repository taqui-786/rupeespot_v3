import {Lilita_One} from 'next/font/google'
import { cn } from "@/lib/utils";

const lilita = Lilita_One({subsets:['latin'], weight:['400']})
type Props = {
    fontSize?:string
};

const Logo:React.FC<Props> = ({fontSize= 'text-3xl'}) => {
return(
    <span className={cn(`text-card-foreground   font-medium hidden sm:flex items-center justify-center`, lilita.className , fontSize)} >
    Rupee <span className="text-primary">Spot</span>
  </span>
)
};
export default Logo;