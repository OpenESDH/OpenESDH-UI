(function () {
    'use strict';

    angular.module('openeApp.cases.parties').factory('groupService', GroupService);

    GroupService.$inject = ['ALFRESCO_URI', '$http', '$q'];

    function GroupService(ALFRESCO_URI, $http, $q) {
        var GROUP_PROXY_URI = ALFRESCO_URI.serviceApiProxy + 'groups/';
        return {
            listAllSystemGroups: listAllSystemGroups,
            isGroupMember: isGroupMember,
            getGroup: getGroup,
            getGroupMembers: getGroupMembers,
            addUserToGroup: addUserToGroup,
            removeUserFromGroup: removeUserFromGroup,
            createGroup: createGroup,
            updateGroup: updateGroup,
            deleteGroup: deleteGroup
        };

        /**
         * Lists all the groups in the system
         * @returns {*}
         */
        function listAllSystemGroups() {
            //limit maximum results to 100 
            return $http.get(ALFRESCO_URI.serviceApiProxy + 'groups?filter=*&maxItems=100')
                .then(successOrReject);
        }

        /**
         * returns a boolean value indicating whether the user is part of a group
         * @param userName
         * @param groupShortName
         * @returns boolean
         */
        function isGroupMember(userName, groupShortName) {
            return $http.get(GROUP_PROXY_URI + groupShortName + '/member/' + userName).then(function (response) {
                return response.isMember;
            });
        }

        /**
         * returns a group given its shortName
         * @param groupShortName
         * @returns {*}
         */
        function getGroup(groupShortName) {
            return $http.get(GROUP_PROXY_URI + groupShortName).then(successOrReject);
        }

        /**
         * Lists all the direct children of a group given it's shortName
         * @param groupShortName
         * @returns [authorities]
         */
        function getGroupMembers(groupShortName) {
            return $http.get(GROUP_PROXY_URI + groupShortName + '/children?maxItems=100').then(successOrReject);
        }

        /**
         * Adds a user to a group
         * @param userName
         * @param groupShortName
         * @returns {} empty object if successful
         */
        // TODO: This method have to accept an array of users
        // [{name: 'the_name', username: 'the_username'}, {...}]
        function addUserToGroup(groupShortName, userName) {
            return $http.post(GROUP_PROXY_URI + groupShortName + '/children/' + userName)
                .then(successOrReject);
        }

        /**
         * Deletes a user from a group (Does not delete the user from system)
         * @param groupShortName
         * @param userName
         * @returns {*} an empty object
         */
        function removeUserFromGroup(groupShortName, userName) {
            return $http.delete(GROUP_PROXY_URI + groupShortName + '/' + userName).then(successOrReject);
        }

        /**
         * Creates a group given a shortName (this must contain NO SPACES) and a display name.
         * @param groupShortName
         * @param displayName
         * @returns {*} Newly created group object
         */
        function createGroup(groupShortName, displayName) {
            return $http.post(ALFRESCO_URI.serviceApiProxy + 'rootgroups/' + groupShortName, {params: {displayName: displayName}})
                .then(successOrReject);
        }

        /**
         * Updates a group displayName.
         * @param displayName
         * @returns {*} Newly created group object
         */
        function updateGroup(groupShortName, displayName) {
            return $http.post(GROUP_PROXY_URI + groupShortName, {params: {displayName: displayName}})
                .then(successOrReject);
        }

        /**
         * Deletes a group given its shortName (Will not delete users or subgroups)
         * @param groupShortName
         * @returns {*} empty obj
         */
        function deleteGroup(groupShortName) {
            return $http.delete(GROUP_PROXY_URI + groupShortName).then(successOrReject);
        }

        function successOrReject(response) {
            if (response.status && response.status !== 200) {
                return $q.reject(response);
            }
            return response.data || response;
        }
    }
})();