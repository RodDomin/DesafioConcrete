import request from 'supertest'
import faker from 'faker'
import bcrypt from 'bcrypt'
import app from '../../src/app'
import UserModel from '../../src/App/models/User'

describe('testes para os controllers de usuários', () => {
  it('senha do usuário deve estar criptografada', async () => {
    const pass = faker.internet.password()

    const user = await UserModel.create({
      nome: faker.name.findName(),
      email: 'rrr@mail.com',
      senha: pass,
      telefones: [{
        numero: 123123,
        ddd: 11
      }]
    })

    const value = await bcrypt.compare(pass, user.senha)

    await user.remove()

    expect(value).toBe(true)
  })

  it('usuários quando são cadastrados recebem um jwt', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        nome: faker.name.findName(),
        email: faker.internet.email(),
        senha: faker.internet.password(),
        telefones: [{
          numero: 1231234,
          ddd: 12
        }]
      })

    await UserModel.deleteOne({ email: response.body.email })
    expect(response.body).toHaveProperty('token')
  })

  it('controller retorna status 400 quando há erro de validação', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        nome: faker.name.findName()
      })

    expect(response.status).toBe(400)
  })
})
