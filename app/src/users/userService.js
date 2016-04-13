
angular
        .module('openeApp')
        .factory('userService', userService);

function userService($http) {
    return {
        getCurrentUser: getCurrentUser,
        deleteUser: deletePerson,
        getPerson: getPerson,
        getPeople: getPeople,
        getHome: getHome,
        getAuthorities: getAuthorities,
        getUserInfo: getUserInfo,
        createUser: createUser,
        updateUser: updateUser,
        getPersons: getPersons,
        getGroups: getGroups,
        changePassword: changePassword,
        getCurrentUserCaseOwnersGroups: getCurrentUserCaseOwnersGroups,
        uploadUsersCSVFile: uploadUsersCSVFile,
        getCapabilities: getCapabilities
    };

    function getCurrentUser() {
        return $http.get('/api/openesdh/currentUser').then(function(response) {
            return response.data;
        });
    }

    function deletePerson(userName) {
        return $http.delete('/api/people/' + userName).then(function(response) {
            return response.data;
        });
    }

    function getPerson(username) {
        return $http.get('/api/people/' + username).then(function(response) {
            return response.data;
        });
    }

    function getHome() {
        return $http.get('/api/nodelocator/userhome').then(function(response) {
            return response.data.data;
        });
    }

    /*
     * gets all authorities
     */
    function getAuthorities() {
        return $http.get('/api/openesdh/authorities').then(function(response) {
            var items = response.data;
            //TODO: remove this temp fix:
            if (items.data && items.data.items) {
                items = items.data.items;
            }
            return Object.keys(items).map(function(key) {
                return items[key];
            });
        });
    }

    function getUserInfo(userName) {
        return $http.get('/api/openesdh/user/' + userName).then(function(response) {
            return response.data;
        });
    }

    function createUser(userObj) {
//        return $http.post('/api/people',
//                userObj,
//                { errorHandler: 'skip'}
//                ).then(function(response) {
//            console.log("Return success");
//            return response.data;
//        });
        return $http.post('/api/openesdh/user/' + userObj.cm.userName, userObj).then(function(response) {
            return response.data;
        });

    }

    function updateUser(userObj) {
//        return $http.put('/api/people/' + encodeURIComponent(userObj.userName), userObj, { errorHandler: 'skip'}).then(function(response) {
//            console.log("Return success");
//            return response.data;
//        });
        return $http.put('/api/openesdh/user/' + userObj.cm.userName, userObj).then(function(response) {
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
        return $http.get('/api/people' + filter).then(function(response) {
            return response.data;
        });
    }

    function getPersons(searchTerm) {
        var url = '/api/forms/picker/authority/children?selectableType=cm:person';
        if (searchTerm && searchTerm.length > 0) {
            url += '&searchTerm=' + searchTerm;
        }
        return $http.get(url).then(function(result) {
            return result.data.data.items;
        });
    }

    function getGroups(searchTerm) {
        var url = '/api/forms/picker/authority/children?selectableType=cm:authorityContainer';
        if (searchTerm && searchTerm.length > 0) {
            url += '&searchTerm=' + searchTerm;
        }
        return $http.get(url).then(function(result) {
            return result.data.data.items;
        });
    }

    function getCurrentUserCaseOwnersGroups() {
        var url = '/api/openesdh/user/case/owners/groups';
        return $http.get(url).then(function(result) {
            return result.data;
        });
    }

    function uploadUsersCSVFile(file) {

        var formData = new FormData();
        formData.append("filedata", file);
        formData.append("filename", file.name);

        return $http.post("/api/openesdh/users/upload", formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(response) {
            console.log(response.data);
            return response.data;
        });
    }

    function getCapabilities() {
        return $http.get('/api/openesdh/capabilities').then(function(response) {
            return response.data;
        });
    }
}
