import 'dotenv/config'

export default {
  secret: process.env.MY_SECRET,
  expiresIn: '30m'
}
