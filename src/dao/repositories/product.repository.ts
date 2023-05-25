import { RowDataPacket } from 'mysql2/promise'

import config from '../../config/config'
import { CodeError, CustomError, HandlerError, InfoError, NameError } from '../../lib/errors'
import { pool } from '../../utils/database'
import { Product } from '../interfaces/product'

class ProductRepository {
  async find (): Promise<RowDataPacket[]> {
    try {
      const query = `SELECT * FROM ${config.mysqlConfig.tables.products}`
      const [rows] = await pool.query<RowDataPacket[]>(query)

      return rows
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }

  async findOne ({ id, code, title }: { id?: number, code?: string, title?: string }): Promise<RowDataPacket> {
    try {
      let query: string
      let queryParams: any[]

      const hasId = Boolean(id)
      const hasCode = Boolean(code)
      const hasTitle = Boolean(title)

      if (!hasId && !hasCode && !hasTitle) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'The product ID, code or title must be provided.'
        })
      }

      if (hasId) {
        query = `SELECT * FROM ${config.mysqlConfig.tables.products} WHERE id = ?`
        queryParams = [id]
      } else if (hasCode) {
        query = `SELECT * FROM ${config.mysqlConfig.tables.products} WHERE code = ?`
        queryParams = [code]
      } else {
        query = `SELECT * FROM ${config.mysqlConfig.tables.products} WHERE title = ?`
        queryParams = [title]
      }

      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)

      if (rows.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Product not found'
        })
      }
      return rows[0]
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }

  async create (product: Product): Promise<RowDataPacket[]> {
    try {
      let query: string
      let queryParams: any[]

      const has = {
        category_id: Boolean(product.category_id),
        brand_id: Boolean(product.brand_id),
        title: Boolean(product.title),
        code: Boolean(product.code),
        description: Boolean(product.description),
        stock: Boolean(product.stock),
        minStock: Boolean(product.minStock),
        maxStock: Boolean(product.maxStock),
        available: Boolean(product.available),
        unitCost: Boolean(product.unitCost),
        unitPrice: Boolean(product.unitPrice)
      }

      Object.keys(has).forEach((key: string) => {
        const hasKey = Boolean(has[key as keyof typeof has])
        if (!hasKey) {
          new HandlerError().createError({
            name: NameError.QUERY_ERROR,
            code: CodeError.BAD_REQUEST,
            cause: InfoError.BAD_REQUEST,
            message: `The ${key} is required`
          })
        }
      })

      query = `SELECT * FROM ${config.mysqlConfig.tables.products} WHERE code = ?`
      queryParams = [product.code]
      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length > 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.CONFLICT,
          cause: InfoError.CONFLICT,
          message: 'Product already exists'
        })
      }

      query = `INSERT INTO ${config.mysqlConfig.tables.products} (category_id, brand_id, title, code, description, stock, minStock, maxStock, available, unitCost, unitPrice) VALUES (?)`
      queryParams = [Object.values(product)]
      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)
      return rows
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }

  async update ({ id, product }: { id: number, product: Partial<Product> }): Promise<RowDataPacket[]> {
    try {
      let query: string
      let queryParams: any[]

      const hasId = Boolean(id)
      const hasProduct = Boolean(product)

      if (!hasId) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'The id is required'
        })
      }
      if (!hasProduct) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'The product is required'
        })
      }

      let hasUpdatedField = false
      let updatedProduct: Partial<Product> = {}
      Object.entries(product).forEach(([key, value]) => {
        const hasValue = Boolean(value)
        if (hasValue && value !== undefined && value !== null) {
          hasUpdatedField = true
          updatedProduct = { ...updatedProduct, [key]: value }
        }
      })
      if (!hasUpdatedField) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'At least one field must be provided to update the product'
        })
      }

      query = `SELECT * FROM ${config.mysqlConfig.tables.products} WHERE id = ?`
      queryParams = [id]
      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Product not found'
        })
      }

      const existingProduct = rowsExist[0] as Product
      Object.keys(updatedProduct).forEach(key => {
        if (existingProduct[key] === updatedProduct[key]) {
          new HandlerError().createError({
            name: NameError.QUERY_ERROR,
            code: CodeError.BAD_REQUEST,
            cause: InfoError.BAD_REQUEST,
            message: `The field ${key} already has the same value`
          })
        }
      })

      query = `UPDATE ${config.mysqlConfig.tables.products} SET ? WHERE id = ?`
      queryParams = [updatedProduct, id]
      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)
      return rows
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }

  async delete ({ id, code }: { id?: number, code?: string }): Promise<RowDataPacket[]> {
    try {
      let query: string
      let queryParams: any[]

      const hasId = Boolean(id)
      const hasCode = Boolean(code)

      if (!hasId && !hasCode) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Either the ID or the product code must be provided'
        })
      }

      if (hasId) {
        query = `SELECT * FROM ${config.mysqlConfig.tables.products} WHERE id = ?`
        queryParams = [id]
      } else {
        query = `SELECT * FROM ${config.mysqlConfig.tables.products} WHERE code = ?`
        queryParams = [code]
      }
      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Product not found'
        })
      }

      if (hasId) {
        query = `DELETE FROM ${config.mysqlConfig.tables.products} WHERE id = ?`
        queryParams = [id]
      } else {
        query = `DELETE FROM ${config.mysqlConfig.tables.products} WHERE code = ?`
        queryParams = [code]
      }

      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)
      return rows
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }
}

export const productRepository = new ProductRepository()
export default productRepository
