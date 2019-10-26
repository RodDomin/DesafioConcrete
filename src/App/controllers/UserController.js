import * as Yup from 'yup'
import SessionController from './SessionController'
import UserModel from '../models/User'

class UserController {
  async index (req, res) {
    const { id } = req.params

    try {
      if (id) {
        if (id !== req.userId) {
          return res.status(401).send({ error: 'Não autorizado' })
        }

        const user = await UserModel.findById(id)

        return res.send(user)
      }
    } catch (err) {
      res.status(500).send({ error: 'internal server error' })
    }
  }

  async store (req, res, next) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().email().required(),
      senha: Yup.string().required(),
      telefones: Yup.array().of(
        Yup.object().shape({
          numero: Yup.number(),
          ddd: Yup.number()
        })
      ).required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).send({ error: 'validation error' })
    }

    const { nome, email, senha, telefones } = req.body

    const haveEmail = await UserModel.findOne({ email })

    if (haveEmail) {
      return res.status(401).send({ error: 'E-mail já existente' })
    }

    const newUser = await UserModel.create({ nome, email, senha, telefones })

    SessionController.createFromRegister(req, res, newUser._id)
  }
}

export default new UserController()
