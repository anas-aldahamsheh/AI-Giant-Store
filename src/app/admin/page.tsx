"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { ProductImage } from "@/components/ui/ProductImage";
import { useAuth } from "@/features/auth/store/auth.store";
import { useOrders, type Order } from "@/features/checkout/store/orders.store";
import { productService } from "@/features/products/services/productService";
import type { Product } from "@/features/products/types/product.types";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { orders, cancelOrder } = useOrders();

  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic Products CRUD State
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // New Product Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("Electronics");
  const [newStock, setNewStock] = useState<Product["stockStatus"]>("in_stock");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80");
  const [newTags, setNewTags] = useState("");
  const [newAttributes, setNewAttributes] = useState("");
  const [newFaqs, setNewFaqs] = useState("");
  const [newReviewSeed, setNewReviewSeed] = useState("");
  const embeddingStatus = "Request-scoped retrieval";

  // Load products list on mount
  useEffect(() => {
    setProductsList(productService.list());
  }, []);

  // Sync productsList updates back to productService
  const refreshProductsList = () => {
    setProductsList(productService.list());
  };

  // Protect route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Dashboard Calculations
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter((o) => o.status !== "cancelled");
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return {
      revenue: totalRevenue,
      ordersCount: totalOrders,
      aov,
      productsCount: productsList.length,
    };
  }, [orders, productsList]);

  // Auth/Role validation logic
  const isUserAdmin = user?.role === "admin";

  if (isLoading) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-32 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
          <p className="text-muted-foreground">Verifying administrator credentials...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !isUserAdmin) {
    return (
      <main className="mx-auto min-h-screen max-w-xl px-6 py-24 flex items-center justify-center">
        <Card className="border-danger/30 shadow-xl bg-gradient-to-tr from-surface via-background to-surface">
          <CardContent className="p-8 text-center space-y-6">
            <div className="h-12 w-12 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto border border-danger/20">
              ⚠️
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
              <p className="text-sm text-muted-foreground">
                You do not have permission to view this page. Admin privileges are required.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button type="button">
                <Link href="/">Return Home</Link>
              </Button>
              <Button type="button" variant="secondary">
                <Link href="/login">Sign in as Admin</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Product CRUD Handlers
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const rawSlug = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/u, "-")
      .replace(/(^-|-$)/g, "");
    const slug = rawSlug || `prod-${Date.now()}`;
    const product: Product = {
      id: `prod_${Date.now()}`,
      title: newTitle,
      slug,
      shortDescription: newDescription,
      description: newDescription,
      category: newCategory,
      brand: newBrand,
      imageUrl: newImageUrl,
      gallery: [newImageUrl],
      price: Number(newPrice),
      currency: "USD",
      ratingAverage: newReviewSeed ? 5 : 0,
      ratingCount: newReviewSeed ? 1 : 0,
      stockStatus: newStock,
      tags: newTags.split(",").map((tag) => tag.trim()).filter(Boolean),
      attributes: newAttributes.split(",").map((item) => {
        const [name, value] = item.split(":");
        return { name: name?.trim() || "Spec", value: value?.trim() || "Not listed" };
      }).filter((attribute) => attribute.value !== "Not listed"),
      variants: [],
      reviews: newReviewSeed
        ? [
            {
              id: `review_${Date.now()}`,
              authorName: "Admin seed",
              rating: 5,
              title: "Seed review",
              body: newReviewSeed,
              verifiedPurchase: false,
              createdAt: new Date().toISOString(),
            },
          ]
        : [],
      faqs: newFaqs.split(";").map((item) => {
        const [question, answer] = item.split("|");
        return { question: question?.trim() || "", answer: answer?.trim() || "" };
      }).filter((faq) => faq.question && faq.answer),
      relatedProductSlugs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    productService.create(product);
    refreshProductsList();
    setIsAdding(false);
    // Reset Form
    setNewTitle("");
    setNewPrice(0);
    setNewBrand("");
    setNewDescription("");
    setNewImageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80");
    setNewTags("");
    setNewAttributes("");
    setNewFaqs("");
    setNewReviewSeed("");
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    const updated: Product = {
      ...selectedProduct,
      title: newTitle,
      price: Number(newPrice),
      brand: newBrand,
      stockStatus: newStock,
      category: newCategory,
      imageUrl: newImageUrl,
      gallery: [newImageUrl],
      description: newDescription,
      shortDescription: newDescription,
      tags: newTags.split(",").map((tag) => tag.trim()).filter(Boolean),
      attributes: newAttributes.split(",").map((item) => {
        const [name, value] = item.split(":");
        return { name: name?.trim() || "Spec", value: value?.trim() || "Not listed" };
      }).filter((attribute) => attribute.value !== "Not listed"),
      faqs: newFaqs.split(";").map((item) => {
        const [question, answer] = item.split("|");
        return { question: question?.trim() || "", answer: answer?.trim() || "" };
      }).filter((faq) => faq.question && faq.answer),
    };
    productService.update(updated);
    refreshProductsList();
    setIsEditing(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product from the store catalog?")) {
      productService.delete(id);
      refreshProductsList();
    }
  };

  const handleResetCatalog = () => {
    if (confirm("Clear all store products? This will remove all added items.")) {
      productService.resetToDefault();
      refreshProductsList();
    }
  };

  // Tab Content: Overview
  const renderOverview = () => {
    return (
      <div className="space-y-6 motion-safe:animate-[fade-in_200ms_ease-out]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-5 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Total Revenue</span>
              <p className="text-2xl font-bold text-foreground">
                <PriceDisplay amount={stats.revenue} />
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Total Orders</span>
              <p className="text-2xl font-bold text-foreground">{stats.ordersCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Avg Order Value</span>
              <p className="text-2xl font-bold text-foreground">
                <PriceDisplay amount={stats.aov} />
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Catalog Size</span>
              <p className="text-2xl font-bold text-foreground">{stats.productsCount} items</p>
            </CardContent>
          </Card>
        </div>

        {/* CSS Chart Visualization */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-foreground">Revenue Trend</h3>
            <div className="h-48 w-full bg-surface/30 border border-border rounded-card flex items-end justify-between p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-500/5 to-transparent"></div>
              {/* Simple simulated chart bars */}
              {[40, 60, 45, 90, 80, 110, 130, 95, 120, 140, 160, 200].map((val, idx) => (
                <div key={idx} className="group relative flex w-[6%] flex-col justify-end rounded-t-button bg-brand-200 transition hover:bg-brand-600" style={{ height: `${(val / 200) * 100}%` }}>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-0.5 rounded shadow">
                    ${val * 10}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-2">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Orders List */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-foreground">Recent Orders</h3>
              <div className="divide-y divide-border text-sm">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-mono text-xs uppercase text-foreground font-semibold">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <PriceDisplay amount={order.total} />
                      <Badge variant={order.status === "delivered" ? "success" : "warning"}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Products List */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-foreground">Popular Products</h3>
              <div className="divide-y divide-border text-sm">
                {productsList.slice(0, 3).map((prod) => (
                  <div key={prod.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0">
                        <ProductImage src={prod.imageUrl} alt={prod.title} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{prod.title}</p>
                        <p className="text-xs text-muted-foreground">{prod.brand}</p>
                      </div>
                    </div>
                    <PriceDisplay amount={prod.price} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // Tab Content: Products Manager
  const renderProducts = () => {
    return (
      <div className="space-y-6 motion-safe:animate-[fade-in_200ms_ease-out]">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-foreground text-lg">Product Catalog Management</h3>
          <div className="flex gap-2">
            <Button type="button" onClick={() => { setIsAdding(true); setIsEditing(false); setSelectedProduct(null); }}>
              Create Product
            </Button>
            <Button type="button" variant="secondary" onClick={handleResetCatalog}>
              Reset to Defaults
            </Button>
          </div>
        </div>

        {/* Add Product Form */}
        {isAdding && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h4 className="font-bold text-foreground">Create New Product</h4>
              <form onSubmit={handleAddProduct} className="grid gap-4 sm:grid-cols-2">
                <Input label="Title" name="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
                <Input label="Price (USD)" name="price" type="number" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} required />
                <Input label="Brand" name="brand" value={newBrand} onChange={(e) => setNewBrand(e.target.value)} required />
                <Select
                  label="Category"
                  name="category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  options={[
                    { label: "Electronics", value: "Electronics" },
                    { label: "Audio", value: "Audio" },
                    { label: "Wearables", value: "Wearables" },
                    { label: "Cameras", value: "Cameras" },
                    { label: "Gaming", value: "Gaming" },
                    { label: "Home", value: "Home" },
                    { label: "Office", value: "Office" },
                    { label: "Accessories", value: "Accessories" },
                  ]}
                />
                <Select
                  label="Stock Status"
                  name="stock"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value as Product["stockStatus"])}
                  options={[
                    { label: "In Stock", value: "in_stock" },
                    { label: "Low Stock", value: "low_stock" },
                    { label: "Out of Stock", value: "out_of_stock" },
                  ]}
                />
                <div className="sm:col-span-2">
                  <Input label="Short Description" name="desc" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} required />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Product Image URL" name="image" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} required />
                </div>
                <Input label="Tags editor" name="tags" value={newTags} onChange={(e) => setNewTags(e.target.value)} placeholder="gaming, travel, premium" />
                <Input label="Specs / attributes editor" name="attributes" value={newAttributes} onChange={(e) => setNewAttributes(e.target.value)} placeholder="Battery Life: 20h, Warranty: 2 years" />
                <div className="sm:col-span-2">
                  <Input label="FAQ editor" name="faqs" value={newFaqs} onChange={(e) => setNewFaqs(e.target.value)} placeholder="Question?|Answer.; Another?|Answer." />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Demo review seed" name="review" value={newReviewSeed} onChange={(e) => setNewReviewSeed(e.target.value)} placeholder="Optional demo review" />
                </div>
                <div className="sm:col-span-2 flex gap-4">
                  <Button type="submit">Save Product</Button>
                  <Button type="button" variant="secondary" onClick={() => setIsAdding(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Edit Product Form */}
        {isEditing && selectedProduct && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h4 className="font-bold text-foreground">Edit Product Details</h4>
              <form onSubmit={handleUpdateProduct} className="grid gap-4 sm:grid-cols-2">
                <Input label="Title" name="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
                <Input label="Price (USD)" name="price" type="number" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} required />
                <Input label="Brand" name="brand" value={newBrand} onChange={(e) => setNewBrand(e.target.value)} required />
                <Select
                  label="Category"
                  name="category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  options={[
                    { label: "Electronics", value: "Electronics" },
                    { label: "Audio", value: "Audio" },
                    { label: "Wearables", value: "Wearables" },
                    { label: "Cameras", value: "Cameras" },
                    { label: "Gaming", value: "Gaming" },
                    { label: "Home", value: "Home" },
                    { label: "Office", value: "Office" },
                    { label: "Accessories", value: "Accessories" },
                  ]}
                />
                <Select
                  label="Stock Status"
                  name="stock"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value as Product["stockStatus"])}
                  options={[
                    { label: "In Stock", value: "in_stock" },
                    { label: "Low Stock", value: "low_stock" },
                    { label: "Out of Stock", value: "out_of_stock" },
                  ]}
                />
                <div className="sm:col-span-2">
                  <Input label="Short Description" name="desc" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} required />
                </div>
                <div className="sm:col-span-2">
                  <Input label="Product Image URL" name="image" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} required />
                </div>
                <Input label="Tags editor" name="tags" value={newTags} onChange={(e) => setNewTags(e.target.value)} />
                <Input label="Specs / attributes editor" name="attributes" value={newAttributes} onChange={(e) => setNewAttributes(e.target.value)} />
                <div className="sm:col-span-2">
                  <Input label="FAQ editor" name="faqs" value={newFaqs} onChange={(e) => setNewFaqs(e.target.value)} />
                </div>
                <div className="sm:col-span-2 flex gap-4">
                  <Button type="submit">Update Details</Button>
                  <Button type="button" variant="secondary" onClick={() => { setIsEditing(false); setSelectedProduct(null); }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products Table/List */}
        <div className="grid gap-4">
          {productsList.map((prod) => (
            <Card key={prod.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 flex-shrink-0">
                    <ProductImage src={prod.imageUrl} alt={prod.title} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{prod.title}</h4>
                    <p className="text-xs text-muted-foreground">ID: {prod.id} • Brand: {prod.brand}</p>
                    <Badge variant={prod.stockStatus === "in_stock" ? "success" : "warning"} className="mt-1">
                      {prod.stockStatus.replace("_", " ")}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="font-bold text-foreground text-base">
                    <PriceDisplay amount={prod.price} />
                  </span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedProduct(prod);
                        setNewTitle(prod.title);
                        setNewPrice(prod.price);
                        setNewBrand(prod.brand);
                        setNewCategory(prod.category);
                        setNewStock(prod.stockStatus);
                        setNewImageUrl(prod.imageUrl);
                        setNewDescription(prod.shortDescription || "");
                        setNewTags(prod.tags.join(", "));
                        setNewAttributes(prod.attributes.map((attribute) => `${attribute.name}: ${attribute.value}`).join(", "));
                        setNewFaqs(prod.faqs.map((faq) => `${faq.question}|${faq.answer}`).join("; "));
                        setNewReviewSeed(prod.reviews[0]?.body ?? "");
                        setIsEditing(true);
                        setIsAdding(false);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteProduct(prod.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Tab Content: Orders Manager
  const renderOrders = () => {
    return (
      <div className="space-y-6 motion-safe:animate-[fade-in_200ms_ease-out]">
        <h3 className="font-bold text-foreground text-lg">Manage Customer Orders</h3>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between border-b border-border pb-3 text-sm">
                  <div>
                    <p className="font-mono text-xs uppercase text-foreground font-semibold">ID: {order.id}</p>
                    <p className="text-xs text-muted-foreground">Date: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right sm:text-right mt-2 sm:mt-0">
                    <span className="text-muted-foreground block text-xs">Customer</span>
                    <span className="font-semibold block">{order.shippingAddress.name}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.title} x {item.quantity}</span>
                      <PriceDisplay amount={item.price * item.quantity} />
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-border pt-2 font-bold text-sm">
                    <span>Total Amount</span>
                    <PriceDisplay amount={order.total} />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">Status:</span>
                    <Badge variant={order.status === "delivered" ? "success" : order.status === "cancelled" ? "danger" : "warning"}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    {order.status !== "cancelled" && order.status !== "delivered" && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => cancelOrder(order.id)}
                      >
                        Cancel demo order
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderAIAdmin = () => {
    const sampleSources = productsList.slice(0, 4);

    return (
      <div className="space-y-6 motion-safe:animate-[fade-in_200ms_ease-out]">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-white/70 shadow-soft">
            <CardContent className="space-y-2 p-5">
              <span className="text-xs font-black uppercase text-slate-500">Embedding status</span>
              <p className="text-lg font-black text-slate-950">{embeddingStatus}</p>
              <p className="text-xs text-slate-500">Search data is rebuilt from this browser&apos;s products for each chat request.</p>
            </CardContent>
          </Card>
          <Card className="border-white/70 shadow-soft">
            <CardContent className="space-y-2 p-5">
              <span className="text-xs font-black uppercase text-slate-500">AI usage cost</span>
              <p className="text-lg font-black text-slate-950">Not tracked</p>
              <p className="text-xs text-slate-500">Provider usage reporting needs server persistence.</p>
            </CardContent>
          </Card>
          <Card className="border-white/70 shadow-soft">
            <CardContent className="space-y-2 p-5">
              <span className="text-xs font-black uppercase text-slate-500">Index jobs</span>
              <p className="text-lg font-black text-slate-950">Not applicable</p>
              <p className="text-xs text-slate-500">There is no persistent index to retry.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/70 shadow-soft">
          <CardContent className="p-6">
            <h3 className="text-lg font-black text-slate-950">AI conversations table</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2">Conversation</th>
                    <th className="py-2">Intent</th>
                    <th className="py-2">Provider</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {["Headphones under budget", "Compare smart watches", "Gift recommendation"].map((row) => (
                    <tr key={row}>
                      <td className="py-3 font-semibold text-slate-950">{row}</td>
                      <td className="py-3 text-slate-600">advisor</td>
                      <td className="py-3 text-slate-600">Gemini/fallback</td>
                      <td className="py-3"><Badge variant="success">grounded</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-white/70 shadow-soft">
            <CardContent className="p-6">
              <h3 className="font-black text-slate-950">Retrieved sources view</h3>
              <div className="mt-4 space-y-3">
                {sampleSources.map((product) => (
                  <div key={product.id} className="rounded-card bg-slate-50 p-3 text-sm">
                    <p className="font-black text-slate-950">{product.title}</p>
                    <p className="text-xs text-slate-500">{product.id} · {product.category} · {product.brand}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/70 shadow-soft">
            <CardContent className="p-6">
              <h3 className="font-black text-slate-950">Embedding jobs table</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between rounded-card bg-slate-50 p-3">
                  <span>Full catalog reindex</span>
                  <Badge variant="success">ready</Badge>
                </div>
                <div className="flex justify-between rounded-card bg-slate-50 p-3">
                  <span>Single product reindex</span>
                  <Badge variant="warning">manual</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const tabItems = [
    { id: "overview", label: "Overview", content: renderOverview() },
    { id: "products", label: "Products Catalog", content: renderProducts() },
    { id: "orders", label: "Orders Manager", content: renderOrders() },
    { id: "ai", label: "AI Admin", content: renderAIAdmin() },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="dark-mesh-bg border-b border-white/10">
        <div className="premium-container py-10 text-white">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Admin command center</p>
              <h1 className="mt-3 text-4xl font-black">Giant Store Admin Panel</h1>
              <p className="mt-2 text-sm text-white/70">Control metrics, product inventory, customer orders, and AI retrieval jobs.</p>
            </div>
            <Badge variant="neutral" className="border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
              Write safety enabled
            </Badge>
          </div>
        </div>
      </section>

      <section className="premium-container grid gap-6 py-8 lg:grid-cols-[15rem_1fr]">
        <aside className="h-fit rounded-panel border border-white/70 bg-white p-3 shadow-soft">
          {tabItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`mb-2 w-full rounded-card px-3 py-2 text-left text-sm font-black transition ${
                activeTab === item.id ? "bg-brand-600 text-white shadow-glow" : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </aside>
        <div className="min-w-0">
          <Tabs items={tabItems} activeId={activeTab} onChange={setActiveTab} />
        </div>
      </section>
    </main>
  );
}
