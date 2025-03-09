import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const POST = async (req: NextRequest) => {
  let event;

  try {
    const rawBody = await req.text();
    const signature = req.headers.get("Stripe-Signature");

    if (!signature) {
      console.error("[webhooks_POST] Assinatura do Stripe ausente");
      return new NextResponse("Webhook Error: Assinatura ausente", {
        status: 400,
      });
    }

    // Verificar a assinatura do evento
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error(
        `[webhooks_POST] Erro na verificação da assinatura: ${err.message}`
      );
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log(`[webhooks_POST] Evento recebido: ${event.type}`);

    // Processar apenas eventos de checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session: any = event.data.object;

      try {
        // Conectar ao banco de dados
        await connectToDB();

        // Verificar se o pedido já existe
        const existingOrder = await Order.findOne({
          "metadata.stripeSessionId": session.id,
        });

        if (existingOrder) {
          console.log(
            `[webhooks_POST] Pedido já existe para a sessão ${session.id}`
          );

          // Garantir que o status é "pago" mesmo se o pedido já existe
          if (existingOrder.status !== "pago") {
            existingOrder.status = "pago";
            existingOrder.paymentConfirmedAt = new Date();
            await existingOrder.save();
            console.log(
              `[webhooks_POST] Status do pedido atualizado para "pago": ${existingOrder._id}`
            );
          }

          return new NextResponse("Order already exists", { status: 200 });
        }

        // Obter detalhes completos da sessão
        const retrieveSession = await stripe.checkout.sessions.retrieve(
          session.id,
          { expand: ["line_items.data.price.product"] }
        );

        if (!retrieveSession.line_items || !retrieveSession.line_items.data) {
          console.error(
            "[webhooks_POST] Não foi possível recuperar os itens da sessão"
          );
          return new NextResponse("Could not retrieve session items", {
            status: 500,
          });
        }

        const lineItems = retrieveSession.line_items.data;

        // Mapear os itens do pedido
        const orderItems = lineItems.map((item: any) => {
          return {
            product: item.price.product.metadata.productId,
            color: item.price.product.metadata.color || "N/A",
            size: item.price.product.metadata.size || "N/A",
            quantity: item.quantity,
          };
        });

        const customerInfo = {
          clerkId: session.client_reference_id,
          name:
            session.customer_details?.name || session.metadata?.customerName,
          email:
            session.customer_details?.email || session.metadata?.customerEmail,
        };

        const shippingAddress = {
          street: session.shipping_details?.address?.line1 || "",
          city: session.shipping_details?.address?.city || "",
          state: session.shipping_details?.address?.state || "",
          postalCode: session.shipping_details?.address?.postal_code || "",
          country: session.shipping_details?.address?.country || "BR",
        };

        // Criar o novo pedido - SEMPRE definindo status como "pago" para pagamentos Stripe
        const newOrder = new Order({
          customerClerkId: customerInfo.clerkId,
          products: orderItems,
          shippingAddress,
          shippingRate: session.shipping_cost?.shipping_rate,
          totalAmount: session.amount_total ? session.amount_total / 100 : 0,
          status: "pago", // Garantir que pedidos da Stripe sempre tenham status "pago"
          paymentMethod: "stripe",
          paymentConfirmedAt: new Date(),
          metadata: {
            stripeSessionId: session.id,
          },
        });

        await newOrder.save();
        console.log(`[webhooks_POST] Novo pedido criado: ${newOrder._id}`);

        // Atualizar ou criar o cliente
        let customer = await Customer.findOne({
          clerkId: customerInfo.clerkId,
        });

        if (customer) {
          customer.orders.push(newOrder._id);
          await customer.save();
        } else if (customerInfo.clerkId) {
          customer = new Customer({
            clerkId: customerInfo.clerkId,
            name: customerInfo.name,
            email: customerInfo.email,
            orders: [newOrder._id],
          });
          await customer.save();
          console.log(`[webhooks_POST] Novo cliente criado: ${customer._id}`);
        } else {
          console.log("[webhooks_POST] Cliente sem clerkId, não foi criado");
        }

        return new NextResponse("Order created successfully", { status: 200 });
      } catch (err) {
        console.error("[webhooks_POST] Erro ao processar o pedido:", err);
        return new NextResponse("Error processing order", { status: 500 });
      }
    }

    // Para outros tipos de eventos
    return new NextResponse(`Webhook event ${event.type} received`, {
      status: 200,
    });
  } catch (err) {
    console.error("[webhooks_POST] Erro geral:", err);
    return new NextResponse("Failed to process webhook", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
