export interface Product {
  id: number
  title: string
  price: number
  brand: string
  sku: string
  rating: number
  category: string
  availabilityStatus: string
  thumbnail: string
  description: string
  stock: number
  discountPercentage: number
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type ProductPatch = Partial<Pick<Product, 'title' | 'price' | 'brand' | 'sku'>>
