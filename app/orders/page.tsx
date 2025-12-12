"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  productTitle: string;
  quantity: number;
  price: number;
  size?: string;
}

interface Order {
  orderId: string;
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

export default function MyOrdersPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        router.push("/login?redirect=/orders");
        return;
      }
      loadOrders();
    }
  }, [user, userLoading, router]);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("pixo-auth-token");
      if (!token) {
        setError("Please log in to view your orders");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        setError("Failed to load orders");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

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
        return "text-cyan-neon";
      case "pending":
        return "text-yellow-400";
      case "failed":
        return "text-red-400";
      case "refunded":
        return "text-gray-400";
      default:
        return "text-white/60";
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-white/60">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/login" className="cta-btn inline-block">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-cyan-neon">My Orders</p>
        <h1 className="font-display text-2xl sm:text-3xl mt-1">Your Order History</h1>
        <p className="text-white/60 text-sm mt-2">
          View all your past orders placed with {user?.email}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="glass rounded-2xl border border-white/10 p-8 sm:p-12 text-center">
          <p className="text-white/60 text-lg mb-4">No orders found</p>
          <p className="text-white/40 text-sm mb-6">
            You haven&apos;t placed any orders yet. Start shopping to see your orders here!
          </p>
          <Link href="/posters" className="cta-btn inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="glass rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-lg sm:text-xl text-white">
                      Order #{order.orderId}
                    </h3>
                    <span
                      className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full border ${getStatusColor(
                        order.status
                      )} border-current`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs sm:text-sm">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
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

