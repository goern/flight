var server   = require('../server'),
    chai     = require('chai'),
    chaiHttp = require('chai-http'),
    expect   = require('chai').expect,
    should   = chai.should();

chai.use(chaiHttp);

describe('readyness probe', function() {
    it('healthz should return 200', function(done) {
        chai.request(server)
        .get('/healthz')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    });
});

/* MongoDB is required for this test
describe('FlightPlans API', function() {
  describe('List', function() {
    var url = "http://localhost:3030/api/flightplans";

    it('returns status 200', function(done) {
      chai.request(server)
      .get('/api/flightplans')
      .end(function(err, res) {
          res.should.have.status(200);
          done();
      });
    });
  });
});
*/
