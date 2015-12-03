export default /*@ngInject*/ function Regions($http, $rootScope, $q, $window) {
  let factory = {
    current: angular.fromJson($window.localStorage.getItem('sl.location'))
  };
  const defaultRegion = {
    region_id: '91eae2f5-b1d7-442f-bc86-c6c11c581fad',
    region_name: 'Москва'
  };
  let regions;

  factory.fetch = function () {
    return $q.all({
      location: $q.when(factory.current || factory.getLocation()),
      regions: factory.getRegions()
    }).then(function (responses) {
      return responses.regions;
    })
  };

  factory.getLocation = function () {
    return $q.when(factory.current || $http.get('http://api.love.sl/v1/geo/get_location/').then(function (response) {
        let current = response.data;
        if (!current) return $q.reject('Location not detected');
        if (!current.region_id) {
          current = defaultRegion;
        }

        factory.current.id = current.region_id;
        factory.current.name =current.region_name;

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
    let region = regions.filter((_region) => _region.id === id)[0];
    console.log(id);

    if (!region) {
      console.warn('No region with such id');
      !retryFlag && console.warn('Trying to fetch');
      !retryFlag && factory.fetch().then(factory.setRegion.bind(null, id, true));
    }

    factory.current.id = region.id;
    factory.current.name = region.name;

    $window.localStorage.setItem('sl.location', angular.toJson(factory.current));

    $rootScope.$emit('region:change', region.id);
    angular.element($window).trigger('angular::region::change', region);
  };

  return factory;
}
