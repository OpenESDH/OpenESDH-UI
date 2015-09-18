(function(){
    'use strict';

    angular
        .module('openeApp.groups')
        .controller('GroupController', GroupController);

    GroupController.$inject = ['$scope', '$mdDialog'];

    /**
     * Main Controller for the Groups module
     * @param $scope
     * @constructor
     */
    function GroupController($scope, $mdDialog) {
        
        // Return an array of group objects
        function listGroups() {};
        
        // !! Probably something that must be done with routes. !!
        // Display the group view and load it with one group object
        function showGroup( group_shortName ) {};
        
        // Return an array of user and group objects belonging to this group
        function listMembers( group_shortName ) {};
        
        // Add a user or subgroup to group
        function addMember( group_shortName ) {};
        
        // Remove member from group
        function removeMember( group_shortName, member_shortName ) {};
        
        // Create a new group, then go to this group's view
        function createGroup( shortName, displayName ) {};
        
    };
  
})();
