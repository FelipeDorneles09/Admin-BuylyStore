import Customer from "../models/Customer";
import Order from "../models/Order";
import { connectToDB } from "../mongoDB";

export const getTotalSales = async () => {
  await connectToDB();
  // Filtrar apenas pedidos com status "pago"
  const orders = await Order.find({ status: "pago" });
  const totalOrders = orders.length;
  const totalRevenue = orders
    .reduce((acc, order) => acc + order.totalAmount, 0)
    .toFixed(2); // Formatando para 2 casas decimais
  return { totalOrders, totalRevenue };
};

export const getTotalCustomers = async () => {
  await connectToDB();
  const customers = await Customer.find();
  const totalCustomers = customers.length;
  return totalCustomers;
};

export const getSalesPerMonth = async () => {
  await connectToDB();
  // Também filtrar por status "pago" aqui
  const orders = await Order.find({ status: "pago" });
  const salesPerMonth = orders.reduce((acc, order) => {
    const monthIndex = new Date(order.createdAt).getMonth();
    acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;

    return acc;
  }, {});

  const graphData = Array.from({ length: 12 }, (_, i) => {
    const month = new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(
      new Date(2021, i, 1)
    );
    return {
      name: month,
      sales: (salesPerMonth[i] || 0).toFixed(2), // Formatando para 2 casas decimais
    };
  });

  return graphData;
};
