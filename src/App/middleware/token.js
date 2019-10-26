import jwt from 'jsonwebtoken'
import jwtConfig from '../../configs/jwt'
import { promisify } from 'util'

export default async function (req, res, next) {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).send({ error: 'Não autorizado' })
  }

  const [str, token] = authorization.split(' ')

  if (str !== 'Bearer') {
    return res.status(401).send({ error: 'Token mal formatado' })
  }

  try {
    const decoded = await promisify(jwt.verify)(token, jwtConfig.secret)

    req.userId = decoded.id

    return next()
  } catch (err) {
    return res.status(401).send({ error: 'Sessão invalida' })
  }
}
