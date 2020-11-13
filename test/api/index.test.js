const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../app')

chai.use(chaiHttp)

describe('Node server', () => {
  it('(GET /) return homepage', (done) => {
    chai.request(server).get('/').end((err, res) => {
      res.should.have.status(200)
      done()
    })
  })
})
