"use client";

import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/lib/constants";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-blue-2 shadow-xl max-lg:hidden">
      <Image src="/logo.png" alt="logo" width={150} height={70} />
      <div className="flex flex-col gap-12">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium ${pathname === link.url ? "text-blue-1" : ""}`}
          >
            {link.icon}
            <p>{link.label}</p>
          </Link>
        ))}
      </div>
      <div className="flex gap-4 text-body-medium items-center">
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
        <p>Editar Perfil</p>
      </div>
    </div>
  );
};

export default LeftSideBar;
