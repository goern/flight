var server   = require('../server'),
    chai     = require('chai'),
    chaiHttp = require('chai-http'),
    should   = chai.should();

chai.use(chaiHttp);

// TODO this test is not good, healthz may include mongodb connection check
describe('Basic routes tests', function() {
    it('healthz should return 200', function(done){
        chai.request(server)
        .get('/_status/healthz')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        })

    })
})
