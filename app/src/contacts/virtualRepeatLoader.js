
angular.module('openeApp')
        .factory('VirtualRepeatLoader', VirtualRepeatLoader);

function VirtualRepeatLoader() {

    var DEFAULT_PAGE_SIZE = 20;

    return function(requestFn, errorFn) {

        var self = this;
        self.toLoad_ = 0;
        self.beenInitialized = false;
        self.items = [{}];
        self.params = {};
        self.searchQuery = null;

        self.createParams = function() {
            return {
                pageSize: DEFAULT_PAGE_SIZE,
                page: 0,
                totalRecords: null,
                sortField: null,
                sortAscending: true
            };
        };

        // Required!!.
        self.getItemAtIndex = function(index) {
            if (index > self.items.length) {
                self.fetchMoreItems_(index);
                return null;
            }
            return self.items[index];
        };

        // Required!!.
        self.getLength = function() {
            return self.beenInitialized ? self.items.length : DEFAULT_PAGE_SIZE;
        };

        self.fetchMoreItems_ = function(index) {
            if (!self.beenInitialized) {
                self.params = self.createParams();
                self.beenInitialized = true;
            }

            if (self.toLoad_ < index) {
                self.toLoad_ += self.params.pageSize;
                self.params.page++;
                self.makeRequest();
            }
        };

        self.refresh = function() {
            self.items = [];
            self.searchQuery = null;
            self.toLoad_ = 0;
            self.beenInitialized = false;
        };

        self.search = function(query) {
            self.refresh();
            self.searchQuery = query;
        };

        self.makeRequest = function() {
            // console.log(self.searchQuery, self.params)
            requestFn(self.searchQuery, self.params).then(function(response) {
                self.items = self.items.concat(response.items);
                self.params.totalRecords = response.totalRecords;
            }, errorFn);
        };

        return {
            getItemAtIndex: self.getItemAtIndex,
            getLength: self.getLength,
            search: self.search,
            refresh: self.refresh
        };
    };

}