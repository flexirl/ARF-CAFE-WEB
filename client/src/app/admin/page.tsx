"use client"

import { useState, useEffect, useRef } from "react"
import { io as ioClient, Socket } from "socket.io-client"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import api from "@/lib/api"
import { AxiosError } from "axios"
import { Separator } from "@/components/ui/separator"

interface AppSettings {
  deliveryFee: number
  gstPercent: number
  freeDeliveryAbove: number
  isStoreOpen: boolean
  storeOpensAt: string | null
}

interface Coupon {
  _id: string
  code: string
  discountType: "percent" | "flat"
  discountValue: number
  minOrder: number
  maxDiscount: number
  usageLimit: number
  usedCount: number
  isActive: boolean
  expiresAt: string | null
}
import {
  Package,
  IndianRupee,
  Users,
  UtensilsCrossed,
  Plus,
  Trash2,
  Loader2,
  ImagePlus,
  X,
  Eye, EyeOff,
  Tag,
} from "lucide-react"

interface Food {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  availability: boolean
  rating: number
  preparationTime?: number
}

interface Order {
  _id: string
  customerName: string
  customerPhone: string
  items: { name: string; quantity: number; price: number }[]
  totalAmount: number
  paymentStatus: string
  orderStatus: string
  paymentMethod: string
  createdAt: string
  userId?: { name: string; email: string }
}

interface Stats {
  totalOrders: number
  totalFoods: number
  totalUsers: number
  totalRevenue: number
  recentOrders: Order[]
}



