import { SignIn } from "@clerk/nextjs";
import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-blue-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">
              Bem-vindo(a) de volta
            </h1>
            <p className="text-indigo-100 mt-2">
              Entre para continuar sua jornada
            </p>
          </div>

          <div className="p-6">
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary:
                    "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
                  footerActionLink: "text-blue-600 hover:text-blue-700",
                  card: "shadow-none",
                },
              }}
            />
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm">
          <p>© 2025 Seu Site. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
