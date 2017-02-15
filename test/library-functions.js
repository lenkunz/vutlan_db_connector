var randomString = require('randomstring');
var trimmer = require('trimmer');
var joi = require('joi');

var should = require('chai').should();
var knex = require('../src/db/knex');
var libs = require('../src/db_connector');

describe(`Library's`, () => {
    it('should be fine accept knex object', done => {
        var bookshelf = require('bookshelf')(knex);

        bookshelf.should.not.be.undefined;
        done();
    });

    it('should create a valid instance', done => {
        lib = libs();

        lib.should.not.be.undefined;
        lib.model.should.not.be.undefined;

        lib.model.Unit.should.not.be.undefined;
        lib.model.Sensor.should.not.be.undefined;
        lib.model.History.should.not.be.undefined;
        done();
    });
    
    describe(`model general structure`, () => {
        ["Unit", "Sensor", "History"].forEach(key => {
            describe(`${key}`, () => {
                it(`should can process model `, done => {
                    lib = libs(knex);
                    let Model = lib.model[key];

                    let entry = new Model({
                        id: 1
                    });

                    entry.should.not.be.undefined;
                    entry.get('id').should.equal(1);
                    done();
                });

                it(`shoud can connect using model`, done => {
                    lib = libs();        
                    let Model = lib.model[key];
                    
                    Model.query().count()
                        .then(
                            data => {
                                data[0]['count(*)'].should.be.at.least(0)
                                done();
                            },
                            error => {
                                done(error);
                            }
                        )
                        .catch(
                            error => {
                                done(error);
                            }
                        )
                });
            });
        });
    });

    describe("model database structure", () => {
        lib = libs();
        let Sensor = lib.model.Sensor;
        let Unit = lib.model.Unit;
        let History = lib.model.History;

        let usingUnit = null;
        let usingSensor = null;
        let usingHistory = null;

        describe("Unit", () => {
            let randomName = randomString.generate(150);

            it("should accept valid mock data", done => {

                Unit.forge({
                    uniqueId: "1",
                    name: randomName,
                    ip: "255.255.255.255"
                })
                .save()
                .then(unit => {
                    should.exist(unit);

                    usingUnit = unit;
                    done();
                })
                .catch(err => {
                    done(err);
                })
            });

            it("should insert data correctly", done => {
                should.exist(usingUnit.get('id'));
                usingUnit.get('id').should.be.at.least(0);

                should.exist(usingUnit.get('uniqueId'));
                usingUnit.get('uniqueId').should.equal('1');

                should.exist(usingUnit.get('name'));
                usingUnit.get('name').should.equal(randomName);

                should.exist(usingUnit.get('ip'));
                usingUnit.get('ip').should.equal("255.255.255.255");

                done();
            });
        });

        describe("Sensor", () => {
            let randomName = randomString.generate(150);
            let randomType = randomString.generate(100);
            let randomValue = randomString.generate(100);
            let randomStatus = randomString.generate(100);
            let randomDeviceType = randomString.generate(100);

            it("should accept valid mock data", done => {
                usingUnit.sensors().create({
                    uniqueId: "1",
                    name: randomName,
                    type: randomType,
                    value: randomValue,
                    status: randomStatus,
                    deviceType: randomDeviceType
                })
                .then(sensor => {
                    should.exist(sensor);

                    usingSensor = sensor;
                    done();
                })
                .catch(err => {
                    done(err);
                })
            });


            it("should insert data correctly", done => {
                should.exist(usingSensor.get('id'));
                usingSensor.get('id').should.be.at.least(0);

                should.exist(usingSensor.get('uniqueId'));
                usingSensor.get('uniqueId').should.equal('1');

                should.exist(usingSensor.get('name'));
                usingSensor.get('name').should.equal(randomName);

                should.exist(usingSensor.get('type'));
                usingSensor.get('type').should.equal(randomType);

                should.exist(usingSensor.get('value'));
                usingSensor.get('value').should.equal(randomValue);

                should.exist(usingSensor.get('status'));
                usingSensor.get('status').should.equal(randomStatus);

                should.exist(usingSensor.get('deviceType'));
                usingSensor.get('deviceType').should.equal(randomDeviceType);

                should.not.exist(usingUnit.get('lowAlarm'));
                should.not.exist(usingUnit.get('lowWarning'));
                should.not.exist(usingUnit.get('highAlarm'));
                should.not.exist(usingUnit.get('highWarning'));

                should.not.exist(usingUnit.get('at0'));
                should.not.exist(usingUnit.get('at75'));

                should.not.exist(usingUnit.get('pulse'));
                done();
            });

            it("should accept nullable data", done => {
                usingSensor.save({
                    lowAlarm: 1,
                    lowWarning: 2,
                    highAlarm: 3,
                    highWarning: 4,
                    at0: 5,
                    at75: 6,
                    pulse: 7
                })
                .then(sensor => {
                    should.exist(sensor);

                    should.exist(usingSensor.get('lowAlarm'));
                    usingSensor.get('lowAlarm').should.equal(1);

                    should.exist(usingSensor.get('lowWarning'));
                    usingSensor.get('lowWarning').should.equal(2);

                    should.exist(usingSensor.get('highAlarm'));
                    usingSensor.get('highAlarm').should.equal(3);

                    should.exist(usingSensor.get('highWarning'));
                    usingSensor.get('highWarning').should.equal(4);

                    should.exist(usingSensor.get('at0'));
                    usingSensor.get('at0').should.equal(5);

                    should.exist(usingSensor.get('at75'));
                    usingSensor.get('at75').should.equal(6);

                    should.exist(usingSensor.get('pulse'));
                    usingSensor.get('pulse').should.equal(7);

                    usingSensor = sensor;
                    done();
                })
                .catch(err => {
                    done(err);
                })
            });
        });

        describe("History", () => {
            let randomStatus = randomString.generate(150);
            let randomValue = randomString.generate(150);
            let randomValueType = randomString.generate(50);
            let randomDeviceType = randomString.generate(50);

            it("should accept valid mock data", done => {
                usingSensor.histories().create({
                    status: randomStatus,
                    value: randomValue,
                    valueType: randomValueType,
                    deviceType: randomDeviceType,
                })
                .then(history => {
                    should.exist(history);

                    usingHistory = history;
                    done();
                })
                .catch(err => {
                    done(err);
                })
            });


            it("should insert data correctly", done => {
                should.exist(usingHistory.get('id'));
                usingHistory.get('id').should.be.at.least(0);

                should.exist(usingHistory.get('value'));
                usingHistory.get('value').should.equal(randomValue);

                should.exist(usingHistory.get('valueType'));
                usingHistory.get('valueType').should.equal(randomValueType);

                should.exist(usingHistory.get('deviceType'));
                usingHistory.get('deviceType').should.equal(randomDeviceType);

                done();
            });
        });

        describe("deletion", () => {
            let usingHistoryId = null;
            let usingSensorId = null;
            let usingUnitId = null;

            it("should delete Unit when request", done => {
                usingHistoryId = usingHistory.get('id');
                usingSensorId = usingSensor.get('id');
                usingUnitId = usingUnit.get('id');

                usingUnit.destroy()
                    .then(model => {
                        Unit.forge()
                            .where('id', usingUnitId)
                            .fetch()
                            .then(data => {
                                done(err)
                            }, err => done())
                            .catch(err => done())
                    }, err => done(err))
                    .catch(err => done(err));
            });

            it("should delete Sensor when delete Unit", done => {
                Sensor.where('id', usingSensorId)
                    .fetch()
                    .then(data => {
                        done(err)
                    }, err => done())
                    .catch(err => done())
            });

            it("should delete History when delete Unit", done => {
                History.where('id', usingHistoryId)
                    .fetch()
                    .then(data => {
                        done(err)
                    }, err => done())
                    .catch(err => done())
            });
        });
    });

    describe("dependency", () => {
        lib = libs();
        let Sensor = lib.model.Sensor;
        let Unit = lib.model.Unit;
        let History = lib.model.History;

        describe("require", () => {
            it("should load .json file", done => {
                require('./request-1-sensor.json');
                done();
            })
        });

        describe("trimmer", () => {
            it("should trim data correctly", done => {
                let trimmed = trimmer(` "foo" `, libs.TRIM_STRING);

                trimmed.should.be.equal("foo");
                done();
            })
        });

        describe("joi", () => {
            let validator = joi.object().keys({
                mid: joi.required(),
                name: joi.required(),
                sensors: joi.required()
            });

            it("should accept valid data", done => {
                joi.validate({
                    mid: "1",
                    name: randomString.generate(25),
                    sensors: []
                }, validator, (err, value) => {
                    should.not.exist(err);
                    done();
                });
            });

            it("should reject data with missing field", done => {
                joi.validate({
                    mid: "1",
                    sensors: []
                }, validator, (err, value) => {
                    should.exist(err);
                    done();
                });
            });
        });

        describe("Array.isArray", done => {
            it("should accept array", done => {
                Array.isArray([]).should.be.true;
                done();
            });

            it("should reject other", done => {
                Array.isArray("[]").should.be.false;
                Array.isArray("array").should.be.false;
                Array.isArray("string").should.be.false;
                done();
            });

            it("should reject null, undefined", done => {
                Array.isArray(null).should.be.false;
                Array.isArray(undefined).should.be.false;
                done();
            });
        });

        describe("Promise chain", done => {

        });

        describe("Promise.all", done => {
            it("should resolve when all the promise resolve", done => {
                Promise.all([
                    Promise.resolve(), Promise.resolve(), Promise.resolve()
                ])
                .then(() => {
                    done();
                })
                .catch(err => done({error: err}));
            });

            it("should reject when some the promise reject", done => {
                Promise.all([
                    Promise.resolve(), Promise.reject(), Promise.resolve()
                ])
                .then(() => {
                    done({
                        message: "should not resolved"
                    });
                })
                .catch(err => done());
            });
        })
		
		it("Should load library", () => {
			console.log("TEST", require("../dist/vutlan_database_connector.bundle.js"));
		});
    });
});