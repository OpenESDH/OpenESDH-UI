
angular
        .module('openeApp')
        .factory('preferenceService', preferenceService);

function preferenceService($http, $q, sessionService) {

    var FAVOURITE_CASE = "dk_openesdh_cases_favourites";

    return {
        getPreferences: getPreferences,
        setPreferences: setPreferences,
        addFavouriteCase: addFavouriteCase,
        removeFavouriteCase: removeFavouriteCase,
        isFavouriteCase: isFavouriteCase,
        _update: _update,
        _url: _url
    };

    function getPreferences(params, username) {
        return $http.get(this._url(username), {
            params: params
        }).then(function(response) {
            return response.data;
        });
    }

    function setPreferences(preferences, username) {
        var url = this._url(username);
        if (url) {
            return $http.post(this._url(username), preferences).then(function(response) {
                return response.data;
            });
        }
        return $q.resolve({});
    }

    function isFavouriteCase(caseId) {
        return this.getPreferences({pf: FAVOURITE_CASE}).then(function(result) {
            if (result === undefined) {
                return false;
            }
            var values = result[FAVOURITE_CASE];
            var arrValues = values ? values.split(",") : [];
            return arrValues.indexOf(caseId) != -1;
        });
    }

    function addFavouriteCase(caseId) {
        var data = {
            name: FAVOURITE_CASE,
            value: caseId,
            add: true
        };
        return this._update(data);
    }

    function removeFavouriteCase(caseId) {
        var data = {
            name: FAVOURITE_CASE,
            value: caseId,
            add: false
        };
        return this._update(data);
    }

    function _update(preference) {
        var deferred = $q.defer();
        var _this = this;
        this.getPreferences().then(function(preferences) {
            var values = preferences[preference.name];
            var arrValues = values ? values.split(",") : [];
            if (preference.add === true) {
                arrValues.push(preference.value);
            } else {
                var index = arrValues.indexOf(preference.value);
                if (index >= 0) {
                    arrValues.splice(index, 1);
                }
            }
            var preferenceObj = {};
            preferenceObj[preference.name] = arrValues.join(",");
            _this.setPreferences(preferenceObj).then(function(result) {
                deferred.resolve(result);
            });
        });
        return deferred.promise;
    }

    function _url(username) {
        if (username === undefined) {
            var userInfo = sessionService.getUserInfo();
            if (userInfo.user) {
                username = userInfo.user.userName;
            } else {
                return undefined;
            }
        }
        var url = '/api/people/' + username + '/preferences';
        return url;
    }
}