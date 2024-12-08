import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Definindo as rotas públicas, incluindo as rotas da API e rotas de login
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/:path*", // Rota da API também é pública
]);

export default clerkMiddleware((auth, request) => {
  // Se a rota não for pública, protege a rota
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Ignora arquivos estáticos e internos do Next.js
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Sempre aplica middleware para rotas de API e TRPC
    "/(api|trpc)(.*)",
  ],
};
