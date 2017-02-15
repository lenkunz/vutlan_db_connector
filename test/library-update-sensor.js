require('./library-functions');

var randomString = require('randomstring');
var trimmer = require('trimmer');

var should = require('chai').should();
var libs = require('../db_connector');

describe("Library#updateSensors", () => {
    let lib = libs();
    let Sensor = lib.model.Sensor;
    let Unit = lib.model.Unit;
    let History = lib.model.History;

    it('should exist', () => {
        should.exist(lib);
        should.exist(lib.updateSensors);
    });

    it('should return Promise', done => {
        let result = lib.updateSensors(null);

        should.exist(result);

        should.exist(result.then);
        result.then.should.be.a('function');

        should.exist(result.catch);
        result.catch.should.be.a('function');

        result.then(data => done(), error => done());
    });

    it('should call Promise#resolve or Promise#reject', done => {
        lib.updateSensors({})
            .then(data => done())
            .catch(error => {
                done()
            });
    });

    describe("invalid data test", () => {
        it('should reject null', done => {
            lib.updateSensors(null)
                .then(data => done({
                    message: "Should not resolve"
                }))
                .catch(error => done());
        });

        it('should reject undefined', done => {
            lib.updateSensors(undefined)
                .then(data => done({
                    message: "Should not resolve"
                }))
                .catch(error => done());
        });

        it('should reject blank object', done => {
            lib.updateSensors({})
                .then(data => done({
                    message: "Should not resolve"
                }))
                .catch(error => done());
        });

        it('should reject data missing mid', done => {
            lib.updateSensors({
                    name: randomString.generate(150),
                    sensors: []
                })
                .then(data => done({
                    message: "Should not resolve"
                }))
                .catch(error => done());
        });

        it('should reject data missing name', done => {
            lib.updateSensors({
                    mid: "2",
                    sensors: []
                })
                .then(data => done({
                    message: "Should not resolve"
                }))
                .catch(error => done());
        });

        it('should reject data missing sensors', done => {
            lib.updateSensors({
                    name: randomString.generate(150),
                    mid: "2"
                })
                .then(data => done({
                    message: "Should not resolve"
                }))
                .catch(error => done());
        });

        it('should reject data when sensors is not an array', done => {
            lib.updateSensors({
                    name: randomString.generate(150),
                    mid: "2",
                    sensors: randomString.generate(150)
                })
                .then(data => done({
                    message: "Should not resolve"
                }))
                .catch(error => done());
        });
    });

    describe("function", () => {
        let testData1Sensor = require('./request-1-sensor.json');
        let testDataFullSensor = require('./request-1-sensor.json');

        let historyCount = 0;

        before(done => {
            History.count()
                .then(data => {
                    should.exist(data);

                    historyCount = data;

                    historyCount.should.be.at.least(0);
                    done();
                })
        });

        it('should resolve valid data with 1 sensor', function(done) {
            this.timeout(200);

            lib.updateSensors(testData1Sensor)
                .then(data => done())
                .catch(error => done({
                    message: "Should not reject",
                    error: error
                }));
        });

        it('should be add histories count by 1', done => {
            History.count()
                .then(data => {
                    should.exist(data);
                    data.should.equals(historyCount + 1);

                    historyCount = data;
                    done();
                })
        });

        it('should add correct data referred to input', done => {
            History.forge()
                .orderBy('created_at', 'desc')
                .fetch()
                .then(history => {
                    history.get('value').should.equals(trimmer(testData1Sensor.sensors[0].value, libs.TRIM_STRING));
                    done();
                })
                .catch(error => done({
                    message: "Error fetching",
                    error: error
                }));
        });

        it('should resolve valid data with all sensor', function(done) {
            this.timeout(500);

            lib.updateSensors(testDataFullSensor)
                .then(data => done())
                .catch(error => done({
                    message: "Should not reject",
                    error: error
                }));
        });

        it('should be add histories count by all sensors length', function(done){
            History.count()
                .then(data => {
                    should.exist(data);

                    data.should.equals(historyCount + testDataFullSensor.sensors.length);

                    historyCount = data;
                    done();
                })
        })
    });
});