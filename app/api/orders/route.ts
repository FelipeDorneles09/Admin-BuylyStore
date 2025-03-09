import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";

import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const orders = await Order.find().sort({ createdAt: "desc" });

    const orderDetails = await Promise.all(
      orders.map(async (order) => {
        // Verificar se o customerClerkId existe e buscar o cliente
        let customerName = "Cliente não identificado";

        if (order.customerClerkId) {
          const customer = await Customer.findOne({
            clerkId: order.customerClerkId,
          });

          if (customer && customer.name) {
            customerName = customer.name;
          } else if (order.customerInfo && order.customerInfo.name) {
            // Se não encontrar o cliente, use as informações do customerInfo
            customerName = order.customerInfo.name;
          }
        }

        // Arredondar o valor total para 2 casas decimais
        const roundedTotal = parseFloat(order.totalAmount.toFixed(2));

        // Definir o status (se não houver, considerar como "pago")
        const status = order.status || "pago";

        return {
          _id: order._id.toString(),
          customer: customerName,
          products: order.products.length,
          totalAmount: roundedTotal,
          status: status,
          createdAt: format(new Date(order.createdAt), "MMM do, yyyy"),
        };
      })
    );

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (err) {
    console.log("[orders_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
