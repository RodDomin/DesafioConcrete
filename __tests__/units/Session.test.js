import request from 'supertest'
import faker from 'faker'
import app from '../../src/app'
import UserModel from '../../src/App/models/User'

describe('tests as Sessões', () => {
  it('usuários logados recebem um jwt', async () => {
    const pass = faker.internet.password()

    const user = await UserModel.create({
      nome: faker.name.findName(),
      email: faker.internet.exampleEmail(),
      senha: pass
    })

    const response = await request(app)
      .post('/users/login')
      .send({
        email: user.email,
        senha: pass
      })

    await user.remove()

    expect(response.body).toHaveProperty('token')
  })

  it('usuários com email que não existe ou senha errada não faz login', async () => {
    const pass = faker.internet.password()

    const user = await UserModel.create({
      nome: faker.name.findName(),
      email: faker.internet.email(),
      senha: pass
    })

    const response = await request(app)
      .post('/users/login')
      .send({
        email: user.email,
        senha: '3213123'
      })

    await user.remove()

    expect(response.status).toBe(401)
  })

  it('controller retorna status 400 quando há erro de validação', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        nome: faker.name.findName()
      })

    expect(response.status).toBe(400)
  })
})
