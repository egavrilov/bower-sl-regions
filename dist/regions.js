/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _regions = __webpack_require__(1);

	var _regions2 = _interopRequireDefault(_regions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	angular.module('sl.regions', []).factory('Regions', _regions2.default);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Regions;
	/*@ngInject*/function Regions($http, $q) {
	  var factory = {};
	  var regions = undefined;

	  factory.fetch = function () {
	    return $q.all({
	      location: factory.getLocation(),
	      regions: factory.getRegions()
	    }).then(function (responses) {
	      return responses.regions;
	    });
	  };

	  factory.getLocation = function () {
	    return $q.when(factory.current || $http.get('http://api.love.sl/v1/geo/get_location/').then(function (response) {
	      var current = response.data;
	      if (!current) return $q.reject('Location not detected');

	      factory.current = {
	        id: current.region_id,
	        name: current.region_name
	      };

	      return current;
	    }));
	  };

	  factory.getRegions = function () {
	    return $q.when(regions || $http.get('http://api.love.sl/v2/outlets/regions/').then(function (response) {
	      if (!response.data) return $q.reject('No regions listed');
	      regions = response.data;
	      return regions;
	    }));
	  };

	  factory.setRegion = function (id, retryFlag) {
	    var region = regions.filter(function (_region) {
	      return _region.id === id;
	    })[0];
	    console.log(region);
	    if (!region) {
	      console.warn('No region with such id');
	      !retryFlag && console.warn('Trying to fetch');
	      !retryFlag && factory.fetch().then(factory.setRegion.bind(null, id, true));
	    }
	    factory.current = region;
	  };

	  return factory;
	}

/***/ }
/******/ ]);