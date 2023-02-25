import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Add Property', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return correct', async ({ client, assert }) => {
    const payload = {
      number: 'A01',
      type: '50',
      address: 'jl. unkown',
    }

    const payloadUser = {
      name: 'test',
      email: 'test@example.com',
      password: 'secret',
    }

    const user = await client.post('/api/auth/register').json(payloadUser)

    const response = await client
      .post('/api/property/add')
      .headers({
        Authorization: 'Bearer ' + user.body().data.token.token,
      })
      .json(payload)

    response.assertStatus(201)
    assert.equal(response.body().message, 'success')
    assert.exists(response.body().data)
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.number, payload.number)
    assert.equal(response.body().data.type, payload.type)
    assert.equal(response.body().data.address, payload.address)
  })

  test('should return incorrect if property is existing', async ({ client, assert }) => {
    const payload = {
      number: 'A01',
      type: '50',
      address: 'jl. unkown',
    }

    const payloadUser = {
      name: 'test',
      email: 'test@example.com',
      password: 'secret',
    }

    const user = await client.post('/api/auth/register').json(payloadUser)

    await client
      .post('/api/property/add')
      .headers({
        Authorization: 'Bearer ' + user.body().data.token.token,
      })
      .json(payload)

    const response = await client
      .post('/api/property/add')
      .headers({
        Authorization: 'Bearer ' + user.body().data.token.token,
      })
      .json(payload)

    response.assertStatus(400)
    assert.equal(response.body().status, 'fail')
    assert.equal(response.body().message, 'property already exists')
  })
})
