import express from 'express'
import routes from './routes'

import './configs/database'

/*
* Algumas explicações,
* 1 - Decidi usar o sistema de modulos no lugar do Commomjs,
*     pois eu ando vendo que está se tornando um padrão esse
*     sistema de modulos, inclusive a nova versão LTS do nodejs
*     (versão 12) já possui suporte nativo para tal, mas como
*     nem todo server terá a ultima verão do node instalada
*     usei o sucrase para fazer a build para uma versão mais antiga
*     Documentação do sucrase: https://www.npmjs.com/package/sucrase
*
* 2 - utilizei o formato de classes, pois faz mais sentido encapsular
*     cada funcionalidade numa classe e exportar um objeto da mesma.
*
* 3 - A lib yup foi usada nos controllers para validação de dados que
*     estão sendo enviados do usuário para o servidor
*
* 4 - Eslint foi a escolhida para o linting deste desafio
*
* 5 - Provavelmente você irá perceber que no controller de busca
*     não há uma regra que limita os 30 minutos do token, não houve a
*     necessidade de fazer isso, pois dentro das configurações do jwt
*     o tempo limite de uma sessão que eu coloquei foi de 30m (30 minutos)
*/
class App {
  constructor () {
    this.server = express()

    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.server.use(express.json())
  }

  routes () {
    this.server.use(routes)
  }
}

export default new App().server
