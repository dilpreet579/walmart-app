"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCartStore } from "../../../store/cartStore";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const items = useCartStore(state => state.items);
  const addToCart = useCartStore(state => state.addToCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const [adding, setAdding] = useState(false);

  const cartItem = items.find(item => item.productId === product?.id);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (e: any) {
        setError(e.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product.id, 1);
    } finally {
      setAdding(false);
    }
  };

  const handleIncrement = async () => {
    if (cartItem) {
      setAdding(true);
      try {
        await updateQuantity(product.id, cartItem.quantity + 1);
      } finally {
        setAdding(false);
      }
    }
  };

  const handleDecrement = async () => {
    if (!cartItem) return;
    setAdding(true);
    try {
      if (cartItem.quantity > 1) {
        await updateQuantity(product.id, cartItem.quantity - 1);
      } else {
        await removeFromCart(product.id);
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="container-wrapper section">Loading...</div>;
  if (error) return <div className="container-wrapper section text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-lg mt-8">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">
        <div className="w-full md:w-96 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-xl shadow-inner min-h-[320px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-60 h-60 md:w-80 md:h-80 object-contain rounded-xl shadow-md bg-white"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            <h1 className="text-3xl font-extrabold mb-2 text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="text-2xl font-bold text-walmart-blue">
                ${product.discountedPrice ?? product.price}
              </span>
              {product.discountedPrice && (
                <>
                  <span className="text-gray-400 line-through text-lg">${product.price}</span>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
              <span className="flex items-center gap-1 ml-3 text-yellow-500 font-semibold text-lg">
                <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.922-.755 1.688-1.539 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.783.57-1.838-.196-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                {product.rating}
              </span>
            </div>
            <div className="text-gray-700 mb-4 text-lg leading-relaxed">{product.description}</div>
            <div className="text-sm font-medium text-gray-500 mb-6">Category: <span className="capitalize">{product.category}</span></div>
            <hr className="my-4 border-gray-200" />
          </div>
          <div>
            {cartItem ? (
              <div className="flex items-center justify-between bg-gray-100 rounded-xl p-3 shadow-sm">
                <button
                  onClick={handleDecrement}
                  className="btn-secondary px-4 py-2 text-xl rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-walmart-blue"
                  disabled={adding}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="font-bold text-lg min-w-[32px] text-center">{cartItem.quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="btn-secondary px-4 py-2 text-xl rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-walmart-blue"
                  disabled={adding}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="btn-primary w-full md:w-auto mt-4 py-3 px-6 text-lg font-semibold rounded-xl shadow hover:bg-blue-700 focus:ring-2 focus:ring-walmart-blue transition"
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
