"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { RatingStars } from "@/components/ui/RatingStars";
import { productService } from "@/features/products/services/productService";
import type { Product, ProductReview } from "@/features/products/types/product.types";

export type ProductReviewsProps = {
  initialProduct: Product;
};

export function ProductReviews({ initialProduct }: ProductReviewsProps) {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // Sync client-side database
  useEffect(() => {
    const fresh = productService.getBySlug(initialProduct.slug);
    if (fresh) {
      setProduct(fresh);
    }
  }, [initialProduct.slug]);

  // Calculations
  const stats = useMemo(() => {
    const list = product.reviews || [];
    const count = list.length;
    if (count === 0) {
      return { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
    }
    const sum = list.reduce((total, r) => total + r.rating, 0);
    const average = parseFloat((sum / count).toFixed(1));

    // Stars breakdown from 5 down to 1
    const dist = [0, 0, 0, 0, 0];
    list.forEach((r) => {
      const idx = 5 - r.rating;
      if (idx >= 0 && idx < 5) dist[idx]++;
    });

    return {
      average,
      count,
      distribution: dist.map((c) => Math.round((c / count) * 100)),
    };
  }, [product.reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !title.trim() || !body.trim()) return;

    const newReview: ProductReview = {
      id: `rev_${Date.now()}`,
      authorName,
      rating,
      title,
      body,
      verifiedPurchase: false,
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [...(product.reviews || []), newReview];
    const updatedProduct: Product = {
      ...product,
      reviews: updatedReviews,
      ratingCount: updatedReviews.length,
      ratingAverage: parseFloat(
        (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
      ),
    };

    productService.update(updatedProduct);
    setProduct(updatedProduct);
    setSuccessMsg("Review submitted successfully! Thank you.");

    // Reset Form
    setAuthorName("");
    setTitle("");
    setBody("");
    setShowForm(false);

    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-panel border border-cyan-100 bg-cyan-50 p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">Review summary</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {product.reviews.length > 0
            ? `Average rating is ${stats.average}/5 across ${stats.count} local reviews. These reviews are not purchase verified.`
            : "No local reviews yet. Reviews in this demo are not purchase verified."}
        </p>
      </div>

      {/* Average score and Distribution breakdown */}
      <div className="grid gap-6 rounded-panel border border-white/70 bg-white p-5 shadow-soft sm:grid-cols-[10rem_1fr]">
        <div className="text-center sm:text-left space-y-2">
          <p className="text-5xl font-extrabold text-foreground">{stats.average}</p>
          <RatingStars rating={stats.average} />
          <p className="text-xs text-muted-foreground">{stats.count} customer reviews</p>
        </div>
        <div className="space-y-2">
          {stats.distribution.map((percentage, index) => {
            const stars = 5 - index;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 text-right font-medium">{stars} star</span>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-400" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="w-8 text-left text-muted-foreground">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        {successMsg && (
          <div className="mb-4 rounded-button bg-green-50 p-3 text-sm text-green-700 border border-green-200">
            {successMsg}
          </div>
        )}

        {!showForm ? (
          <Button type="button" variant="secondary" className="w-full" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        ) : (
          <Card className="border-white/70 shadow-soft">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold text-foreground">Submit Your Review</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-sm font-semibold text-foreground block mb-2">Rating</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-xl focus:outline-none transition ${star <= rating ? "text-amber-500 scale-110" : "text-muted"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  label="Name"
                  name="author"
                  placeholder="John Doe"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                />
                <Input
                  label="Review Title"
                  name="title"
                  placeholder="Wonderful audio quality"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Review Body</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-button border border-border bg-surface px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
                    placeholder="Tell us what you liked or disliked about this product..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="flex gap-4">
                  <Button type="submit">Submit Review</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Review List */}
      <div className="space-y-4 pt-4 border-t border-border">
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <article key={review.id} className="rounded-panel border border-white/70 bg-white p-4 shadow-soft">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-foreground text-sm">{review.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">By {review.authorName} on {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <RatingStars rating={review.rating} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{review.body}</p>
              <div className="mt-3 rounded-card border border-dashed border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-500">
                Review images placeholder
              </div>
              <button
                type="button"
                className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                onClick={() =>
                  setHelpfulVotes((current) => ({
                    ...current,
                    [review.id]: (current[review.id] ?? 0) + 1,
                  }))
                }
              >
                Helpful · {helpfulVotes[review.id] ?? 0}
              </button>
            </article>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No reviews yet. Be the first to review this product!</p>
        )}
      </div>
    </div>
  );
}
