var server  = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = require('chai').expect;
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var winston = require('winston');

chai.use(chaiHttp);

var url = 'http://localhost:8080';

describe('Probes', function() {
  it('healthz probe should return 200', function(done) {
    chai.request(server)
    .get('/healthz')
    .end(function(err, res) {
      res.should.have.status(200);
      done();
    }); // end()
  });
});

if (process.env.MONGO != 'NO') {
describe('Routing', function() {
  describe('Aircraft', function() {
    it('should return a null object when looking for a non-existing A/C', function(done) {
      chai.request(server)
	     .get('/api/aircrafts/999')
	     .end(function(err, res) {
          res.should.have.status(404);
          done();
        });
    });

    it('should return an A/C after creation', function(done) {
      done();
    });

    it('should return error trying to save duplicate A/C ID', function(done) {
      done();
    });

    it('should correctly update an existing A/C', function(done) {
      done();
	  });

    it('should return http/200 after A/C deletion', function(done) {
      done();
    });
  });
});
}
