"use client";

import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColumns";
import { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

// Definição de tipos para as props e estado
interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  // Adicione as propriedades que OrderItemType espera
  product?: ProductType; // Referência para si mesmo, se necessário
  color?: string;
  size?: string;
}

interface OrderDetails {
  _id: string;
  totalAmount: number;
  status?: string;
  shippingAddress: ShippingAddress;
  products: Product[];
  // Adicione outros campos do pedido conforme necessário
}

interface Customer {
  name: string;
  // Adicione outros campos do cliente conforme necessário
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
}

interface OrderDetailsProps {
  initialOrderDetails: OrderDetails;
  customer: Customer;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  initialOrderDetails,
  customer,
}) => {
  // Transformar os dados para um formato que funcionará com a busca,
  // mas mantendo a estrutura original
  const transformedProducts = initialOrderDetails.products.map((item) => ({
    ...item,
    title: item.product?.title, // Adicionar uma propriedade 'title' no nível superior
  }));

  const [orderDetails, setOrderDetails] = useState({
    ...initialOrderDetails,
    products: transformedProducts,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { street, city, state, postalCode, country } =
    orderDetails.shippingAddress;

  // Verificar o status do pedido, com valor padrão "pago" se não estiver definido
  const status = orderDetails.status || "pago";

  const toggleOrderStatus = async () => {
    setIsLoading(true);

    try {
      // Determinar o novo status (inverso do atual)
      const newStatus = status === "pago" ? "pendente" : "pago";

      // Chamar a API para atualizar o status
      const response = await fetch(`/api/orders/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderDetails._id,
          newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar status");
      }

      // Atualizar o estado local com o novo status
      setOrderDetails({
        ...orderDetails,
        status: newStatus,
      });

      toast.success(
        `Status alterado para ${newStatus === "pago" ? "Pago" : "Pendente"}`
      );
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Ocorreu um erro ao atualizar o status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-10 gap-5">
      <p className="text-base-bold">
        ID do Pedido:{" "}
        <span className="text-base-medium">{orderDetails._id}</span>
      </p>
      <p className="text-base-bold">
        Nome do Cliente:{" "}
        <span className="text-base-medium">{customer.name}</span>
      </p>
      <p className="text-base-bold">
        Endereço de Entrega:{" "}
        <span className="text-base-medium">
          {street}, {city}, {state}, {postalCode}, {country}
        </span>
      </p>
      <p className="text-base-bold">
        Total Pago:{" "}
        <span className="text-base-medium">R${orderDetails.totalAmount}</span>
      </p>
      <p className="text-base-bold">
        Status:{" "}
        <span
          className={
            status === "pago"
              ? "text-green-500 font-medium"
              : "text-red-500 font-medium"
          }
        >
          {status === "pago" ? "Pago" : "Pendente"}
        </span>
      </p>
      <div>
        <button
          onClick={toggleOrderStatus}
          disabled={isLoading}
          className={`py-2 px-4 rounded-md text-white mt-2 transition-colors ${
            isLoading
              ? "bg-gray-400"
              : status === "pago"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isLoading
            ? "Atualizando..."
            : status === "pago"
              ? "Marcar como Pendente"
              : "Marcar como Pago"}
        </button>
      </div>
      <DataTable
        columns={columns as any}
        data={orderDetails.products as any}
        searchKey="title" // Agora podemos buscar por 'title'
      />
    </div>
  );
};

// Definição de tipo para o parâmetro do wrapper
interface OrderDetailsWrapperProps {
  params: {
    orderId: string;
  };
}

// Esta é a função de carregamento que obtém os dados iniciais
const OrderDetailsWrapper = async ({ params }: OrderDetailsWrapperProps) => {
  // Precisamos usar uma URL absoluta para fetch em Server Components
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/orders/${params.orderId}`, {
    cache: "no-store",
  });
  const { orderDetails, customer } = await res.json();

  // Passa os dados para o componente cliente
  return (
    <OrderDetails initialOrderDetails={orderDetails} customer={customer} />
  );
};

export default OrderDetailsWrapper;
