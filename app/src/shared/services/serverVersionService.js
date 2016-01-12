
    angular
        .module('openeApp')
        .factory('serverVersionService', ServerVersionService);

    function ServerVersionService($http) {
        return {
            getGitDetails: getGitDetails
        };

        function getGitDetails() {
            return $http.get("/api/openesdh/getversion").then(function (response) {
                return {
                    gitCommitId: response.data.scmCommitId,
                    gitBranch: response.data.scmBranchName
                };
            });
        }

    }