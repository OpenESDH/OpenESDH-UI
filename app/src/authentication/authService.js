angular
        .module('openeApp')
        .config(config)
        .factory('httpTicketInterceptor', httpTicketInterceptor)
        .factory('authService', authService);

function config($httpProvider) {
    $httpProvider.interceptors.push('httpTicketInterceptor');
    $httpProvider.defaults.headers.common.Authorization = undefined;
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}

function httpTicketInterceptor($injector, $translate, $window, $q, sessionService) {
    return {
        request: request,
        response: response,
        responseError: responseError
    };

    function request(config) {
        config.url = prefixAlfrescoServiceUrl(config.url); 
        
        if (sessionService.getUserInfo()) {
            config.params = config.params || {};
            config.params.alf_ticket = sessionService.getUserInfo().ticket;
        }
        return config;
    }
    
    function prefixAlfrescoServiceUrl(url){
        if(url.startsWith("/api/") || url.startsWith("/slingshot/") || url == "/touch" || url == "/dk-openesdh-case-email"){
            return "/alfresco/wcs" + url;
        }
        return url;
    }
    
    function response(response) {
        if (response.status == 401 && typeof $window._openESDHSessionExpired === 'undefined') {
            sessionExpired();
        }
        return response || $q.when(response);
    }

    function responseError(rejection) {
        if (rejection.status == 401) {
            sessionExpired();
        }
        return $q.reject(rejection);
    }

    function sessionExpired() {
        if (typeof $window._openESDHSessionExpired !== 'undefined')
            return;

        $window._openESDHSessionExpired = true;
        sessionService.setUserInfo(null);
        var $mdDialog = $injector.get('$mdDialog'),
                notificationUtilsService = $injector.get('notificationUtilsService');
        $mdDialog.cancel();
        sessionService.retainCurrentLocation();
        $window.location = "/#/login";
        notificationUtilsService.notify($translate.instant('LOGIN.SESSION_TIMEOUT'));
        delete $window._openESDHSessionExpired;
    }
}

function authService($http, $window, $state, sessionService, userService, oeParametersService) {
    var service = {
        login: login,
        logout: logout,
        loggedin: loggedin,
        changePassword: changePassword,
        isAuthenticated: isAuthenticated,
        isAuthorized: isAuthorized,
        getUserInfo: getUserInfo,
        revalidateUser: revalidateUser,
        ssoLogin: ssoLogin
    };

    return service;

    function getUserInfo() {
        return sessionService.getUserInfo();
    }
    
    function ssoLogin(){
        return $http.get("/touch").then(function(response){
            console.log("sso", response);
            return response;
        });
    }

    function login(username, password) {
        var userInfo = {};
        return $http.post("/api/login", {
            username: username,
            password: password
        }).then(function(response) {
            sessionService.setUserInfo(userInfo);
            return addUserAndParamsToSession(username);
        }, function(reason) {
            console.log(reason);
            return reason;
        });
    }

    function logout() {
        var userInfo = sessionService.getUserInfo();

        
        if (userInfo){
            return $http.post('/api/openesdh/logout').then(function(response) {
              sessionService.setUserInfo(null);
              sessionService.clearRetainedLocation();
              oeParametersService.clearOEParameters();
              return response;
            });
        }

    }

    function loggedin() {
        return sessionService.getUserInfo();
    }

    /**
     * Accepts a user email (which should be unique) bound to a unique user name, recreates a password for the user
     * and emails the user with the details required to login to the system.
     * @param email
     * @returns {*}
     */
    function changePassword(email) {
        return $http.post("/api/openesdh/reset-user-password", {email: email}).then(function(response) {
            return response;
        });
    }

    function isAuthenticated() {
        return sessionService.getUserInfo();
    }

    function isAuthorized(authorizedRoles) {
        var userInfo = sessionService.getUserInfo();
        if (typeof userInfo === 'undefined') {
            return false;
        }
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        //TODO refactor when we have more role types
        //We should loop through each authorized role and return true as soon as we detect a true value
        //As we have only two roles we need only to return whether the user is an admin or return the inverse of
        //user.isAdmin when the user role is set to user (i.e. return true if the user is not admin when the role is
        //user
//        for (var n = 0; n < authorizedRoles.length; n++) {
//            //if admin we don't care return true immediately
//            if (userInfo.user.capabilities.isAdmin)
//                return true;
//            if (authorizedRoles[n] === 'user')
//                return !userInfo.user.capabilities.isAdmin;
//        }
        return userInfo.user.capabilities.isAdmin ||
                (authorizedRoles.length > 0 && authorizedRoles.indexOf('user') > -1);
    }

    function revalidateUser() {
        return $http.get('/api/openesdh/currentUser').then(function(response) {
            addUserAndParamsToSession(response.data.userName);
        });
    }

    function addUserAndParamsToSession(username) {
        return userService.getPerson(username).then(function(response) {
            delete $window._openESDHSessionExpired;
            var userInfo = sessionService.getUserInfo();
            userInfo['user'] = response;
            sessionService.setUserInfo(userInfo);
            oeParametersService.loadParameters();
            return response;
        });
    }
}