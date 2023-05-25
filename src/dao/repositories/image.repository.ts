import { RowDataPacket } from 'mysql2/promise'

import config from '../../config/config'
import { CodeError, CustomError, HandlerError, InfoError, NameError } from '../../lib/errors'
import { pool } from '../../utils/database'
import { Image } from '../interfaces/image'

class ImageRepository {
  async find (): Promise<RowDataPacket[]> {
    try {
      const query = `SELECT * FROM ${config.mysqlConfig.tables.images}`
      const [rows] = await pool.query<RowDataPacket[]>(query)

      return rows
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }

  async findOne ({ id }: { id?: number }): Promise<RowDataPacket> {
    try {
      const hasId = Boolean(id)

      if (!hasId) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'Image ID must be provided'
        })
      }
      const query = `SELECT * FROM ${config.mysqlConfig.tables.images} WHERE id = ?`
      const queryParams = [id]

      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)

      if (rows.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Image not found'
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

  async create (image: Image): Promise<RowDataPacket[]> {
    try {
      let query: string
      let queryParams: any[]

      const has = {
        product_id: Boolean(image.product_id),
        url: Boolean(image.url),
        description: Boolean(image.description)
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

      query = `SELECT * FROM ${config.mysqlConfig.tables.images} WHERE url = ?`
      queryParams = [image.url]
      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length > 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.CONFLICT,
          cause: InfoError.CONFLICT,
          message: 'Image already exists'
        })
      }

      query = `INSERT INTO ${config.mysqlConfig.tables.images} (product_id, url, description) VALUES (?)`
      queryParams = [Object.values(image)]
      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)
      return rows
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }

  async update ({ id, image }: { id: number, image: Partial<Image> }): Promise<RowDataPacket[]> {
    try {
      let query: string
      let queryParams: any[]

      const hasId = Boolean(id)
      const hasImage = Boolean(image)

      if (!hasId) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'The id is required'
        })
      }
      if (!hasImage) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'The image is required'
        })
      }

      let hasUpdatedField = false
      let updatedImage: Partial<Image> = {}
      Object.entries(image).forEach(([key, value]) => {
        const hasValue = Boolean(value)
        if (hasValue && value !== undefined && value !== null) {
          hasUpdatedField = true
          updatedImage = { ...updatedImage, [key]: value }
        }
      })
      if (!hasUpdatedField) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'At least one field must be provided to update the image'
        })
      }

      query = `SELECT * FROM ${config.mysqlConfig.tables.images} WHERE id = ?`
      queryParams = [id]
      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Image not found'
        })
      }

      const existingImage = rowsExist[0] as Image
      Object.keys(updatedImage).forEach(key => {
        if (existingImage[key] === updatedImage[key]) {
          new HandlerError().createError({
            name: NameError.QUERY_ERROR,
            code: CodeError.BAD_REQUEST,
            cause: InfoError.BAD_REQUEST,
            message: `The field ${key} already has the same value`
          })
        }
      })

      query = `UPDATE ${config.mysqlConfig.tables.images} SET ? WHERE id = ?`
      queryParams = [updatedImage, id]
      const [rows] = await pool.query<RowDataPacket[]>(query, queryParams)
      return rows
    } catch (error) {
      if (error instanceof CustomError) {
        throw error
      }
      throw error
    }
  }

  async delete ({ id, url }: { id?: number, url?: string }): Promise<RowDataPacket[]> {
    try {
      let query: string
      let queryParams: any[]

      const hasId = Boolean(id)
      const hasUrl = Boolean(url)

      if (!hasId && !hasUrl) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.BAD_REQUEST,
          cause: InfoError.BAD_REQUEST,
          message: 'The image ID or URL must be provided'
        })
      }

      if (hasId) {
        query = `SELECT * FROM ${config.mysqlConfig.tables.images} WHERE id = ?`
        queryParams = [id]
      } else {
        query = `SELECT * FROM ${config.mysqlConfig.tables.images} WHERE url = ?`
        queryParams = [url]
      }
      const [rowsExist] = await pool.query<RowDataPacket[]>(query, queryParams)
      if (rowsExist.length === 0) {
        new HandlerError().createError({
          name: NameError.QUERY_ERROR,
          code: CodeError.NOT_FOUND,
          cause: InfoError.NOT_FOUND,
          message: 'Image not found'
        })
      }

      if (hasId) {
        query = `DELETE FROM ${config.mysqlConfig.tables.images} WHERE id = ?`
        queryParams = [id]
      } else {
        query = `DELETE FROM ${config.mysqlConfig.tables.images} WHERE url = ?`
        queryParams = [url]
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

export const imageRepository = new ImageRepository()
export default imageRepository
