import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  try {
    await connectToDB();

    // Manter o nome do parâmetro como customerId para compatibilidade
    const orders = await Order.find({
      customerClerkId: params.customerId,
    }).populate({ path: "products.product", model: Product });

    if (!orders || orders.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Retornar diretamente os pedidos sem processamento adicional
    // para manter compatibilidade com o código existente
    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.log("[customerId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
