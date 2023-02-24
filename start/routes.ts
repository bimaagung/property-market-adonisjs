/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/property/add', 'PropertiesController.store')
  Route.get('/property/list', 'PropertiesController.list')
  Route.get('/property/:id', 'PropertiesController.findById')
  Route.delete('/property/delete/:id', 'PropertiesController.delete')
  Route.put('/property/update/:id', 'PropertiesController.update')
})
  .prefix('/api')
  .middleware('auth')

Route.group(() => {
  Route.post('/auth/register', 'AuthController.register')
  Route.post('/auth/login', 'AuthController.login')
}).prefix('/api')

Route.get('/docs', async ({ view }) => {
  const specUrl = 'your spec url'
  return view.render('swagger', { specUrl })
})
