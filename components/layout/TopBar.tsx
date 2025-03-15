"use client";

import Image from "next/image";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { navLinks } from "@/lib/constants";

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 bg-blue-2 shadow-xl lg:hidden">
      <Image src="/logo.png" alt="logo" width={150} height={70} />
      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium ${pathname === link.url ? "text-blue-1" : ""}`}
          >
            <p>{link.label}</p>
          </Link>
        ))}
      </div>
      <div className="relative flex gap-4 items-center">
        <Menu
          className="cursor-pointer md:hidden"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />
        {dropdownMenu && (
          <div className="absolute top-10 right-6 flex flex-col gap-8 p-5 bg-white shadow-xl rounded-lg">
            {navLinks.map((link) => (
              <Link
                href={link.url}
                key={link.label}
                className="flex gap-4 text-body-medium"
              >
                {link.icon}
                <p>{link.label}</p>
              </Link>
            ))}
          </div>
        )}
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              userButtonAvatarBox:
                "h-10 w-10 rounded-full border-2 border-blue-200 shadow-sm hover:border-blue-400 transition-all duration-200",
              userButtonBox: "focus:shadow-outline-blue hover:bg-blue-50",
              userButtonTrigger: "rounded-full p-0.5",
              userButtonPopoverCard:
                "shadow-lg border border-gray-100 rounded-lg overflow-hidden",
              userButtonPopoverActionButtonIcon: "text-blue-600",
              userButtonPopoverActionButtonText: "text-gray-700 font-medium",
              userButtonPopoverFooter: "border-t border-gray-100",
              userPreviewMainIdentifier: "text-gray-800 font-medium",
              userPreviewSecondaryIdentifier: "text-gray-500 text-sm",
            },
            variables: {
              colorPrimary: "#2563eb", // azul que combina com o esquema do site
              colorBackground: "#ffffff",
              colorText: "#374151",
              colorTextSecondary: "#6b7280",
              fontFamily: "inherit",
              borderRadius: "0.5rem",
            },
          }}
        />
      </div>
    </div>
  );
};

export default TopBar;
