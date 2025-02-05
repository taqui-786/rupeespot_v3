
import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import Image from "next/image";
import MyLogo from "../../../public/MyLogo.png";
import NavbarLoginBtn from "./NavbarLoginBtn";
import ThemeSwitch from "../ThemeSwitch";
import Logo from "@/app/Logo";
import FramerWrapper from "../Animations/FramerWrapper";

import { SearchIcon } from "../Animations/Icons";

type Props = {
  };

const Navbar: React.FC<Props> = ({  }) => {
  return (
    <FramerWrapper y={-155}>
    <div className="bg-transparent sticky z-40 top-0 inset-x-0 h-16">
      <header className="relative bg-card">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 justify-between items-center">
              <div className="ml-4 flex gap-1 sm:gap-3  items-center justify-start lg:ml-0">
                <Link href="/" className="flex ">
                  <Image src={MyLogo} alt="Logo" className="h-14 w-14 block " />
                <Logo/>
                </Link>
                {/* <NavbarNavigationMenu/> */}
                
              </div>
              <div className=" mr-1 md:mr-4 md:gap-2 flex items-center">
              <SearchIcon/>
           
                <ThemeSwitch />
              
                <NavbarLoginBtn/>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
    </FramerWrapper>
  );
};
export default Navbar;