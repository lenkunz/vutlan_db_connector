var knex = require('./db/knex');
var joi = require('joi');
var trimmer = require('trimmer');

var dbInfo = {
    host: "127.0.0.1",
    username: "root",
    password: "",
    database: "laravel_test"
};
var proto = {};
var libsInfo = function(options){
    return new libs(require('knex')(
		{
			client: options.client || 'mysql',
			connection: {
			  database: options.database,
			  user:     options.user,
			  password: options.pass
			},
			pool: {
			  min: options.poolMin || 2,
			  max: options.poolMax || 10
			},
			migrations: {
			  tableName: 'knex_migrations'
			}
		}
	));
}

var libs = function(_knex){
    // Initializing
    var db = this.db = _knex;
    var bookshelf = require('bookshelf')(db);

    // Init model
    var model = this.model = {};

    model.Unit = bookshelf.Model.extend({
        tableName: 'monitor_units',
        hasTimestamps: true,
        sensors: function() {
            return this.hasMany(model.Sensor, 'monitor_id');
        },
    });

    model.Sensor = bookshelf.Model.extend({
        tableName: 'sensors',
        hasTimestamps: true,
        histories: function(){
            return this.hasMany(model.History, 'sensor_id');
        },
        unit: function(){
            return this.belongsTo(model.Unit, 'monitor_id');
        }
    });

    model.History = bookshelf.Model.extend({
        tableName: 'sensor_histories',
        hasTimestamps: true,
        sensor: function(){
            return this.belongsTo(model.Sensor, 'sensor_id');
        }
    });
}

// Assign libs protype
libs.prototype = proto;

var TRIM_STRING = libsInfo.TRIM_STRING = " \t\n\r\0\x0B\"'";

var updateSensorMetaDataValidator = joi.object().keys({
    mid: joi.required(),
    name: joi.required(),
    sensors: joi.required(),
    date_time: joi.date()
});

var mapToPromises = (promiseFunction) => {
    return input => {
        return new Promise((resolve, reject) => {
            promiseFunction(input, resolve, function(){});
        });
    };
};

var validate = (data, updateSensorMetaDataValidator) => {
    return new Promise((resolve, reject) => {
            joi.validate(data, updateSensorMetaDataValidator, function (error, value) {                
                if(error) return reject(error);
                resolve();
            })
    });
}

var ipToInt = function (str){
	strs = str.split('.');
	return parseInt(strs[0]) << 24 + parseInt(strs[1]) << 16 + parseInt(strs[2]) << 8 + parseInt(strs[3]);
}

proto.updateSensors = function(data){
    if(!data){
        return Promise.reject({
            message: "input is not an object."
        });
    }

    var Unit = this.model.Unit;
    var Sensor = this.model.Sensor;
    let timestamp = Math.floor(new Date().getTime() / 1000);

    return new Promise((_resolve, _reject) => {
        let resolve = _data => {
            let data = _data || null;

            _resolve({
                timestamp, data
            });
        };

        let reject = (message, error) => {
            let stack = new Error().stack;

            _reject({
                message, error, stack
            });
        };

        try {
			if(!Array.isArray(data.sensors)){
				reject("Sensor should be array");
				return;
			};

            validate(data, updateSensorMetaDataValidator)
			.then(() => {				
				return Unit.where('uniqueId', data.mid).fetch();
			}).then((unit) => {
				if(unit == null){
					return Unit.forge({
									name: ipToInt(data.name),
									uniqueId: data.addr,
									ip: data.addr
								}).save();
				}

				return Promise.resolve(unit);
			}).then(unit => {
				let sensorPromise = (sensorData, sensorResolve) => {
					let resolveError = error => {
						console.log(error);
						sensorResolve();
					};

					let uniqueId = sensorData.sid;
					let type = sensorData.class;
					let deviceType = sensorData.type;
					let status = sensorData.state;
					let value = sensorData.value;
					let name = sensorData.name;

					unit.sensors().query('where', 'uniqueId', uniqueId).fetch()
						.then(sensor => {
							if(sensor != null){
								return Sensor.forge({id: sensor.get('id')}).save({ name, type, deviceType, status, value })
							}else{
								return new Sensor({ name, uniqueId, type, deviceType, status, value, min: 0, max: 0, expression: '' }).save();
							}
						}).then(sensor => {
							return sensor.histories().create({
										deviceType, status, value,
										valueType: type
									});
						}).then(
							sensorResolve
						).catch(error => {
							resolveError(error);
						});
				};
								
				return Promise.all(data.sensors.map(mapToPromises(sensorPromise)));
			})
			.then(() => {
				resolve();
			})
			.catch(e => {
				reject("Unexpected error.", e);
			});


        } catch (e) {
            reject();
        }
    })
};

module.exports = libsInfo;