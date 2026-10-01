"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { RatingStars } from "@/components/ui/RatingStars";
import { useAuth } from "@/features/auth/store/auth.store";

// Mock list of reviews written by the logged-in user
const mockReviews = [
  {
    id: "rev_1",
    productName: "Aster ANC Headphones",
    productSlug: "aster-anc-headphones",
    rating: 5,
    title: "Quiet, comfortable, dependable",
    body: "Battery life is strong and the noise control works well for daily commuting. Highly recommended!",
    createdAt: "2026-06-17T12:00:00.000Z",
  },
];

export default function AccountReviewsPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Sign in to view reviews</h1>
        <p className="text-muted-foreground">You must be logged in to view your reviews.</p>
        <Button type="button">
          <Link href="/login">Sign In</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Product Reviews</h1>
          <p className="mt-2 text-muted-foreground">Here are all the product reviews you have written.</p>
        </div>
        <Button type="button" variant="secondary">
          <Link href="/account">Back to Dashboard</Link>
        </Button>
      </div>

      {mockReviews.length === 0 ? (
        <Card className="p-8 text-center space-y-4">
          <p className="text-muted-foreground">You haven&apos;t written any reviews yet.</p>
          <Button type="button">
            <Link href="/account/orders">Review Purchased Items</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockReviews.map((rev) => (
            <Card key={rev.id}>
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground text-base">
                      <Link href={`/products/${rev.productSlug}`} className="hover:underline">
                        {rev.productName}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <RatingStars rating={rev.rating} count={0} />
                </div>
                <div className="border-t border-border pt-3">
                  <h4 className="font-bold text-sm text-foreground mb-1">{rev.title}</h4>
                  <p className="text-sm text-muted-foreground">{rev.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
