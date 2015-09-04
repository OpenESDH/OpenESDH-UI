(function () {
    'use strict';

    angular
        .module('openeApp')
        .factory('serverVersionService', ServerVersionService);

    ServerVersionService.$inject = ['$http'];

    function ServerVersionService($http) {
        return {
            getGitDetails: getGitDetails
        };

        function getGitDetails() {
            return $http.get("/alfresco/service/api/openesdh/getversion").then(function (response) {
                return {
                    gitCommitId: response.data.scmCommitId,
                    gitBranch: response.data.scmBranchName
                };
            });
        }

    }
})();
