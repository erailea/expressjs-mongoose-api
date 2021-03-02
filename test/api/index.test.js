const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../app')

const expect = chai.expect;
chai.use(chaiHttp)

describe('Node server', () => {
  it('(GET /) return homepage', (done) => {
    chai.request(server).get('/').end((err, res) => {
      expect(res).to.have.status(200);
      done()
    })
  })
})
