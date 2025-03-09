import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerClerkId: String,
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      color: String,
      size: String,
      quantity: Number,
    },
  ],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    complement: String,
  },
  shippingRate: String,
  totalAmount: Number,
  status: {
    type: String,
    enum: ["pendente", "pago", "enviado", "entregue", "cancelado"],
    default: "pendente",
  },
  paymentMethod: {
    type: String,
    enum: ["stripe", "pix"],
    default: "stripe",
  },
  paymentConfirmedAt: Date,
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    cpf: String,
  },
  metadata: {
    stripeSessionId: String,
    pixCode: String,
    // Outros metadados que podem ser úteis
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para atualizar o campo updatedAt antes de salvar
orderSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Índices para melhorar a performance
orderSchema.index({ "metadata.stripeSessionId": 1 });
orderSchema.index({ customerClerkId: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
