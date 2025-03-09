import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { customerInfo, shippingAddress, items, totalAmount } =
      await req.json();

    if (!customerInfo || !items || !totalAmount) {
      return new NextResponse(
        JSON.stringify({ message: "Dados incompletos" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    await connectToDB();

    // Verificar se existe um usuário autenticado pelo clerkId
    let customerClerkId = "";

    if (customerInfo.clerkId) {
      // Se o usuário estiver autenticado, use o ID existente
      customerClerkId = customerInfo.clerkId;

      // Verificar se o cliente já existe no banco
      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });

      if (!customer) {
        // Se o cliente não existir, crie um novo com o ID do Clerk
        customer = new Customer({
          clerkId: customerInfo.clerkId,
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          cpf: customerInfo.cpf,
          orders: [], // Iniciar com array vazio
        });
        await customer.save();
      }
    } else {
      // Para usuários não autenticados, crie um ID anônimo único
      // Prefixo PIX_ para identificar que é um pedido PIX de usuário anônimo
      customerClerkId = "PIX_GUEST_" + Date.now().toString();
    }

    // Criar um novo pedido usando o ID do cliente (autenticado ou anônimo)
    const newOrder = new Order({
      customerClerkId: customerClerkId,
      products: items,
      shippingAddress,
      shippingRate: "PIX_SHIPPING",
      totalAmount,
      status: "pendente",
      paymentMethod: "pix",
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        cpf: customerInfo.cpf,
      },
    });

    await newOrder.save();

    // Se for um usuário autenticado, adicione o pedido à lista de pedidos do cliente
    if (customerInfo.clerkId) {
      await Customer.findOneAndUpdate(
        { clerkId: customerInfo.clerkId },
        { $push: { orders: newOrder._id } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        orderId: newOrder._id,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err) {
    console.log("[pix_order_POST]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export const dynamic = "force-dynamic";
