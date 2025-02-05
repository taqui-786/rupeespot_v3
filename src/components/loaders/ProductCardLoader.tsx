import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductCardLoader() {
  return (
    <Card className="w-[300px] md:w-[240px] overflow-hidden group hover:shadow-lg transition-shadow">
      <CardContent className="p-2">
        <div className="relative">
          {/* Discount badge skeleton */}
          <div className="absolute right-2 top-2 z-10">
            <Skeleton className="h-5 w-16 bg-emerald-100" />
          </div>

          {/* Product image skeleton */}
          <Skeleton className="w-full aspect-square rounded-lg" />
        </div>

        <div className="space-y-2 mt-3">
          {/* Brand name skeleton */}
          <Skeleton className="h-4 w-20" />

          {/* Product title skeletons */}
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Rating and price row */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Price and timestamp row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-14" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

