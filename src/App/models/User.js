import bcrypt from 'bcrypt'
import mongoose from '../../configs/database'

/* Schema da collection users */
const UserSchema = mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
  telefones: [{
    numero: String,
    ddd: String
  }],
  ultimo_login: Date,
  token: String
}, {
  timestamps: true
})

/*
*  Middleware do mongoose para executar algo
*  neste caso eu coloquei este para criar uma
*  criptografia da senha caso o document seja
*  novo.
*/
UserSchema.pre('save', async function (next) {
  /* verifica se o document é novo */
  if (this.isNew) {
    try {
      /* gera a hash e sobrepõe o valor da senha com o da hash */
      const hash = await bcrypt.hash(this.senha, 8)
      this.senha = hash
    } catch (err) {
      console.log('houve um erro na criptografia')
    }

    return next()
  }

  return next()
})

export default mongoose.model('users', UserSchema)
