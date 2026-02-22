"use client"

import { useState, useEffect, useRef } from "react"
import { io as ioClient, Socket } from "socket.io-client"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import api from "@/lib/api"
import {
  Package,
  IndianRupee,
  Users,
  UtensilsCrossed,
  TrendingUp,
  Plus,
  Trash2,
  Loader2,
  ImagePlus,
  X,
  Eye, EyeOff,
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
  const [activeTab, setActiveTab] = useState<"dashboard" | "foods" | "orders">("dashboard")

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
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add food item")
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

  const TABS = [
    { key: "dashboard", label: "Dashboard" },
    { key: "foods", label: "Food Items" },
    { key: "orders", label: "Orders" },
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
              <p className="text-muted-foreground">No food items yet. Click "Add Item" to start.</p>
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
                      <h4 className="font-semibold text-sm truncate">{food.name}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-secondary text-muted-foreground">{food.category}</span>
                      {!food.availability && (
                        <span className="text-xs px-2 py-0.5 rounded-lg bg-destructive/10 text-destructive">Unavailable</span>
                      )}
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
    </div>
  )
}
