// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Property from 'App/Models/Property'
import { DateTime } from 'luxon'

export default class PropertiesController {
  public async store({ request, response }: HttpContextContract) {
    const payload = request.body()

    const existNumber = await Property.findBy('number', payload.number)

    if (existNumber !== null) {
      response.status(400)

      return {
        status: 'fail',
        message: 'property already exists',
      }
    }

    const property = await Property.create(payload)

    response.status(201)

    return {
      status: 'ok',
      message: 'success',
      data: {
        id: property.id,
        number: property.number,
        type: property.type,
        address: property.address,
        created_at: property.createdAt,
      },
    }
  }

  public async list({ request, response }: HttpContextContract) {
    const { page, limit } = request.qs()
    const listProperty = await Database.from('properties').paginate(page, limit)

    response.status(200)
    return {
      status: 'ok',
      message: 'success',
      properties: listProperty,
    }
  }

  public async findById({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const property = await Property.find(id)

    if (property === null) {
      response.status(404)

      return {
        status: 'fail',
        message: 'property not found',
      }
    }

    response.status(200)
    return {
      status: 'ok',
      message: 'success',
      data: property,
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const payload = request.body()

    const property = await Property.find(id)

    if (property === null) {
      response.status(404)

      return {
        status: 'fail',
        message: 'property not found',
      }
    }

    const result = await property
      .merge({
        number: payload.number,
        type: payload.type,
        address: payload.address,
        updatedAt: DateTime.local(),
      })
      .save()

    response.status(200)
    return {
      status: 'ok',
      message: 'success',
      data: result,
    }
  }
}
