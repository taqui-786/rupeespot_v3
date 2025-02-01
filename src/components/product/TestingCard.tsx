import React from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock } from "lucide-react"
import Image from "next/image"

interface ProductCardProps {
  imageUrl: string
  title: string
  rating: number
  ratingCount: number
  currentPrice: number
  originalPrice: number
  discountPercentage: number
  seller: string
  timeAdded: string
}

function ProductCard({
  imageUrl,
  title,
  rating,
  ratingCount,
  currentPrice,
  originalPrice,
  discountPercentage,
  seller,
  timeAdded
}: ProductCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="transition-transform  bg-cover "
        />
      </div>
      <CardContent className="p-4">
        <h2 className="font-semibold text-lg line-clamp-2 mb-2">{title}</h2>
        <div className="flex items-center mb-2">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="font-medium mr-1">{rating}</span>
          <span className="text-sm text-gray-500">({ratingCount} ratings)</span>
        </div>
        <div className="flex items-baseline mb-2">
          <span className="text-2xl font-bold mr-2">₹{currentPrice}</span>
          <span className="text-sm text-gray-500 line-through mr-2">₹{originalPrice}</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {discountPercentage}% off
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src={seller === 'AMAZON' ? '/placeholder.svg?height=20&width=60' : '/placeholder.svg?height=20&width=20'}
            alt={seller}
            width={seller === 'AMAZON' ? 60 : 20}
            height={20}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">{seller}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {timeAdded}
        </div>
      </CardFooter>
    </Card>
  )
}

// Example usage
export default function ExampleCard({data}:{data:any}) {
  return (
    <div className="p-4 bg-gray-100 max-h-20 flex items-center justify-center">
      <ProductCard
        imageUrl={data.image}
        title="The Power of Curiosity: In and Beyond Classrooms"
        rating={4.6}
        ratingCount={24}
        currentPrice={270}
        originalPrice={399}
        discountPercentage={32}
        seller="AMAZON"
        timeAdded="1 month ago"
      />
    </div>
  )
}