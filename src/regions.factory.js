export default /*@ngInject*/ function Regions ($http, $q) {
    let factory = {};
    let regions;

    factory.fetch = function () {
      return $q.all({
        location: factory.getLocation(),
        regions: factory.getRegions()
      }).then(function (responses) {
        return responses.regions;
      })
    };

    factory.getLocation = function () {
      return $q.when(factory.current || $http.get('http://api.love.sl/v1/geo/get_location/').then(function (response) {
        const current = response.data;
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
      let region = regions.filter((_region) => _region.id === id)[0];
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
