type CollectionType = {
  _id: string;
  title: string;
  description: string;
  image: string;
  products: ProductType[];
};

type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  categories: [CategoryType];
  collections: [CollectionType];
  tags: [string];
  sizes: [string];
  colors: [string];
  price: number;
  expense: number;
  createdAt: Date;
  updatedAt: Date;
};

type OrderColumnType = {
  _id: string;
  customer: string;
  products: number;
  totalAmount: number;
  status: "pendente" | "pago" | "enviado" | "entregue" | "cancelado" | string;
  createdAt: string;
};

type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
};

type CustomerType = {
  clerkId: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  orders?: string[];
};

type CategoryType = {
  _id: string;
  title: string;
  image: string;
  products: ProductType[];
};

type AboutUsType = {
  _id: string;
  title: string;
  description: string;
  image: string;
};

// Tipo para informações do cliente no pedido PIX
type CustomerInfoType = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
};

// Tipo completo para um pedido com detalhes PIX
type OrderType = {
  _id: string;
  customerClerkId: string;
  products: OrderItemType[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    complement?: string;
  };
  shippingRate: string;
  totalAmount: number;
  status: "pendente" | "pago" | "enviado" | "entregue" | "cancelado";
  paymentMethod: "stripe" | "pix";
  paymentConfirmedAt?: Date;
  customerInfo?: CustomerInfoType;
  createdAt: Date;
  updatedAt: Date;
};

// Tipo para o corpo da requisição ao criar um pedido PIX
type PixOrderRequestBody = {
  customerInfo: {
    clerkId?: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    complement?: string;
  };
  cartItems: {
    product: string;
    color: string;
    size: string;
    quantity: number;
  }[];
  totalAmount: number;
};

// Tipo para a resposta da criação de um pedido PIX
type PixOrderResponse = {
  success: boolean;
  orderId: string;
};

// Tipo para a confirmação de pagamento PIX
type PixConfirmRequestBody = {
  orderId: string;
};

// Tipo para a resposta de confirmação de pagamento PIX
type PixConfirmResponse = {
  success: boolean;
  message: string;
};
