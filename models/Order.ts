import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  orderId: string; // Razorpay order ID
  razorpayOrderId: string; // Razorpay's order ID
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  items: Array<{
    productSlug: string;
    productTitle: string;
    productType: string;
    size?: string;
    quantity: number;
    price: number;
  }>;
  amount: number; // Total amount in paise
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {
      type: String,
      default: "",
    },
    customer: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        line1: {
          type: String,
          required: true,
        },
        line2: {
          type: String,
          default: "",
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        zipCode: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
          default: "India",
        },
      },
    },
    items: [
      {
        productSlug: String,
        productTitle: String,
        productType: String,
        size: String,
        quantity: Number,
        price: Number,
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
OrderSchema.index({ "customer.email": 1 });
OrderSchema.index({ status: 1 });

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

