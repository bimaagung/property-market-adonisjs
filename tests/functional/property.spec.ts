import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

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

    await User.create({
      id: 1,
      name: 'test',
      email: 'test@example.com',
      password: 'secret',
      rememberMeToken: null,
    })

    const User = await User.find(1)

    const response = await client.post('/api/property/add').json(payload).guard('api').loginAs(User)

    response.assertStatus(201)
    assert.equal(response.body().message, 'success')
    assert.exists(response.body().data)
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.number, payload.number)
    assert.equal(response.body().data.type, payload.type)
    assert.equal(response.body().data.address, payload.address)
  })
})
