"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function Header() {
  const header = ["Cartier", "Omega", "Audemars Piguet", "Breitling", "Piaget", "Patek Phillipe"]
  return (
    <>
      <NavigationMenu className="block w-full min-w-full max-w-full">
        <NavigationMenuList className="bg-darkblack justify-start items-start md:justify-between flex-col md:flex-row w-full">
          <NavigationMenuItem></NavigationMenuItem>

          {header && header.map((value, index) => (
            <NavigationMenuItem key={index}>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={
                    navigationMenuTriggerStyle() +
                    " bg-darkblack text-white hover:bg-darkblack hover:text-white focus:bg-darkblack focus:text-white navigation-menu-link relative"
                  }
                >
                  {value}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
          
          
          <NavigationMenuItem></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}
