const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app");
const expect = chai.expect;
chai.use(chaiHttp);

let token;

describe("/api/movies tests", () => {
  before((done) => {
    chai
      .request(server)
      .post("/authenticate")
      .send({ username: "ali", password: "torun" })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe("/GET movies", () => {
    it("it should GET all the movies 1", (done) => {
      chai
        .request(server)
        .get("/api/movies")
        .set("x-access-token", token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("/GET movies", () => {
    it("it should GET all the movies 2", (done) => {
      chai
        .request(server)
        .get("/api/movies")
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});
