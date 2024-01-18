/**
 * MobileNav Component:
 * A responsive mobile navigation component with a collapsible sidebar.
 * It includes a trigger button with a hamburger icon, a logo with a link to the home page,
 * and a list of links for navigation.
 * The navigation links are based on the sidebarLinks constant.
 * The component also includes Sign In and Sign Up buttons for users who are not signed in.
 * Utilizes the Sheet component for the collapsible sidebar.
 */
'use client'
import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { SignedOut } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constants';
import { usePathname } from 'next/navigation';

/**
 * NavContent Component:
 * Renders the navigation links based on the sidebarLinks constant.
 * Highlights the active link based on the current pathname.
 */
const NavContent = () => {
  const pathName = usePathname();

  return (
    <section className="flex h-full flex-col gap-6 pt-16">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathName.includes(item.route) && item.route.length > 1) ||
          pathName === item.route;
        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${
                isActive
                  ? 'primary-gradient rounded-lg text-light-900'
                  : 'text-dark300_light900'
              } flex items-center justify-start bg-transparent gap-4 p-4`}
            >
              <Image
                className={`${isActive ? '' : 'invert-colors'}`}
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
              />
              <p className={`${isActive ? 'base-bold' : 'base-medium'}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

/**
 * MobileNav Component:
 * Main component that renders the responsive mobile navigation.
 */
const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          alt="Menu"
          width={36}
          height={36}
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="border-none background-light900_dark200"
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/images/site-logo.svg"
            width={23}
            height={23}
            alt="DevFlow"
          />
          <p className="font-spaceGrotesk h2-bold text-dark100_light900">
            Dev <span className="text-primary-500">OverFlow</span>
          </p>
        </Link>

        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>

          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link href="/sign-in">
                  <Button className="w-full min-h-[41px] px-4 py-3 btn-secondary rounded-lg shadow-none small-medium">
                    <span className="primary-text-gradient">Log In</span>
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href="/sign-up">
                  <Button className="w-full min-h-[41px] px-4 py-3 text-dark400_light900 btn-tertiary rounded-lg shadow-none small-medium light-border-2">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;