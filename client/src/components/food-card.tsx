"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { Star, Clock, Plus } from "lucide-react"
import Image from "next/image"

interface Food {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  rating: number
  preparationTime?: number
}

export function FoodCard({ food }: { food: Food }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"

  return (
    <Card className="group overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:glow-orange">
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={food.image}
          alt={food.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 glass rounded-full px-2.5 py-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold">{food.rating}</span>
        </div>

        {/* Prep time badge */}
        {food.preparationTime && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 glass rounded-full px-2.5 py-1">
            <Clock className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">{food.preparationTime}m</span>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-5 pb-3">
        <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">{food.category}</span>
        <h3 className="font-bold text-base mt-1.5 line-clamp-1">{food.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed min-h-[2rem]">
          {food.description}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">₹{food.price.toFixed(0)}</span>
        {!isAdmin && (
          <Button
            size="sm"
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 gap-1.5 transition-all active:scale-95"
            onClick={() =>
              addToCart({
                foodId: food._id,
                name: food.name,
                price: food.price,
                image: food.image,
                quantity: 1,
              })
            }
          >
            <Plus className="w-4 h-4" /> Add
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
