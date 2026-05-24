"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { getProduct } from "@/lib/products";
import { addToCart } from "@/lib/cart";

import { FiShoppingBag, FiArrowLeft } from "react-icons/fi";

const safeText = (str, max = 120) => {
  if (typeof str !== "string") return "";
  return str.replace(/[<>"']/g, "").trim().slice(0, max);
};

const formatPrice = (price) => {
  if (
    typeof price !== "number" ||
    !isFinite(price) ||
    price < 0
  ) {
    return "—";
  }

  return `KES ${Math.round(price).toLocaleString("en-KE")}`;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProduct(params.id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (params?.id) {
      loadProduct();
    }
  }, [params]);

  const handleAddToCart = () => {
    if (!product) return;

    setAdding(true);

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
    });

    setTimeout(() => {
      setAdding(false);
      router.push("/checkout");
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Product not found
      </div>
    );
  }

  const title = safeText(product.title);
  const category = safeText(product.category);
  const image = product.image || "/images/placeholder.jpg";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">

          <button
            onClick={() => router.back()}
            className="
              mb-10
              flex items-center gap-2
              text-white/60
              hover:text-white
              transition
            "
          >
            <FiArrowLeft />
            Back
          </button>

          <div className="grid lg:grid-cols-2 gap-16 items-start">

            <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10">
              <Image
                src={image}
                alt={title}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div>

              <span className="inline-block mb-4 text-xs tracking-[0.3em] uppercase text-white/40">
                {category}
              </span>

              <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                {title}
              </h1>

              <p className="text-3xl font-bold mb-10">
                {formatPrice(product.price)}
              </p>

              <p className="text-white/60 leading-relaxed mb-10">
                Premium fashion item curated for modern Kenyan style.
                Crafted with quality materials and designed for comfort,
                durability, and timeless appeal.
              </p>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="
                  flex items-center gap-3
                  px-8 py-4
                  rounded-xl
                  bg-white
                  text-black
                  font-semibold
                  hover:bg-white/90
                  transition
                  disabled:opacity-60
                "
              >
                <FiShoppingBag />

                {adding
                  ? "Adding..."
                  : "Add To Cart"}
              </button>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}