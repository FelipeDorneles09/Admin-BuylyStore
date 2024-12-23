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
    label: "Dashboard",
  },
  {
    url: "/collections",
    icon: <Shapes />,
    label: "Collections",
  },
  {
    url: "/categories",
    icon: <Shapes />,
    label: "Categories",
  },
  {
    url: "/aboutus",
    icon: <UsersRound />,
    label: "About Us",
  },
  {
    url: "/products",
    icon: <Tag />,
    label: "Products",
  },
  {
    url: "/orders",
    icon: <ShoppingBag />,
    label: "Orders",
  },
  {
    url: "/customers",
    icon: <UsersRound />,
    label: "Customers",
  },
];
