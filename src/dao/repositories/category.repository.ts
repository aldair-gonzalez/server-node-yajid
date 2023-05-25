import { RowDataPacket } from 'mysql2/promise'

import config from '../../config/config'
import { CodeError, CustomError, HandlerError, InfoError, NameError } from '../../lib/errors'
import { pool } from '../../utils/database'
import { Category } from '../interfaces/category'

class CategoryRepository {
  async find (): Promise<RowDataPacket[]> {
    try {
      const query = `SELECT * FROM ${config.mysqlConfig.tables.categories}`
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
          message: 'You must provide the ID or name of the category'
        })
      }

      if (hasId) {
        query = `SELECT * FROM ${config.mysqlConfig.tables.categories} WHERE id = ?`
        queryParams = [id]
      } else {
        query = `SELECT * FROM ${config.mysqlConfig.tables.categories} WHERE name = ?`
        queryParams = [name]
      }

      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)

      if (rows.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Category not found'
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

  async create (category: Category): Promise<RowDataPacket[]> {
    try {
      let query: string
      let queryParams: any[]

      const has = {
        name: Boolean(category.name),
        description: Boolean(category.description)
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

      query = `SELECT * FROM ${config.mysqlConfig.tables.categories} WHERE name = ?`
      queryParams = [category.name]
      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length > 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.CONFLICT,
          cause: InfoError.CONFLICT,
          message: 'Category already exists'
        })
      }

      query = `INSERT INTO ${config.mysqlConfig.tables.categories} (name, description) VALUES (?)`
      queryParams = [Object.values(category)]
      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)
      return rows
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }

  async update ({ id, category }: { id: number, category: Category }): Promise<RowDataPacket[]> {
    try {
      let query: string
      let queryParams: any[]

      const hasId = Boolean(id)
      const hasCategory = Boolean(category)

      if (!hasId) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'The id is required'
        })
      }
      if (!hasCategory) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Category is required'
        })
      }

      let hasUpdatedField = false
      let updatedCategory: Partial<Category> = {}
      Object.entries(category).forEach(([key, value]) => {
        const hasValue = Boolean(value)
        if (hasValue && value !== undefined && value !== null) {
          hasUpdatedField = true
          updatedCategory = { ...updatedCategory, [key]: value }
        }
      })
      if (!hasUpdatedField) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'At least one field must be provided to update the category'
        })
      }

      query = `SELECT * FROM ${config.mysqlConfig.tables.categories} WHERE id = ?`
      queryParams = [id]
      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Category not found'
        })
      }

      const existingCategory = rowsExist[0] as Category
      Object.keys(updatedCategory).forEach(key => {
        if (existingCategory[key] === updatedCategory[key]) {
          new HandlerError().createError({
            name: NameError.QUERY_ERROR,
            code: CodeError.BAD_REQUEST,
            cause: InfoError.BAD_REQUEST,
            message: `The field ${key} already has the same value`
          })
        }
      })

      query = `UPDATE ${config.mysqlConfig.tables.categories} SET ? WHERE id = ?`
      queryParams = [updatedCategory, id]
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
          message: 'You must provide the ID or the name of the category'
        })
      }

      if (hasId) {
        query = `SELECT * FROM ${config.mysqlConfig.tables.categories} WHERE id = ?`
        queryParams = [id]
      } else {
        query = `SELECT * FROM ${config.mysqlConfig.tables.categories} WHERE name = ?`
        queryParams = [name]
      }

      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Category not found'
        })
      }

      if (hasId) {
        query = `DELETE FROM ${config.mysqlConfig.tables.categories} WHERE id = ?`
        queryParams = [id]
      } else {
        query = `DELETE FROM ${config.mysqlConfig.tables.categories} WHERE name = ?`
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

export const categoryRepository = new CategoryRepository()
export default categoryRepository
