export interface Product {
  category_id: number
  brand_id: number
  title: string
  code: string
  description: string
  stock: number
  minStock: number
  maxStock: number
  available: boolean
  unitCost: number
  unitPrice: number
  [key: string]: any
}
