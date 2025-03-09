import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Função para lidar com requisições OPTIONS (preflight)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, newStatus } = await req.json();

    if (!orderId) {
      return new NextResponse(
        JSON.stringify({ message: "ID do pedido não fornecido" }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (!newStatus || (newStatus !== "pago" && newStatus !== "pendente")) {
      return new NextResponse(JSON.stringify({ message: "Status inválido" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    await connectToDB();

    // Buscar o pedido pelo ID
    const order = await Order.findById(orderId);

    if (!order) {
      return new NextResponse(
        JSON.stringify({ message: "Pedido não encontrado" }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    // Atualizar o status do pedido
    order.status = newStatus;

    // Se marcar como pago, atualize a data de confirmação
    if (newStatus === "pago") {
      order.paymentConfirmedAt = new Date();
    }

    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: `Status do pedido alterado para ${newStatus}`,
        status: newStatus,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err) {
    console.log("[toggle_status_POST]", err);
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
