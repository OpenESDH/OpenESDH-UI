(function() {
    'use strict';

    angular
        .module('openeApp')
        .factory('userService', userService);

    userService.$inject = ['ALFRESCO_URI', '$http', '$resource'];

    function userService(ALFRESCO_URI, $http, $resource) {
        return {
            getPerson: getPerson,
            getPeople: getPeople,
            getHome: getHome,
            getAuthorities: getAuthorities,
            getPreferences: getPreferences,
            setPreferences: setPreferences,
            createUser: createUser,
            updateUser: updateUser,
            findPersons: findPersons,
            getPersons: getPersons,
            getGroups: getGroups,
            changePassword: changePassword
        };

        function getPerson(username) {
            return $http.get('/alfresco/service/api/people/' + username).then(function(response) {
                return response.data;
            });
        }

        function getHome() {
            return $http.get('/alfresco/service/api/nodelocator/userhome').then(function(response) {
                return response.data.data;
            });
        }

        function getAuthorities() {
            return $http.get('/alfresco/service/api/forms/picker/authority/children').then(function(response) {
                var items = response.data.data.items;
                return Object.keys(items).map(function(key) {
                    return items[key];
                });
            });
        }

        function getPreferences(username, params) {
            return $http.get('/alfresco/s/api/people/' + username + '/preferences', {
                params: params
            }).then(function(response) {
                return response.data;
            });
        }

        function setPreferences(username, preferences) {
            return $http.post('/alfresco/s/api/people/' + username + '/preferences', preferences).then(function(response) {
                return response.data;
            });
        }

        function createUser(userObj) {
            return $http.post('/alfresco/s/api/people',
               userObj
            ).then(function(response) {
                console.log("Return success");
                return response.data;
            });
        }

        function updateUser(userObj) {
            return $http.put('/alfresco/s/api/people/'+encodeURIComponent(userObj.userName),
               userObj
            ).then(function(response) {
                console.log("Return success");
                return response.data;
            });
        }

        function changePassword(user) {
            return $http.put("/api/person/changepassword/" + encodeURIComponent(user.userName),
               user
            ).then(function(response) {
                console.log("Changing Password");
                return response.data;
            });
        }

        function getPeople(filter) {
            return $http.get('/alfresco/s/api/people?filter='+filter).then(function(response) {
                return response.data;
            });
        }

        function getasdf(username) {
            return $http.get('/alfresco/s/api/people/' + username + '/preferences', {
                params: {pf : 'org.alfresco.share.documents.favourites'}
            }).then(function(response) {
                return response.data;
            });
        }
        
        function getPersons(searchTerm){
            var url = '/alfresco/s/api/forms/picker/authority/children?selectableType=cm:person';
            if(searchTerm && searchTerm.length > 0){
                url += '&searchTerm=' + searchTerm;
            }
            return $http.get(url).then(function(result){
                return result.data.data.items;
            });
        }
        
        function getGroups(searchTerm){
            var url = '/alfresco/s/api/forms/picker/authority/children?selectableType=cm:authorityContainer';
            if(searchTerm && searchTerm.length > 0){
                url += '&searchTerm=' + searchTerm;
            }
            return $http.get(url).then(function(result){
                return result.data.data.items;
            });
        }
    }
})();
