"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/cart-context";

export function BestSellersSection() {
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  // Mock data for display on landing page
  const bestSellers = [
    {
      _id: "bs1",
      name: "Peri Peri Loaded Fries",
      description: "Crispy fries loaded with our secret peri peri spice mix and creamy cheese sauce.",
      price: 149,
      image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Snacks",
      isAvailable: true,
    },
    {
      _id: "bs2",
      name: "Tandoori Chicken Burger",
      description: "Juicy tandoori chicken patty with mint mayo, fresh lettuce, and toasted brioche buns.",
      price: 199,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Burgers",
      isAvailable: true,
    },
    {
      _id: "bs3",
      name: "Classic Margherita Pizza",
      description: "Hand-tossed crust, rich tomato sauce, fresh basil, and generous mozzarella.",
      price: 249,
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Pizzas",
      isAvailable: true,
    },
  ];

  const handleAddToCart = (item: { _id: string; name: string; price: number; image: string; description: string; category: string; isAvailable: boolean }) => {
    addToCart({
      foodId: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
    setAddedItems(prev => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item._id]: false }));
    }, 2000);
  };

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Our <span className="text-gradient">Best Sellers</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Tried, tested, and loved by hundreds of students. You can&apos;t go wrong with these.
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group"
          >
            Explore Full Menu <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellers.map((item) => (
            <div key={item._id} className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-primary/20 hover:-translate-y-1">
              <div className="relative h-56 w-full overflow-hidden bg-secondary">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold border border-border">
                  ⭐ Top Rated
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold line-clamp-1">{item.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xl font-bold text-primary">
                    ₹{item.price}
                  </span>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    className={`h-10 w-10 md:w-auto md:px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
                      addedItems[item._id] 
                        ? 'bg-green-500 text-white' 
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {addedItems[item._id] ? (
                      <span className="text-sm">Added</span>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        <span className="hidden md:inline text-sm">Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