export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"dashboard" | "foods" | "orders" | "settings" | "coupons">("dashboard")

  // Stats
  const [stats, setStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // Foods
  const [foods, setFoods] = useState<Food[]>([])
  const [foodsLoading, setFoodsLoading] = useState(true)

  // Add food form
  const [showAddForm, setShowAddForm] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState("")
  const [newFood, setNewFood] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    preparationTime: "",
  })

  // Orders
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  // Settings
  const [appSettings, setAppSettings] = useState<AppSettings>({ deliveryFee: 40, gstPercent: 5, freeDeliveryAbove: 0, isStoreOpen: true, storeOpensAt: null })
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSaving, setSettingsSaving] = useState(false)

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [couponsLoading, setCouponsLoading] = useState(true)
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [couponSaving, setCouponSaving] = useState(false)
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percent" as "percent" | "flat",
    discountValue: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
  })

  // Auth guard
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Fetch stats once on load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats")
        setStats(data)
      } catch { /* ignore */ } finally {
        setStatsLoading(false)
      }
    }
    if (user?.role === "admin") fetchStats()
  }, [user])

  // Fetch foods (admin sees all including unavailable)
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await api.get("/foods?all=true")
        setFoods(data)
      } catch { /* ignore */ } finally {
        setFoodsLoading(false)
      }
    }
    if (user?.role === "admin") fetchFoods()
  }, [user])

  // Fetch orders once + WebSocket real-time updates
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (user?.role !== "admin") return

    // Initial fetch
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders")
        setOrders(data)
      } catch { /* ignore */ } finally {
        setOrdersLoading(false)
      }
    }
    fetchOrders()

    // Connect to WebSocket
    const socket = ioClient("http://localhost:5000")
    socketRef.current = socket

    socket.on("connect", () => {
      socket.emit("join-admin")
    })

    socket.on("new-order", (order: Order) => {
      setOrders((prev) => [order, ...prev])
      // Refresh stats when new order arrives
      api.get("/admin/stats").then(({ data }) => setStats(data)).catch(() => {})
      toast.success(`🔔 New order from ${order.customerName || "Customer"}!`)
    })

    socket.on("order-updated", (updatedOrder: Order) => {
      setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)))
    })

    return () => {
      socket.disconnect()
    }
  }, [user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) {
      toast.error("Please select an image")
      return
    }

    setAddLoading(true)
    try {
      // Upload image first
      const formData = new FormData()
      formData.append("image", imageFile)
      const { data: uploadData } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Create food
      const { data: food } = await api.post("/foods", {
        name: newFood.name,
        description: newFood.description,
        price: parseFloat(newFood.price),
        category: newFood.category,
        image: uploadData.url,
        preparationTime: newFood.preparationTime ? parseInt(newFood.preparationTime) : undefined,
      })

      setFoods((prev) => [food, ...prev])
      setNewFood({ name: "", description: "", price: "", category: "", preparationTime: "" })
      setImageFile(null)
      setImagePreview("")
      setShowAddForm(false)
      toast.success("Food item added!")
      // Refresh stats
      const { data: newStats } = await api.get("/admin/stats")
      setStats(newStats)
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      toast.error(axiosError.response?.data?.message || "Failed to add food item")
    } finally {
      setAddLoading(false)
    }
  }

  const handleDeleteFood = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    try {
      await api.delete(`/foods/${id}`)
      setFoods((prev) => prev.filter((f) => f._id !== id))
      toast.success("Food item deleted")
      const { data: newStats } = await api.get("/admin/stats")
      setStats(newStats)
    } catch {
      toast.error("Failed to delete food item")
    }
  }

  const handleToggleFoodAvailability = async (id: string, currentAvailability: boolean) => {
    try {
      await api.put(`/foods/${id}`, { availability: !currentAvailability })
      setFoods((prev) =>
        prev.map((f) => (f._id === id ? { ...f, availability: !currentAvailability } : f))
      )
      toast.success(currentAvailability ? "Marked Out of Stock" : "Marked In Stock")
    } catch {
      toast.error("Failed to update availability")
    }
  }

  const handleToggleAvailability = async (id: string, current: boolean) => {
    try {
      const { data } = await api.put(`/foods/${id}`, { availability: !current })
      setFoods((prev) => prev.map((f) => (f._id === id ? data : f)))
    } catch {
      toast.error("Failed to update")
    }
  }

  const handleUpdateOrderStatus = async (id: string, orderStatus: string) => {
    try {
      const paymentStatus = orderStatus === 'delivered' ? 'paid' : undefined
      const { data } = await api.put(`/orders/${id}/status`, { orderStatus, ...(paymentStatus ? { paymentStatus } : {}) })
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)))
      toast.success(`Order status updated to ${orderStatus}`)
    } catch {
      toast.error("Failed to update order")
    }
  }

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      setSettingsLoading(true)
      try {
        const { data } = await api.get("/settings")
        setAppSettings(data)
      } catch { /* ignore */ } finally {
        setSettingsLoading(false)
      }
    }
    if (user?.role === "admin") fetchSettings()
  }, [user])

  // Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await api.get("/coupons")
        setCoupons(data)
      } catch { /* ignore */ } finally {
        setCouponsLoading(false)
      }
    }
    if (user?.role === "admin") fetchCoupons()
  }, [user])

  const handleSaveSettings = async () => {
    setSettingsSaving(true)
    try {
      const { data } = await api.put("/settings", appSettings)
      setAppSettings(data)
      toast.success("Settings saved!")
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setSettingsSaving(false)
    }
  }

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    setCouponSaving(true)
    try {
      const { data } = await api.post("/coupons", {
        code: newCoupon.code,
        discountType: newCoupon.discountType,
        discountValue: parseFloat(newCoupon.discountValue),
        minOrder: newCoupon.minOrder ? parseFloat(newCoupon.minOrder) : 0,
        maxDiscount: newCoupon.maxDiscount ? parseFloat(newCoupon.maxDiscount) : 0,
        usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : 0,
        expiresAt: newCoupon.expiresAt || null,
      })
      setCoupons((prev) => [data, ...prev])
      setNewCoupon({ code: "", discountType: "percent", discountValue: "", minOrder: "", maxDiscount: "", usageLimit: "", expiresAt: "" })
      setShowCouponForm(false)
      toast.success("Coupon created!")
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      toast.error(axiosError.response?.data?.message || "Failed to create coupon")
    } finally {
      setCouponSaving(false)
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return
    try {
      await api.delete(`/coupons/${id}`)
      setCoupons((prev) => prev.filter((c) => c._id !== id))
      toast.success("Coupon deleted")
    } catch {
      toast.error("Failed to delete coupon")
    }
  }

  const TABS = [
    { key: "dashboard", label: "Dashboard" },
    { key: "foods", label: "Food Items" },
    { key: "orders", label: "Orders" },
    { key: "settings", label: "Settings" },
    { key: "coupons", label: "Coupons" },
  ] as const

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== DASHBOARD TAB ==================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground text-sm mt-1">Overview of your cloud kitchen</p>
          </div>

          {statsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : stats ? (
            <>
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-green-400" },
                  { title: "Orders", value: stats.totalOrders.toString(), icon: Package, color: "text-blue-400" },
                  { title: "Food Items", value: stats.totalFoods.toString(), icon: UtensilsCrossed, color: "text-primary" },
                  { title: "Total Users", value: stats.totalUsers.toString(), icon: Users, color: "text-purple-400" },
                ].map((stat) => (
                  <Card key={stat.title} className="bg-card border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                      <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center">
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Orders */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentOrders.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">No orders yet</p>
                  ) : (
                    <div className="space-y-4">
                      {stats.recentOrders.slice(0, 5).map((order) => (
                        <div key={order._id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                            {(order.customerName || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{order.customerName || "Customer"}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.items.length} items · {order.paymentMethod === "cod" ? "COD" : "Online"} · {order.orderStatus}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-green-400">₹{order.totalAmount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      )}

      {/* ==================== FOODS TAB ==================== */}
      {activeTab === "foods" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Food Items</h2>
              <p className="text-muted-foreground text-sm mt-1">{foods.length} items in menu</p>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showAddForm ? "Cancel" : "Add Item"}
            </Button>
          </div>

          {/* Add Food Form */}
          {showAddForm && (
            <Card className="bg-card border-border border-primary/20">
              <CardContent className="pt-6">
                <form onSubmit={handleAddFood} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm">Name</Label>
                      <Input
                        required
                        placeholder="e.g. Chicken Biryani"
                        value={newFood.name}
                        onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                        className="h-10 rounded-xl bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Category</Label>
                      <Input
                        required
                        placeholder="e.g. Pizza, Burger, Dessert"
                        value={newFood.category}
                        onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                        className="h-10 rounded-xl bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Description</Label>
                    <Input
                      required
                      placeholder="Short description of the dish"
                      value={newFood.description}
                      onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                      className="h-10 rounded-xl bg-secondary border-border"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Price (₹)</Label>
                      <Input
                        required
                        type="number"
                        min="1"
                        placeholder="299"
                        value={newFood.price}
                        onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                        className="h-10 rounded-xl bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Prep Time (min)</Label>
                      <Input
                        type="number"
                        placeholder="20"
                        value={newFood.preparationTime}
                        onChange={(e) => setNewFood({ ...newFood, preparationTime: e.target.value })}
                        className="h-10 rounded-xl bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Image</Label>
                      <label className="flex items-center gap-2 h-10 px-3 rounded-xl bg-secondary border border-border cursor-pointer hover:border-primary/30 transition-colors">
                        <ImagePlus className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate">
                          {imageFile ? imageFile.name : "Choose image"}
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>

                  {imagePreview && (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImageFile(null); setImagePreview("") }}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={addLoading}
                    className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {addLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Add Food Item
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Food List */}
          {foodsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : foods.length === 0 ? (
            <div className="text-center py-16">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No food items yet. Click &quot;Add Item&quot; to start.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {foods.map((food) => (
                <div
                  key={food._id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-border/80 transition-colors"
                >
                  <div className="h-16 w-16 rounded-xl overflow-hidden border border-border flex-shrink-0">
                    <img src={food.image} alt={food.name} className="h-full w-full object-cover" />
                  </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg truncate flex-1">{food.name}</h3>
                          <button
                            onClick={() => handleToggleFoodAvailability(food._id, food.availability)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                              food.availability
                                ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            }`}
                          >
                            {food.availability ? "In Stock" : "Out of Stock"}
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-lg text-primary font-medium border border-border">{food.category}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{food.description}</p>
                  </div>
                  <span className="text-sm font-bold text-primary flex-shrink-0">₹{food.price}</span>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => handleToggleAvailability(food._id, food.availability)}
                      title={food.availability ? "Mark unavailable" : "Mark available"}
                    >
                      {food.availability ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                      onClick={() => handleDeleteFood(food._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== ORDERS TAB ==================== */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Orders</h2>
            <p className="text-muted-foreground text-sm mt-1">{orders.length} total orders</p>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order._id} className="bg-card border-border">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        {/* User account info */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                            {(order.userId?.name || order.customerName || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {order.userId?.name || order.customerName || "Guest"}
                            </p>
                            {order.userId?.email && (
                              <p className="text-xs text-muted-foreground truncate">{order.userId.email}</p>
                            )}
                          </div>
                        </div>

                        {/* Delivery & payment info */}
                        <div className="flex items-center gap-2 flex-wrap ml-12">
                          {order.customerName && order.userId?.name && order.customerName !== order.userId.name && (
                            <span className="text-xs px-2 py-0.5 rounded-lg bg-secondary text-muted-foreground">
                              Delivery: {order.customerName}
                            </span>
                          )}
                          {order.customerPhone && (
                            <span className="text-xs text-muted-foreground">📞 {order.customerPhone}</span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-lg ${
                            order.paymentMethod === "cod"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}>
                            {order.paymentMethod === "cod" ? "COD" : "Online"}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-lg ${
                            order.paymentStatus === "paid"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-orange-500/10 text-orange-400"
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>

                        {/* Order items */}
                        <div className="mt-3 ml-12 space-y-1">
                          {order.items.map((item, i) => (
                            <p key={i} className="text-xs text-muted-foreground">
                              {item.quantity}× {item.name} — ₹{item.price * item.quantity}
                            </p>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 ml-12">
                          {new Date(order.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-primary">₹{order.totalAmount}</span>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className={`text-xs px-3 py-1.5 rounded-lg border bg-secondary border-border ${
                            order.orderStatus === "delivered"
                              ? "text-green-400"
                              : order.orderStatus === "cancelled"
                              ? "text-destructive"
                              : "text-foreground"
                          }`}
                        >
                          <option value="placed">Placed</option>
                          <option value="preparing">Preparing</option>
                          <option value="out-for-delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== SETTINGS TAB ==================== */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Settings</h2>
            <p className="text-muted-foreground text-sm mt-1">Configure delivery fees, GST, and charges</p>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="pt-6 space-y-6">
              {settingsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Store Status Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Store Status</h3>
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center p-4 rounded-xl bg-secondary/50 border border-border">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={appSettings.isStoreOpen}
                              onChange={(e) => setAppSettings({ ...appSettings, isStoreOpen: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                          <span className={`font-medium ${appSettings.isStoreOpen ? "text-green-400" : "text-destructive"}`}>
                            {appSettings.isStoreOpen ? "Accepting Orders" : "Closed"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mr-4">
                          {appSettings.isStoreOpen
                            ? "Toggle to immediately stop accepting new orders across the platform."
                            : "The store is currently closed. Users cannot place new orders."}
                        </p>
                      </div>

                      {!appSettings.isStoreOpen && (
                        <div className="shrink-0 space-y-2">
                          <Label className="text-xs">Opening At (Optional Countdown)</Label>
                          <Input
                            type="datetime-local"
                            value={appSettings.storeOpensAt ? new Date(appSettings.storeOpensAt).toISOString().slice(0, 16) : ""}
                            onChange={(e) => setAppSettings({ ...appSettings, storeOpensAt: e.target.value || null })}
                            className="h-9 rounded-lg bg-background border-border text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Fees Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Fees & Charges</h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Delivery Fee (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={appSettings.deliveryFee}
                        onChange={(e) => setAppSettings({ ...appSettings, deliveryFee: parseFloat(e.target.value) || 0 })}
                        className="h-10 rounded-xl bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">GST (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={appSettings.gstPercent}
                        onChange={(e) => setAppSettings({ ...appSettings, gstPercent: parseFloat(e.target.value) || 0 })}
                        className="h-10 rounded-xl bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Free Delivery Above (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0 = disabled"
                        value={appSettings.freeDeliveryAbove}
                        onChange={(e) => setAppSettings({ ...appSettings, freeDeliveryAbove: parseFloat(e.target.value) || 0 })}
                        className="h-10 rounded-xl bg-secondary border-border"
                      />
                      <p className="text-[11px] text-muted-foreground">Set to 0 to always charge delivery fee</p>
                    </div>
                  </div>
                  </div>
                  <Button
                    onClick={handleSaveSettings}
                    disabled={settingsSaving}
                    className="h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                  >
                    {settingsSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ==================== COUPONS TAB ==================== */}
      {activeTab === "coupons" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Coupons</h2>
              <p className="text-muted-foreground text-sm mt-1">{coupons.length} coupons</p>
            </div>
            <Button
              onClick={() => setShowCouponForm(!showCouponForm)}
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {showCouponForm ? <X className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
              {showCouponForm ? "Cancel" : "New Coupon"}
            </Button>
          </div>

          {/* Add Coupon Form */}
          {showCouponForm && (
            <Card className="bg-card border-border border-primary/20">
              <CardContent className="pt-6">
                <form onSubmit={handleCreateCoupon} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm">Coupon Code</Label>
                      <Input
                        required
                        placeholder="e.g. WELCOME20"
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                        className="h-10 rounded-xl bg-secondary border-border uppercase"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Discount Type</Label>
                      <select
                        value={newCoupon.discountType}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as "percent" | "flat" })}
                        className="w-full h-10 px-3 rounded-xl bg-secondary border border-border text-sm"
                      >
                        <option value="percent">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Discount Value</Label>
                      <Input
                        required
                        type="number"
                        min="1"
                        placeholder={newCoupon.discountType === "percent" ? "e.g. 20" : "e.g. 50"}
                        value={newCoupon.discountValue}
                        onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: e.target.value })}
                        className="h-10 rounded-xl bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Min Order (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={newCoupon.minOrder}
                        onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                        className="h-10 rounded-xl bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Max Discount (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0 = no cap"
                        value={newCoupon.maxDiscount}
                        onChange={(e) => setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })}
                        className="h-10 rounded-xl bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Usage Limit</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0 = unlimited"
                        value={newCoupon.usageLimit}
                        onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                        className="h-10 rounded-xl bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Expires At (optional)</Label>
                    <Input
                      type="datetime-local"
                      value={newCoupon.expiresAt}
                      onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                      className="h-10 rounded-xl bg-secondary border-border w-auto"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={couponSaving}
                    className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {couponSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Tag className="mr-2 h-4 w-4" />}
                    Create Coupon
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Coupon List */}
          {couponsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-16">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No coupons yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-border/80 transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm font-mono">{coupon.code}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-lg ${coupon.isActive ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {coupon.discountType === "percent" ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}
                      {coupon.minOrder > 0 && ` · Min ₹${coupon.minOrder}`}
                      {coupon.maxDiscount > 0 && ` · Max ₹${coupon.maxDiscount}`}
                      {coupon.usageLimit > 0 && ` · ${coupon.usedCount}/${coupon.usageLimit} used`}
                      {coupon.expiresAt && ` · Expires ${new Date(coupon.expiresAt).toLocaleDateString("en-IN")}`}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-lg text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCoupon(coupon._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
