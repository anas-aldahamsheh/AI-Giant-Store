"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Checkbox } from "@/components/ui/Checkbox";
import { useAuth } from "@/features/auth/store/auth.store";

export default function AccountPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    updateProfile,
    addAddress,
    removeAddress,
    setDefaultAddress,
    updateNotificationPreferences,
    logout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");

  // Profile Form State
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrName, setAddrName] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPostalCode, setAddrPostalCode] = useState("");
  const [addrCountry, setAddrCountry] = useState("USA");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrDefault, setAddrDefault] = useState(false);

  // Notification Preferences State
  const [prefOrder, setPrefOrder] = useState(true);
  const [prefPromo, setPrefPromo] = useState(false);
  const [prefNews, setPrefNews] = useState(true);
  const [prefMessage, setPrefMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileEmail(user.email || "");
      setPrefOrder(user.notificationPreferences?.orderUpdates ?? true);
      setPrefPromo(user.notificationPreferences?.promotions ?? false);
      setPrefNews(user.notificationPreferences?.newsletter ?? true);
    }
  }, [user]);

  // Protect route
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-32 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading account details...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    const success = await updateProfile(profileName, profileEmail);
    if (success) {
      setProfileMessage("Profile updated successfully!");
      setTimeout(() => setProfileMessage(null), 3000);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({
      name: addrName,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      postalCode: addrPostalCode,
      country: addrCountry,
      phone: addrPhone,
      isDefault: addrDefault,
    });
    // Reset form
    setAddrName("");
    setAddrStreet("");
    setAddrCity("");
    setAddrState("");
    setAddrPostalCode("");
    setAddrPhone("");
    setAddrDefault(false);
    setShowAddAddress(false);
  };

  const handlePrefsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefMessage(null);
    updateNotificationPreferences({
      orderUpdates: prefOrder,
      promotions: prefPromo,
      newsletter: prefNews,
    });
    setPrefMessage("Preferences updated successfully!");
    setTimeout(() => setPrefMessage(null), 3000);
  };

  const defaultAddr = user?.addresses?.find((a) => a.isDefault);

  const tabItems = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="space-y-6 motion-safe:animate-[fade-in_800ms_cubic-bezier(0.16,1,0.3,1)_both]">
          <Card className="border-white/70 shadow-soft">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Account Overview</h2>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <span className="block text-muted-foreground">Display Name</span>
                  <span className="font-semibold text-foreground">{user.name}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Email Address</span>
                  <span className="font-semibold text-foreground">{user.email}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Account Type</span>
                  <span className="font-semibold text-foreground capitalize">{user.role}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Customer ID</span>
                  <span className="font-mono text-xs text-foreground">{user.id}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/70 shadow-soft">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Default Address</h2>
              {defaultAddr ? (
                <div className="text-sm space-y-1">
                  <p className="font-bold text-foreground">{defaultAddr.name}</p>
                  <p className="text-muted-foreground">{defaultAddr.street}</p>
                  <p className="text-muted-foreground">
                    {defaultAddr.city}, {defaultAddr.state} {defaultAddr.postalCode}
                  </p>
                  <p className="text-muted-foreground">{defaultAddr.country}</p>
                  <p className="text-muted-foreground">Phone: {defaultAddr.phone}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No default shipping address set.</p>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-4">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="inline-flex h-11 items-center justify-center rounded-button bg-gradient-to-r from-brand-600 to-violet-500 px-6 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5"
              >
                Go to Admin Panel
              </Link>
            )}
            <Button type="button" variant="secondary" onClick={() => router.push("/account/orders")}>
              View My Orders
            </Button>
            <Button type="button" variant="secondary" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "profile",
      label: "Edit Profile",
      content: (
        <Card className="motion-safe:animate-[fade-in_800ms_cubic-bezier(0.16,1,0.3,1)_both]">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Profile Settings</h2>
            {profileMessage && (
              <div className="rounded-button border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                {profileMessage}
              </div>
            )}
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                required
              />
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "addresses",
      label: "Shipping Addresses",
      content: (
        <div className="space-y-6 motion-safe:animate-[fade-in_800ms_cubic-bezier(0.16,1,0.3,1)_both]">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">Manage Addresses</h2>
            {!showAddAddress && (
              <Button type="button" onClick={() => setShowAddAddress(true)}>
                Add New Address
              </Button>
            )}
          </div>

          {showAddAddress && (
            <Card className="border-white/70 shadow-soft">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-foreground">Add New Shipping Address</h3>
                <form onSubmit={handleAddressSubmit} className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      label="Address Label (e.g. Home, Office)"
                      name="label"
                      placeholder="Home"
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      label="Street Address"
                      name="street"
                      placeholder="123 Main St"
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    label="City"
                    name="city"
                    placeholder="New York"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    required
                  />
                  <Input
                    label="State / Province"
                    name="state"
                    placeholder="NY"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    required
                  />
                  <Input
                    label="Postal Code"
                    name="postalCode"
                    placeholder="10001"
                    value={addrPostalCode}
                    onChange={(e) => setAddrPostalCode(e.target.value)}
                    required
                  />
                  <Input
                    label="Country"
                    name="country"
                    placeholder="USA"
                    value={addrCountry}
                    onChange={(e) => setAddrCountry(e.target.value)}
                    required
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Phone Number"
                      name="phone"
                      placeholder="+1 555-0199"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2 py-2">
                    <Checkbox
                      label="Set as default shipping address"
                      name="default"
                      checked={addrDefault}
                      onChange={(e) => setAddrDefault(e.target.checked)}
                    />
                  </div>
                  <div className="sm:col-span-2 flex gap-4 mt-2">
                    <Button type="submit">Save Address</Button>
                    <Button type="button" variant="secondary" onClick={() => setShowAddAddress(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {(user?.addresses || []).map((addr) => (
              <Card key={addr.id} className={addr.isDefault ? "border-brand-200 ring-1 ring-brand-200 shadow-soft" : "border-white/70 shadow-soft"}>
                <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-foreground">{addr.name}</p>
                      {addr.isDefault && (
                        <span className="rounded-button bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{addr.street}</p>
                    <p className="text-muted-foreground">
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p className="text-muted-foreground">{addr.country}</p>
                    <p className="text-muted-foreground">Phone: {addr.phone}</p>
                  </div>

                  <div className="flex gap-3 text-xs border-t border-border pt-3">
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(addr.id)}
                        className="font-semibold text-brand-700 hover:underline"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeAddress(addr.id)}
                      className="text-danger font-semibold hover:underline ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      content: (
        <Card className="motion-safe:animate-[fade-in_800ms_cubic-bezier(0.16,1,0.3,1)_both]">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-bold text-foreground">Notification Preferences</h2>
            {prefMessage && (
              <div className="rounded-button border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                {prefMessage}
              </div>
            )}
            <form onSubmit={handlePrefsSubmit} className="space-y-5">
              <Checkbox
                label="Order updates"
                name="prefOrder"
                checked={prefOrder}
                onChange={(e) => setPrefOrder(e.target.checked)}
                description="Get emails about your shipping progress and orders."
              />
              <Checkbox
                label="Promotional emails"
                name="prefPromo"
                checked={prefPromo}
                onChange={(e) => setPrefPromo(e.target.checked)}
                description="Receive updates on deals, coupons, and newly stocked inventory."
              />
              <Checkbox
                label="Newsletter"
                name="prefNews"
                checked={prefNews}
                onChange={(e) => setPrefNews(e.target.checked)}
                description="Giant Store monthly digest on trending styles and electronic gear."
              />
              <div className="pt-2">
                <Button type="submit">Save Preferences</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mesh-bg border-b border-white/70">
        <div className="premium-container py-12">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700">
                Account center
              </p>
              <h1 className="mt-3 text-4xl font-black text-slate-950">My Account</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Manage your profile details, shipping addresses, notification settings, and order history from one premium dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex h-11 items-center justify-center rounded-button bg-gradient-to-r from-brand-600 to-violet-500 px-4 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5"
                >
                  Admin Panel
                </Link>
              )}
              <Button type="button" variant="secondary" onClick={() => router.push("/account/orders")}>
                Orders
              </Button>
              <Link
                href="/account/wishlist"
                className="inline-flex h-11 items-center justify-center rounded-button border border-border bg-surface text-foreground font-semibold hover:bg-brand-50 transition px-4 text-sm"
              >
                Wishlist
              </Link>
              <Button type="button" variant="ghost" onClick={logout}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-container py-10">
        <Tabs items={tabItems} activeId={activeTab} onChange={setActiveTab} />
      </section>
    </main>
  );
}
