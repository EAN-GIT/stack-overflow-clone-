import React from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "./GlobalSearch";
// ... (imports remain the same)

const Navbar = () => {
  return (
    <div>
      <nav className="fixed z-50 w-full p-6 gap-5 flex-between background-light900_dark200 shadow-light-300 dark:shadow-none sm:p-0 sm:px-12">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/site-logo.svg"
            width={23}
            height={23}
            alt="DevFlow"
          />
          <p className="max-sm:hidden h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900">
            Dev <span className="text-primary-500">OverFlow</span>
          </p>
        </Link>

        <GlobalSearch />

        <div className="flex-between gap-5">
          <Theme />

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
                variables: {
                  colorPrimary: "#ff7000",
                },
              }}
            />
          </SignedIn>

          <MobileNav />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
