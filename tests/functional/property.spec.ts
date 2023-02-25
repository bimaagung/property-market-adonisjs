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

test.group('FindById Property', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return correct', async ({ client, assert }) => {
    // Arrange
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

    const property = await client
      .post('/api/property/add')
      .headers({
        Authorization: 'Bearer ' + user.body().data.token.token,
      })
      .json(payload)

    const idProperty = property.body().data.id

    // Action
    const response = await client.get(`/api/property/${idProperty}`).headers({
      Authorization: 'Bearer ' + user.body().data.token.token,
    })

    // Assert
    response.assertStatus(200)
    assert.equal(response.body().status, 'ok')
    assert.equal(response.body().message, 'success')
    assert.exists(response.body().data)
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.number, payload.number)
    assert.equal(response.body().data.type, payload.type)
    assert.equal(response.body().data.address, payload.address)
  })

  test('should return status 404 if property not found', async ({ client, assert }) => {
    // Arrange
    const payloadUser = {
      name: 'test',
      email: 'test@example.com',
      password: 'secret',
    }

    const user = await client.post('/api/auth/register').json(payloadUser)

    const idProperty = 1

    // Action
    const response = await client.get(`/api/property/${idProperty}`).headers({
      Authorization: 'Bearer ' + user.body().data.token.token,
    })

    // Assert
    response.assertStatus(404)
    assert.equal(response.body().status, 'fail')
    assert.equal(response.body().message, 'property not found')
  })
})

test.group('Delete Property', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return correct', async ({ client, assert }) => {
    // Arrange
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

    const property = await client
      .post('/api/property/add')
      .headers({
        Authorization: 'Bearer ' + user.body().data.token.token,
      })
      .json(payload)

    const idProperty = property.body().data.id

    // Action
    const response = await client.delete(`/api/property/delete/${idProperty}`).headers({
      Authorization: 'Bearer ' + user.body().data.token.token,
    })

    // Assert
    const propertyById = await client.get(`/api/property/${idProperty}`).headers({
      Authorization: 'Bearer ' + user.body().data.token.token,
    })

    response.assertStatus(200)
    assert.equal(response.body().status, 'ok')
    assert.equal(response.body().message, 'success')
    assert.notExists(propertyById.body().data)
  })

  test('should return status 404 if property not found', async ({ client, assert }) => {
    // Arrange
    const payloadUser = {
      name: 'test',
      email: 'test@example.com',
      password: 'secret',
    }

    const user = await client.post('/api/auth/register').json(payloadUser)

    const idProperty = 1

    // Action
    const response = await client.delete(`/api/property/delete/${idProperty}`).headers({
      Authorization: 'Bearer ' + user.body().data.token.token,
    })

    // Assert
    response.assertStatus(404)
    assert.equal(response.body().status, 'fail')
    assert.equal(response.body().message, 'property not found')
  })
})

test.group('Update Property', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return correct', async ({ client, assert }) => {
    // Arrange
    const payloadA = {
      number: 'A01',
      type: '50',
      address: 'jl. unkown',
    }

    const payloadB = {
      number: 'A02',
      type: '62',
      address: 'jl. defined',
    }

    const payloadUser = {
      name: 'test',
      email: 'test@example.com',
      password: 'secret',
    }

    const user = await client.post('/api/auth/register').json(payloadUser)

    const property = await client
      .post('/api/property/add')
      .headers({
        Authorization: 'Bearer ' + user.body().data.token.token,
      })
      .json(payloadA)
    const idProperty = property.body().data.id

    // Action
    const response = await client
      .put(`/api/property/update/${idProperty}`)
      .headers({
        Authorization: 'Bearer ' + user.body().data.token.token,
      })
      .json(payloadB)

    // Assert
    const propertyUpdated = await client
      .get(`/api/property/${idProperty}`)
      .bearerToken(user.body().data.token.token)

    response.assertStatus(200)
    assert.equal(response.body().status, 'ok')
    assert.equal(response.body().message, 'success')
    assert.exists(propertyUpdated.body().data)
    assert.exists(propertyUpdated.body().data.id)
    assert.equal(propertyUpdated.body().data.number, payloadB.number)
    assert.equal(propertyUpdated.body().data.type, payloadB.type)
    assert.equal(propertyUpdated.body().data.address, payloadB.address)
  })

  test('should return incorrect if property is existing', async ({ client, assert }) => {
    // Arrange
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

    const idProperty = 1

    // Action
    const response = await client
      .put(`/api/property/update/${idProperty}`)
      .headers({
        Authorization: 'Bearer ' + user.body().data.token.token,
      })
      .json(payload)

    // Assert
    response.assertStatus(404)
    assert.equal(response.body().status, 'fail')
    assert.equal(response.body().message, 'property not found')
  })
})
