// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Property from 'App/Models/Property'

export default class PropertiesController {
  public async store({ request, response }: HttpContextContract) {
    const payload = request.body()

    const existNumber = await Property.findBy('number', payload.number)

    if (existNumber !== null) {
      response.status(400)

      return {
        status: 'fail',
        message: 'number already exists',
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
}
