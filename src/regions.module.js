import Cookie from './cookie.factory';
import Regions from './regions.factory';

angular.module('sl.regions', [])
  .factory('Regions', Regions)
  .factory('Cookie', Cookie);
