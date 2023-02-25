import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    const payload = request.body()

    const existNumber = await User.findBy('email', payload.email)

    if (existNumber !== null) {
      response.status(400)

      return {
        status: 'fail',
        message: 'username or password not available',
      }
    }

    const user = await User.create(payload)

    const token = await auth.use('api').generate(user, {
      expiresIn: '30 mins',
    })

    response.status(201)

    return {
      status: 'ok',
      message: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      },
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const payload = request.body()

    const user = await User.findBy('email', payload.email)

    if (user === null) {
      response.status(400)

      return {
        status: 'fail',
        message: 'username or password incorrect',
      }
    }

    const token = await auth.use('api').generate(user, {
      expiresIn: '30 mins',
    })

    response.status(200)

    return {
      status: 'ok',
      message: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      },
    }
  }
}
