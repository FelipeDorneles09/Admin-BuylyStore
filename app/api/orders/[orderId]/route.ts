import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  try {
    await connectToDB();

    const orderDetails = await Order.findById(params.orderId).populate({
      path: "products.product",
      model: Product,
    });

    if (!orderDetails) {
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), {
        status: 404,
      });
    }

    // Arredondar o valor total para 2 casas decimais
    orderDetails.totalAmount = parseFloat(orderDetails.totalAmount.toFixed(2));

    // Buscar informações do cliente
    let customer = null;
    if (orderDetails.customerClerkId) {
      customer = await Customer.findOne({
        clerkId: orderDetails.customerClerkId,
      });
    }

    // Se não encontrar o cliente pelo clerkId, use as informações de customerInfo
    if (!customer && orderDetails.customerInfo) {
      customer = {
        name: orderDetails.customerInfo.name,
        email: orderDetails.customerInfo.email,
        phone: orderDetails.customerInfo.phone,
        cpf: orderDetails.customerInfo.cpf,
      };
    }

    // Definir o status (se não houver, considerar como "pago")
    if (!orderDetails.status) {
      orderDetails.status = "pago";
    }

    return NextResponse.json({ orderDetails, customer }, { status: 200 });
  } catch (err) {
    console.log("[orderId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
