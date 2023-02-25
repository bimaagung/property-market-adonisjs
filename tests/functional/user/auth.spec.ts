import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Register', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return correct', async ({ client, assert }) => {
    const payload = {
      name: 'test',
      email: 'test@example.com',
      password: 'secret',
    }

    const response = await client.post('/api/auth/register').json(payload)

    response.assertStatus(201)
    assert.equal(response.body().message, 'success')
    assert.exists(response.body().data)
    assert.exists(response.body().data.user)
    assert.exists(response.body().data.token)
  })

  test('should return status 400 if user not available', async ({ client, assert }) => {
    const payload = {
      name: 'test',
      email: 'test@example.com',
      password: 'secret',
    }

    await client.post('/api/auth/register').json(payload)
    const response = await client.post('/api/auth/register').json(payload)

    response.assertStatus(400)
    assert.equal(response.body().status, 'fail')
    assert.equal(response.body().message, 'username or password not available')
  })
})

test.group('Login', async (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should return correct', async ({ client, assert }) => {
    const payload = {
      name: 'test',
      email: 'test@example.com',
      password: 'secret',
    }

    await client.post('/api/auth/register').json(payload)
    const response = await client
      .post('/api/auth/login')
      .json({ email: payload.email, password: payload.password })

    response.assertStatus(200)
    assert.equal(response.body().status, 'ok')
    assert.equal(response.body().message, 'success')
    assert.exists(response.body().data)
    assert.exists(response.body().data.user)
    assert.exists(response.body().data.token)
  })

  test('should return incorrect if username or password not available', async ({
    client,
    assert,
  }) => {
    const payload = {
      name: 'test',
      email: 'test@example.com',
      password: 'secret',
    }

    const response = await client
      .post('/api/auth/login')
      .json({ email: payload.email, password: payload.password })

    response.assertStatus(400)
    assert.equal(response.body().status, 'fail')
    assert.equal(response.body().message, 'username or password incorrect')
  })
})
