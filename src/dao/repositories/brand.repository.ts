import { RowDataPacket } from 'mysql2/promise'

import config from '../../config/config'
import { CodeError, CustomError, HandlerError, InfoError, NameError } from '../../lib/errors'
import { pool } from '../../utils/database'
import { Brand } from '../interfaces/brand'

class BrandRepository {
  async find (): Promise<RowDataPacket[]> {
    try {
      const query = `SELECT * FROM ${config.mysqlConfig.tables.brands}`
      const [rows] = await pool.query<RowDataPacket[]>(query)

      return rows
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }

  async findOne ({ id, name }: { id?: number, name?: string }): Promise<RowDataPacket> {
    try {
      let query: string
      let queryParams: any[]

      const hasId = Boolean(id)
      const hasName = Boolean(name)

      if (!hasId && !hasName) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Brand name or ID must be provided'
        })
      }

      if (hasId) {
        query = `SELECT * FROM ${config.mysqlConfig.tables.brands} WHERE id = ?`
        queryParams = [id]
      } else {
        query = `SELECT * FROM ${config.mysqlConfig.tables.brands} WHERE name = ?`
        queryParams = [name]
      }

      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)

      if (rows.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Brand not found'
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

  async create (brand: Brand): Promise<RowDataPacket[]> {
    try {
      let query: string
      let queryParams: any[]

      const has = {
        name: Boolean(brand.name),
        image: Boolean(brand.image)
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

      query = `SELECT * FROM ${config.mysqlConfig.tables.brands} WHERE name = ?`
      queryParams = [brand.name]
      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length > 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.CONFLICT,
          cause: InfoError.CONFLICT,
          message: 'Brand already exists'
        })
      }

      query = `INSERT INTO ${config.mysqlConfig.tables.brands} (name, image) VALUES (?, ?)`
      queryParams = [brand.name, brand.image]
      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)
      return rows
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }

  async update ({ id, brand }: { id: number, brand: Brand }): Promise<RowDataPacket[]> {
    try {
      let query: string
      let queryParams: any[]

      const hasId = Boolean(id)
      const hasBrand = Boolean(brand)

      if (!hasId) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'The id is required'
        })
      }
      if (!hasBrand) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Brand is required'
        })
      }

      let hasUpdatedField = false
      let updatedBrand: Partial<Brand> = {}
      Object.entries(brand).forEach(([key, value]) => {
        const hasValue = Boolean(value)
        if (hasValue && value !== undefined && value !== null) {
          hasUpdatedField = true
          updatedBrand = { ...updatedBrand, [key]: value }
        }
      })
      if (!hasUpdatedField) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'At least one field must be provided to update the brand'
        })
      }

      query = `SELECT * FROM ${config.mysqlConfig.tables.brands} WHERE id = ?`
      queryParams = [id]
      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Brand not found'
        })
      }

      const existingBrand = rowsExist[0] as Brand
      Object.keys(updatedBrand).forEach(key => {
        if (existingBrand[key] === updatedBrand[key]) {
          new HandlerError().createError({
            name: NameError.QUERY_ERROR,
            code: CodeError.BAD_REQUEST,
            cause: InfoError.BAD_REQUEST,
            message: `The field ${key} already has the same value`
          })
        }
      })

      query = `UPDATE ${config.mysqlConfig.tables.brands} SET ? WHERE id = ?`
      queryParams = [updatedBrand, id]
      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)
      return rows
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }

  async delete ({ id, name }: { id?: number, name?: string }): Promise<RowDataPacket[]> {
    try {
      let query: string
      let queryParams: any[]

      const hasId = Boolean(id)
      const hasName = Boolean(name)

      if (!hasId && !hasName) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Brand name or ID must be provided'
        })
      }

      if (hasId) {
        query = `SELECT * FROM ${config.mysqlConfig.tables.brands} WHERE id = ?`
        queryParams = [id]
      } else {
        query = `SELECT * FROM ${config.mysqlConfig.tables.brands} WHERE name = ?`
        queryParams = [name]
      }
      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Brand not found'
        })
      }

      if (hasId) {
        query = `DELETE FROM ${config.mysqlConfig.tables.brands} WHERE id = ?`
        queryParams = [id]
      } else {
        query = `DELETE FROM ${config.mysqlConfig.tables.brands} WHERE name = ?`
        queryParams = [name]
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

export const brandRepository = new BrandRepository()
export default brandRepository
