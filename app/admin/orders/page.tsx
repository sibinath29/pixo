"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import Link from "next/link";

interface OrderItem {
  productTitle: string;
  quantity: number;
  price: number;
  size?: string;
}

interface Order {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
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
  items: OrderItem[];
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
}

export default function AdminOrdersPage() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"paid" | "all">("paid");

  const loadOrders = useCallback(async () => {
    try {
      const url =
        statusFilter === "all"
          ? "/api/orders/all"
          : `/api/orders/all?status=${statusFilter}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    loadOrders();
  }, [isAuthenticated, router, loadOrders]);

  

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-cyan-neon border-cyan-neon";
      case "pending":
        return "text-yellow-400 border-yellow-400";
      case "failed":
        return "text-red-400 border-red-400";
      case "refunded":
        return "text-gray-400 border-gray-400";
      default:
        return "text-white/60 border-white/20";
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, order) => sum + order.amount, 0);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-white/60">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-cyan-neon">Admin</p>
          <h1 className="font-display text-2xl sm:text-3xl mt-1">Order Management</h1>
          <p className="text-white/60 text-sm mt-2">
            View and manage all customer orders
          </p>
        </div>
        <Link
          href="/admin/dashboard"
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-neon hover:text-cyan-neon"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-xl border border-white/10 p-4">
          <p className="text-white/60 text-sm mb-1">Total Orders</p>
          <p className="font-display text-2xl text-cyan-neon">{orders.length}</p>
        </div>
        <div className="glass rounded-xl border border-white/10 p-4">
          <p className="text-white/60 text-sm mb-1">Paid Orders</p>
          <p className="font-display text-2xl text-cyan-neon">
            {orders.filter((o) => o.status === "paid").length}
          </p>
        </div>
        <div className="glass rounded-xl border border-white/10 p-4">
          <p className="text-white/60 text-sm mb-1">Total Revenue</p>
          <p className="font-display text-2xl text-cyan-neon">
            ₹{(totalRevenue / 100).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setStatusFilter("paid")}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${
            statusFilter === "paid"
              ? "text-cyan-neon border-b-2 border-cyan-neon"
              : "text-white/60 hover:text-white"
          }`}
        >
          Paid Orders
        </button>
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${
            statusFilter === "all"
              ? "text-cyan-neon border-b-2 border-cyan-neon"
              : "text-white/60 hover:text-white"
          }`}
        >
          All Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="glass rounded-2xl border border-white/10 p-8 sm:p-12 text-center">
          <p className="text-white/60 text-lg">No orders found</p>
          <p className="text-white/40 text-sm mt-2">
            {statusFilter === "paid"
              ? "No paid orders yet."
              : "No orders have been placed yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="glass rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-display text-lg sm:text-xl text-white">
                      Order #{order.orderId}
                    </h3>
                    <span
                      className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs sm:text-sm mb-2">
                    {formatDate(order.createdAt)}
                  </p>
                  <div className="text-white/70 text-sm">
                    <p>
                      <strong>Customer:</strong> {order.customer.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.customer.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.customer.phone}
                    </p>
                    {order.razorpayPaymentId && (
                      <p className="text-xs text-white/50 mt-1">
                        Payment ID: {order.razorpayPaymentId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right sm:text-left sm:ml-4">
                  <p className="text-cyan-neon font-display text-xl sm:text-2xl">
                    ₹{(order.amount / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-2">Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm text-white/70"
                      >
                        <span>
                          {item.productTitle}
                          {item.size && <span className="text-white/50"> • {item.size}</span>}
                          <span className="text-white/50"> × {item.quantity}</span>
                        </span>
                        <span className="text-cyan-neon">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-2">Shipping Address</h4>
                  <p className="text-sm text-white/70">
                    {order.customer.address.line1}
                    {order.customer.address.line2 && <>, {order.customer.address.line2}</>}
                    <br />
                    {order.customer.address.city}, {order.customer.address.state}{" "}
                    {order.customer.address.zipCode}
                    <br />
                    {order.customer.address.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

