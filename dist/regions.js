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

	var _cookie = __webpack_require__(2);

	var _cookie2 = _interopRequireDefault(_cookie);

	var _regions = __webpack_require__(1);

	var _regions2 = _interopRequireDefault(_regions);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	angular.module('sl.regions', []).factory('Regions', _regions2.default).factory('Cookie', _cookie2.default);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Regions;
	/*@ngInject*/function Regions(Cookie, $http, $rootScope, $q, $window) {
	  var factory = {
	    current: angular.fromJson($window.localStorage.getItem('sl.location'))
	  };
	  var defaultRegion = {
	    region_id: '91eae2f5-b1d7-442f-bc86-c6c11c581fad',
	    region_name: 'Москва'
	  };
	  var regions = undefined;
	  var fetchInProgress = undefined;

	  factory.fetch = function () {
	    return fetchInProgress ? factory.fetching : fetch();
	  };

	  function fetch() {
	    fetchInProgress = true;
	    factory.fetching = $q.all({
	      location: factory.getLocation(),
	      regions: factory.getRegions()
	    }).then(function (responses) {
	      factory.all = responses.regions;
	      return responses.regions;
	    }).finally(function () {
	      factory.fetching = null;
	      fetchInProgress = false;
	    });

	    return factory.fetching;
	  }

	  factory.getLocation = function () {
	    return $q.when(factory.current || $http.get('http://api.love.sl/v1/geo/get_location/').then(function (response) {
	      var current = response.data;

	      if (!Cookie.get('region_id')) factory.notDefined = true;
	      if (!current) return $q.reject('Location not detected');
	      if (!current.region_id) {
	        current = defaultRegion;
	      }

	      if (!factory.current) {
	        factory.current = {};
	      }

	      factory.current.id = current.region_id;
	      factory.current.name = current.region_name;

	      broadcast();

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

	    if (!region) {
	      console.warn('No region with such id');
	      !retryFlag && console.warn('Trying to fetch');
	      !retryFlag && factory.fetch().then(factory.setRegion.bind(null, id, true));
	    }

	    factory.current.id = region.id;
	    factory.current.name = region.name;

	    factory.notDefined = false;
	    Cookie.set('region_id', region.id);
	    $window.localStorage.setItem('sl.location', angular.toJson(factory.current));
	    broadcast();
	  };

	  function broadcast() {
	    $rootScope.$emit('region:change', factory.current);
	    angular.element($window).trigger('angular::region::change', factory.current);
	  }

	  return factory;
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function CookieFactory() {
	  function setCookie(name, value, daysToExpire) {
	    var date = new Date(Date.now() + (daysToExpire || 90) * 24 * 60 * 60 * 1000);
	    var expires = '; expires=' + date.toGMTString();
	    var domain = '; domain=.' + location.hostname.split('.').slice(-2).join('.');
	    document.cookie = name + '=' + value + expires + domain + '; path=/';
	  }

	  function getCookie(name) {
	    if (!name) return null;
	    var cookies = document.cookie.split(';');
	    var filteredCookie = cookies.filter(function (cookie) {
	      return cookie.trim().indexOf(name + '=') === 0;
	    })[0];
	    return filteredCookie ? filteredCookie.split('=')[1] : null;
	  }

	  function removeCookie(name) {
	    setCookie(name, '', -1);
	  }

	  return {
	    set: setCookie,
	    get: getCookie,
	    remove: removeCookie
	  };
	}

	exports.default = CookieFactory;

/***/ }
/******/ ]);