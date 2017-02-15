(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("knex"), require("bookshelf"), require("joi"), require("trimmer"));
	else if(typeof define === 'function' && define.amd)
		define(["knex", "bookshelf", "joi", "trimmer"], factory);
	else if(typeof exports === 'object')
		exports["vutlan_database_connector"] = factory(require("knex"), require("bookshelf"), require("joi"), require("trimmer"));
	else
		root["vutlan_database_connector"] = factory(root["knex"], root["bookshelf"], root["joi"], root["trimmer"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("knex");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var environment = process.env.NODE_ENV || 'development';
var config = __webpack_require__(5)[environment];

module.exports = __webpack_require__(0)(config);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("bookshelf");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("joi");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("trimmer");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'mysql',
    connection: {
      database: 'laravel_test',
      user: 'root',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      database: 'laravel_test',
      user: 'laravel',
      password: '12457812'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var knex = __webpack_require__(1);
var joi = __webpack_require__(3);
var trimmer = __webpack_require__(4);

var dbInfo = {
    host: "127.0.0.1",
    username: "root",
    password: "",
    database: "laravel_test"
};
var proto = {};
var libsInfo = function libsInfo(options) {
    return new libs(__webpack_require__(0)({
        client: options.client || 'mysql',
        connection: {
            database: options.database,
            user: options.user,
            password: options.pass
        },
        pool: {
            min: options.poolMin || 2,
            max: options.poolMax || 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }));
};

var libs = function libs(_knex) {
    // Initializing
    var db = this.db = _knex;
    var bookshelf = __webpack_require__(2)(db);

    // Init model
    var model = this.model = {};

    model.Unit = bookshelf.Model.extend({
        tableName: 'monitor_units',
        hasTimestamps: true,
        sensors: function sensors() {
            return this.hasMany(model.Sensor, 'monitor_id');
        }
    });

    model.Sensor = bookshelf.Model.extend({
        tableName: 'sensors',
        hasTimestamps: true,
        histories: function histories() {
            return this.hasMany(model.History, 'sensor_id');
        },
        unit: function unit() {
            return this.belongsTo(model.Unit, 'monitor_id');
        }
    });

    model.History = bookshelf.Model.extend({
        tableName: 'sensor_histories',
        hasTimestamps: true,
        sensor: function sensor() {
            return this.belongsTo(model.Sensor, 'sensor_id');
        }
    });
};

// Assign libs protype
libs.prototype = proto;

var TRIM_STRING = libsInfo.TRIM_STRING = " \t\n\r\0\x0B\"'";

var updateSensorMetaDataValidator = joi.object().keys({
    mid: joi.required(),
    name: joi.required(),
    sensors: joi.required(),
    date_time: joi.date()
});

var mapToPromises = function mapToPromises(promiseFunction) {
    return function (input) {
        return new Promise(function (resolve, reject) {
            promiseFunction(input, resolve, function () {});
        });
    };
};

var validate = function validate(data, updateSensorMetaDataValidator) {
    return new Promise(function (resolve, reject) {
        joi.validate(data, updateSensorMetaDataValidator, function (error, value) {
            if (error) return reject(error);
            resolve();
        });
    });
};

var ipToInt = function ipToInt(str) {
    strs = str.split('.');
    return parseInt(strs[0]) << 24 + parseInt(strs[1]) << 16 + parseInt(strs[2]) << 8 + parseInt(strs[3]);
};

proto.updateSensors = function (data) {
    if (!data) {
        return Promise.reject({
            message: "input is not an object."
        });
    }

    var Unit = this.model.Unit;
    var Sensor = this.model.Sensor;
    var timestamp = Math.floor(new Date().getTime() / 1000);

    return new Promise(function (_resolve, _reject) {
        var resolve = function resolve(_data) {
            var data = _data || null;

            _resolve({
                timestamp: timestamp, data: data
            });
        };

        var reject = function reject(message, error) {
            var stack = new Error().stack;

            _reject({
                message: message, error: error, stack: stack
            });
        };

        try {
            if (!Array.isArray(data.sensors)) {
                reject("Sensor should be array");
                return;
            };

            validate(data, updateSensorMetaDataValidator).then(function () {
                return Unit.where('uniqueId', data.mid).fetch();
            }).then(function (unit) {
                if (unit == null) {
                    return Unit.forge({
                        name: ipToInt(data.name),
                        uniqueId: data.addr,
                        ip: data.addr
                    }).save();
                }

                return Promise.resolve(unit);
            }).then(function (unit) {
                var sensorPromise = function sensorPromise(sensorData, sensorResolve) {
                    var resolveError = function resolveError(error) {
                        console.log(error);
                        sensorResolve();
                    };

                    var uniqueId = sensorData.sid;
                    var type = sensorData.class;
                    var deviceType = sensorData.type;
                    var status = sensorData.state;
                    var value = sensorData.value;
                    var name = sensorData.name;

                    unit.sensors().query('where', 'uniqueId', uniqueId).fetch().then(function (sensor) {
                        if (sensor != null) {
                            return Sensor.forge({ id: sensor.get('id') }).save({ name: name, type: type, deviceType: deviceType, status: status, value: value });
                        } else {
                            return new Sensor({ name: name, uniqueId: uniqueId, type: type, deviceType: deviceType, status: status, value: value, min: 0, max: 0, expression: '' }).save();
                        }
                    }).then(function (sensor) {
                        return sensor.histories().create({
                            deviceType: deviceType, status: status, value: value,
                            valueType: type
                        });
                    }).then(sensorResolve).catch(function (error) {
                        resolveError(error);
                    });
                };

                return Promise.all(data.sensors.map(mapToPromises(sensorPromise)));
            }).then(function () {
                resolve();
            }).catch(function (e) {
                reject("Unexpected error.", e);
            });
        } catch (e) {
            reject();
        }
    });
};

module.exports = libsInfo;

/***/ })
/******/ ]);
});