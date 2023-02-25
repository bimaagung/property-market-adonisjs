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
test.group('List Property', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return correct', async ({ client, assert }) => {
    // Arrange
    const payloadPropertyA = {
      number: 'A01',
      type: '50',
      address: 'jl. unkown',
    }

    const payloadPropertyB = {
      number: 'A02',
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
      .json(payloadPropertyA)

    await client
      .post('/api/property/add')
      .headers({
        Authorization: 'Bearer ' + user.body().data.token.token,
      })
      .json(payloadPropertyB)

    // Action
    const response = await client
      .get('/api/property/list')
      .headers({
        Authorization: 'Bearer ' + user.body().data.token.token,
      })
      .qs({
        page: 1,
        limit: 10,
      })

    // Assert
    response.assertStatus(200)
    assert.equal(response.body().status, 'ok')
    assert.equal(response.body().message, 'success')
    assert.exists(response.body().properties)
    assert.lengthOf(response.body().properties.data, 2)
    assert.typeOf(response.body().properties.data, 'array')
    assert.exists(response.body().properties.data[0].id)
    assert.exists(response.body().properties.data[0].number)
    assert.exists(response.body().properties.data[0].type)
    assert.exists(response.body().properties.data[0].address)
  })
})
