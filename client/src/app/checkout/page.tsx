"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import {
  Loader2,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react"
import Link from "next/link"
import { AxiosError } from "axios"

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { Razorpay: any }
}

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [customerName, setCustomerName] = useState(user?.name || "")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay")
  const [isLoading, setIsLoading] = useState(false)

  // OTP verification state
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [otpTimer, setOtpTimer] = useState(0)

  // Dynamic fees from settings
  const [deliveryFeeBase, setDeliveryFeeBase] = useState(40)
  const [gstPercent, setGstPercent] = useState(5)
  const [freeDeliveryAbove, setFreeDeliveryAbove] = useState(0)
  const [isStoreOpen, setIsStoreOpen] = useState(true)
  const [unavailableItems, setUnavailableItems] = useState<string[]>([])

  // Coupon
  const [couponCode, setCouponCode] = useState("")
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState("")
  const [couponLoading, setCouponLoading] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  // OTP cooldown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setInterval(() => setOtpTimer((t) => t - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [otpTimer])

  const sendOtp = () => {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number")
      return
    }
    // Generate a 6-digit OTP (demo — in production, use SMS gateway)
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(code)
    setOtpSent(true)
    setOtpTimer(30)
    toast.success(`OTP sent! (Demo OTP: ${code})`, { duration: 8000 })
  }

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true)
      toast.success("Mobile number verified!")
    } else {
      toast.error("Invalid OTP. Please try again.")
    }
  }

  // Fetch settings & availability
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [settingsRes, foodsRes] = await Promise.all([
          api.get("/settings"),
          api.get("/foods") // Public foods
        ])
        
        const data = settingsRes.data
        setDeliveryFeeBase(data.deliveryFee ?? 40)
        setGstPercent(data.gstPercent ?? 5)
        setFreeDeliveryAbove(data.freeDeliveryAbove ?? 0)
        setIsStoreOpen(data.isStoreOpen ?? true)
        
        // Check availability
        const availableFoods = foodsRes.data
        const outOfStockIds = items
          .filter((cartItem) => {
             const dbItem = availableFoods.find((f: any) => f._id === cartItem.foodId)
             return !dbItem || dbItem.availability === false
          })
          .map((item) => item.foodId)
          
        setUnavailableItems(outOfStockIds)
      } catch { /* fallback to defaults */ }
    }
    if (items.length > 0) fetchStatus()
  }, [items])

  const deliveryFee = freeDeliveryAbove > 0 && totalAmount >= freeDeliveryAbove ? 0 : deliveryFeeBase
  const tax = Math.round(totalAmount * (gstPercent / 100))
  const grandTotal = totalAmount + deliveryFee + tax - couponDiscount

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const { data } = await api.post("/coupons/apply", { code: couponCode, orderTotal: totalAmount })
      setCouponDiscount(data.discount)
      setCouponApplied(data.code)
      toast.success(data.message)
    } catch (error: unknown) {
      const axiosError = error as import("axios").AxiosError<{ message?: string }>
      toast.error(axiosError.response?.data?.message || "Invalid coupon")
      setCouponDiscount(0)
      setCouponApplied("")
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode("")
    setCouponDiscount(0)
    setCouponApplied("")
  }

  const handleRazorpayPayment = async (orderId: string) => {
    try {
      const { data } = await api.post("/payment/create-order", { amount: grandTotal })

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "ARF CAFE",
        description: "Food Order Payment",
        order_id: data.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            })
            clearCart()
            toast.success("Payment successful! Order placed.")
            router.push("/orders")
          } catch {
            toast.error("Payment verification failed")
          }
        },
        prefill: {
          name: customerName,
          contact: phone,
          email: user?.email || "",
        },
        theme: { color: "#ea580c" },
      }

      const rzp = new window.Razorpay(options)
      rzp.on("payment.failed", () => toast.error("Payment failed"))
      rzp.open()
    } catch {
      toast.error("Failed to initiate payment")
    }
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Please login to place an order")
      router.push("/login")
      return
    }
    if (!isStoreOpen) {
      toast.error("Store is currently closed")
      return
    }
    if (unavailableItems.length > 0) {
      toast.error("Some items in your cart are out of stock. Please remove them.")
      return
    }
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    if (!otpVerified) {
      toast.error("Please verify your mobile number first")
      return
    }
    if (!address.trim()) {
      toast.error("Please enter your delivery address")
      return
    }

    setIsLoading(true)

    try {
      const { data: order } = await api.post("/orders", {
        deliveryAddress: address,
        paymentMethod,
        customerName,
        customerPhone: phone,
        items: items.map((item) => ({
          foodId: item.foodId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        totalAmount: grandTotal,
      })

      if (paymentMethod === "razorpay") {
        await handleRazorpayPayment(order._id)
      } else {
        clearCart()
        toast.success("Order placed! Pay on delivery.")
        router.push("/orders")
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      toast.error(axiosError.response?.data?.message || "Failed to place order")
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
        <div className="h-20 w-20 rounded-2xl bg-secondary flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Cart is empty</h2>
          <p className="text-muted-foreground">Add items before checking out.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-6">
          <Link href="/menu">Browse Menu</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ShieldCheck className="h-7 w-7 text-primary" />
        Checkout
      </h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Info */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-5">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Delivery Details
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" /> Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-11 rounded-xl bg-secondary border-border focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Mobile Number
                    {otpVerified && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex items-center px-3 rounded-xl bg-secondary border border-border text-sm text-muted-foreground">
                      +91
                    </div>
                    <Input
                      id="phone"
                      placeholder="10-digit number"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ""))
                        if (otpVerified) setOtpVerified(false)
                        if (otpSent) setOtpSent(false)
                      }}
                      disabled={otpVerified}
                      className="h-11 rounded-xl bg-secondary border-border focus:border-primary/50 flex-1"
                    />
                    {!otpVerified && (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-xl border-primary/30 text-primary hover:bg-primary/10 px-4"
                        onClick={sendOtp}
                        disabled={phone.length !== 10 || otpTimer > 0}
                      >
                        {otpTimer > 0 ? `${otpTimer}s` : "Send OTP"}
                      </Button>
                    )}
                  </div>

                  {/* OTP Input */}
                  {otpSent && !otpVerified && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                        className="h-10 rounded-xl bg-secondary border-border flex-1"
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4"
                        onClick={verifyOtp}
                        disabled={otp.length !== 6}
                      >
                        Verify
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Delivery Address
                </Label>
                <Input
                  id="address"
                  placeholder="House no, Street, Area, City, PIN"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-11 rounded-xl bg-secondary border-border focus:border-primary/50"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-5">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment Method
              </h3>

              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as "razorpay" | "cod")}
                className="space-y-3"
              >
                <label
                  htmlFor="razorpay"
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Pay Online (Razorpay)</p>
                    <p className="text-xs text-muted-foreground">UPI, Cards, Wallets, Net Banking</p>
                  </div>
                </label>

                <label
                  htmlFor="cod"
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:border-border/80"
                  }`}
                >
                  <RadioGroupItem value="cod" id="cod" />
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Banknote className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </label>
              </RadioGroup>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border space-y-5">
              <h3 className="font-bold text-lg">Order Summary</h3>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => {
                  const isUnavailable = unavailableItems.includes(item.foodId)
                  return (
                  <div key={item.foodId} className={`flex justify-between text-sm ${isUnavailable ? 'text-destructive font-medium bg-destructive/5 -mx-2 px-2 py-1 rounded' : ''}`}>
                    <span className={`${!isUnavailable && 'text-muted-foreground'} truncate mr-2`}>
                      {item.quantity}× {item.name} {isUnavailable && "(Out of Stock)"}
                    </span>
                    <span className="flex-shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                )})}
              </div>

              <Separator className="bg-border" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalAmount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Delivery Fee
                    {freeDeliveryAbove > 0 && totalAmount >= freeDeliveryAbove && (
                      <span className="text-green-400 ml-1">(Free!)</span>
                    )}
                  </span>
                  <span className={deliveryFee === 0 ? "line-through text-muted-foreground" : ""}>
                    ₹{deliveryFeeBase}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST ({gstPercent}%)</span>
                  <span>₹{tax}</span>
                </div>

                {/* Coupon Input */}
                {!couponApplied ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="h-9 rounded-lg bg-secondary border-border text-sm uppercase flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      variant="outline"
                      className="h-9 rounded-lg text-sm px-4 border-primary/40 text-primary hover:bg-primary/10"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-green-500/10 rounded-lg px-3 py-2">
                    <span className="text-green-400 text-xs font-medium">
                      🎉 {couponApplied} applied — ₹{couponDiscount} off
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <Separator className="bg-border" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{grandTotal}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !otpVerified || !isStoreOpen || unavailableItems.length > 0}
                className={`w-full h-12 text-base rounded-xl transition-all ${
                  !isStoreOpen || unavailableItems.length > 0
                    ? "bg-secondary text-muted-foreground" 
                    : "bg-primary hover:bg-primary/90 text-primary-foreground glow-orange hover:glow-orange-strong"
                }`}
              >
                {!isStoreOpen ? (
                  <>Store Closed</>
                ) : unavailableItems.length > 0 ? (
                  <>Items Out of Stock</>
                ) : isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : paymentMethod === "razorpay" ? (
                  <>Pay ₹{grandTotal}</>
                ) : (
                  <>Place Order (COD)</>
                )}
              </Button>

              {!isStoreOpen ? (
                <p className="text-xs text-center text-destructive font-medium">
                  We are not accepting orders at this time
                </p>
              ) : unavailableItems.length > 0 ? (
                <p className="text-xs text-center text-destructive font-medium">
                  Please return to cart to remove unavailable items
                </p>
              ) : !otpVerified && (
                <p className="text-xs text-center text-muted-foreground">
                  Please verify your mobile number to proceed
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
