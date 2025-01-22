import {
  LayoutDashboard,
  Shapes,
  ShoppingBag,
  Tag,
  UsersRound,
} from "lucide-react";

export const navLinks = [
  {
    url: "/",
    icon: <LayoutDashboard />,
    label: "Painel",
  },
  {
    url: "/collections",
    icon: <Shapes />,
    label: "Coleções",
  },
  {
    url: "/categories",
    icon: <Shapes />,
    label: "Categorias",
  },
  {
    url: "/aboutus",
    icon: <UsersRound />,
    label: "Sobre nós",
  },
  {
    url: "/products",
    icon: <Tag />,
    label: "Produtos",
  },
  {
    url: "/orders",
    icon: <ShoppingBag />,
    label: "Pedidos",
  },
  {
    url: "/customers",
    icon: <UsersRound />,
    label: "Clientes",
  },
];
