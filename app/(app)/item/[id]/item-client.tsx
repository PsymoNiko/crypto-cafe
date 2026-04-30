"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/components/cart-context";
import { formatTon } from "@/utils/ton";
import { ArrowLeft, Plus, Star } from "lucide-react";
import type { MenuItem } from "../../menu-data";

type Comment = {
  id: string;
  phone: string;
  name?: string;
  text: string;
  rating: number;
  date: string;
};

const SAMPLE_COMMENTS: Record<string, Comment[]> = {
  // Add your sample comments or fetch from an API
};

export default function ItemDetailClient({ item }: { item: MenuItem }) {
  const { addItem } = useCart();
  const [comments, setComments] = React.useState<Comment[]>(
    SAMPLE_COMMENTS[item.id] || []
  );
  const [phone, setPhone] = React.useState("");
  const [name, setName] = React.useState("");
  const [commentText, setCommentText] = React.useState("");
  const [rating, setRating] = React.useState(5);

  const discountedPrice = item.discount
    ? item.priceTon * (1 - item.discount / 100)
    : item.priceTon;

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      priceTon: discountedPrice,
      quantity: 1,
      image: item.image,
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !commentText) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      phone,
      name: name || undefined,
      text: commentText,
      rating,
      date: new Date().toISOString().split("T")[0],
    };
    setComments((prev) => [newComment, ...prev]);
    setPhone("");
    setName("");
    setCommentText("");
    setRating(5);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to menu
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={item.image || "/placeholder.png"}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <p className="text-muted-foreground mt-2">{item.description}</p>
          </div>
          {item.discount ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {formatTon(discountedPrice)} TON
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatTon(item.priceTon)} TON
                </span>
                <Badge variant="destructive">-{item.discount}%</Badge>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-primary">
              {formatTon(item.priceTon)} TON
            </div>
          )}
          <Button onClick={handleAddToCart} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name (optional)</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="comment">Your comment *</Label>
                <Textarea
                  id="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">Submit Review</Button>
            </form>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet. Be the first!</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          {c.name || c.phone.slice(0, 4) + "***" + c.phone.slice(-2)}
                        </span>
                        <div className="flex gap-0.5 ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < c.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{c.date}</span>
                    </div>
                    <p className="mt-2 text-sm">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}