import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import * as Yup from 'yup'
import jwtConfig from '../../configs/jwt'
import UserModel from '../models/User'

class SessionController {
  async createFromRegister (req, res, id) {
    const user = await UserModel.findById(id)

    const token = await jwt.sign({ id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    })

    user.ultimo_login = new Date()
    user.token = token
    user.save()

    return res.send(user)
  }

  async create (req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      senha: Yup.string().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'validation error' })
    }
    try {
      const { email, senha } = req.body

      const hasEmail = await UserModel.findOne({ email })

      if (!hasEmail || !(await bcrypt.compare(senha, hasEmail.senha))) {
        return res.status(401).send({ error: 'Usuário e/ou senha inválidos' })
      }

      const token = await jwt.sign({ id: hasEmail._id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn
      })

      hasEmail.ultimo_login = new Date()
      hasEmail.token = token
      hasEmail.save()

      return res.send({
        user: {
          nome: hasEmail.nome,
          email: hasEmail.email,
          telefones: hasEmail.telefones,
          createdAt: hasEmail.createdAt,
          updatedAt: hasEmail.updatedAt,
          ultimo_login: hasEmail.ultimo_login
        },
        token
      })
    } catch (err) {
      return res.status(500).send({ error: 'internal server error' })
    }
  }
}

export default new SessionController()
