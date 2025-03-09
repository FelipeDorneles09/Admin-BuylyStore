import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  email: String,
  phone: String,
  cpf: String,
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
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
customerSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
