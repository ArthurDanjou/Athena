import Route from '@ioc:Adonis/Core/Route'
import Application from "@ioc:Adonis/Core/Application";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";
import Env from '@ioc:Adonis/Core/Env'

const BASE_URL = Env.get('BASE_URL')

Route.get('/', async ({response}: HttpContextContract) => {
  return response.status(200).send({
    domain: BASE_URL,
    version: Env.get('API_VERSION'),
    source: `${BASE_URL}/source`,
    healthCheck: `${BASE_URL}/health`,
    routes: {
      profile: `${BASE_URL}/profile`,
      //stats: `${BASE_URL}/stats`,
      states: `${BASE_URL}/states`,
      locations: `${BASE_URL}/locations`,
      projects: `${BASE_URL}/projects`
    }
  })
})

Route.get('/source', async ({response}: HttpContextContract) => {
  return response.redirect(Env.get('GITHUB_SOURCE'))
})

Route.get('/health', async ({response}: HttpContextContract) => {
  const report = await HealthCheck.getReport()
  const isLive = await HealthCheck.isLive()
  const isReady = await HealthCheck.isReady()
  return report.healthy ? response.ok({ isLive, isReady, report: report.report }) : response.badRequest({ isLive, isReady, report: report.report })
})

// ArtAPI
Route.get('/profile', 'ProfileController.me')
Route.get('/locations', 'LocationsController.get')
Route.get('/stats', 'StatsController.get')
Route.get('/states', 'StatesController.get')
Route.get('/projects', 'ProjectsController.get')

Route.group(() => {
  Route.post('form', 'FormsController.send')
  Route.post('states/:state', 'StatesController.set')

  Route.resource('users', 'UsersController')
  Route.resource('files', 'FileController').only(['store', 'destroy'])

  Route.post('/locations', 'LocationsController.store')
  Route.post('/projects', 'ProjectsController.store')

  Route.group(() => {
    Route.get('/:slug', 'PostsController.getLikes')
    Route.post('/:slug/like', 'PostsController.like')
    Route.post('/:slug/unlike', 'PostsController.unlike')
  }).prefix('posts')

  Route.get('subscribers', 'SubscribersController.get')
  Route.post('subscribers', 'SubscribersController.store')

  Route.get('guestbook', 'GuestBookController.get')
  Route.post('guestbook', 'GuestBookController.store')

  Route.group(() => {
    Route.get('/', 'FileController.index')
    Route.get('/:filename', async ({ response, params }) => {
      response.download(Application.makePath('storage', params.filename))
    })
  }).prefix('/files')

}).middleware('auth')

Route.group(() => {
  Route.get('/me', 'AuthController.user').middleware('auth')
  Route.post('/token', 'AuthController.createInfiniteToken')

  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout')

  Route.get('/twitter/callback', 'AuthController.twitter')
  Route.get('/github/callback', 'AuthController.github')
  Route.get('/google/callback', 'AuthController.google')

  Route.get('/twitter', async  ({ ally }) => {
    return ally.use('twitter').redirect()
  })
  Route.get('/github', async  ({ ally }) => {
    return ally.use('github').redirect()
  })
  Route.get('/google', async  ({ ally }) => {
    return ally.use('google').redirect()
  })
}).prefix('auth')
