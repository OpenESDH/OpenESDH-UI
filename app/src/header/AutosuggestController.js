
    angular
        .module('openeApp.search')
        .controller('AutosuggestController', AutosuggestController);

    /**
     * Main Controller for the Search module
     * @param $scope
     * @constructor
     */
    function AutosuggestController($state, $q, $mdConstant, searchService, alfrescoNodeUtils, fileUtilsService, ContextService) {

        var asctrl = this;
        asctrl.liveSearchResults = {
            cases: null,
            documents: null
        };
        asctrl.searchTerm = "";
        asctrl.selectedIndex = -1;
        asctrl.totalSuggestion = 0;
        asctrl.loading = false;
        asctrl.hidden = false;
        asctrl.context = ContextService;

        asctrl.getLiveSearchResults = function (term) {
            if (term.length === 0 || asctrl.loading) return;
            asctrl.loading = true;
            asctrl.totalSuggestion = 0;
            clearResult();
            var searchContext = (ContextService.getContext() != null) ? ContextService.getContext().id : "default";

            switch (searchContext) {
                case "templates":
                    searchService.liveSearchDoTemplates(term).then(parseTemplates).then(function () {
                        asctrl.loading = false;
                    });
                    break;
                default:
                    getDefaultSuggestions(term);
            }
        };

        function parseDocs (res) {
            asctrl.liveSearchResults.documents = res.data.documents;
            asctrl.liveSearchResults.documents.forEach(function(document){
                document.thumbNailURL = fileUtilsService.getFileIconByMimetype(document.fileMimeType,32);
            });
            asctrl.totalSuggestion += asctrl.liveSearchResults.documents.length;
        }

        function parseTemplates (res) {
            asctrl.liveSearchResults.documents = res.data.templates;
            asctrl.liveSearchResults.documents.forEach(function(template){
                template.thumbNailURL = fileUtilsService.getFileIconByMimetype(document.fileMimeType,32);
            });
            asctrl.totalSuggestion += asctrl.liveSearchResults.documents.length;
        }

        function parseCases(res) {
            asctrl.liveSearchResults.cases = res.data.cases;
            asctrl.totalSuggestion += asctrl.liveSearchResults.cases.length;
        }

        function getDefaultSuggestions(term) {
            $q.all([
                searchService.liveSearchCaseDocs(term),
                searchService.liveSearchCases(term)
            ]).then(function (res) {
                parseDocs(res[0]);
                parseCases(res[1]);
                asctrl.loading = false;
            });
        }

        /**
         * Returns a bool, if the suggestion box should be visible
         */
        asctrl.suggestionVisible = function () {
            return !!(asctrl.searchTerm.length > 0 && !asctrl.hidden);

        };

        /**
         * Return bool if the item is a document.
         */
        asctrl.isDocument = function (item) {
            return item && item.hasOwnProperty('version');
        };

        /**
         * This function is meant to be called to redirect user to the search page
         */
        asctrl.gotoSearchPage = function() {

            var queryObj = {
                'query': asctrl.searchTerm
            }

            // Set context if exists
            if(ContextService.getContext()) {
                queryObj.ctx = ContextService.getContext().id;
            }

            $state.go('search', queryObj);
        };

        asctrl.goToSuggestion = function(item) {
            if(asctrl.isDocument(item)) {
                var ref = alfrescoNodeUtils.processNodeRef(item.docRecordNodeRef);
                $state.go('docDetails', {
                    'caseId': item.case.caseId,
                    'storeType' : ref.storeType,
                    'storeId': ref.storeId,
                    'id': ref.id
                })
            } else {
                $state.go('caseinfo', {'caseId': item.caseId})
            }
        };

        /**
         * Since we got to sources (two result-arrays), we need to find the correct selected
         */
        function getSelectedItemByIndex (index) {

            var totalDocs = asctrl.liveSearchResults.documents.length;
            var totalCases = asctrl.liveSearchResults.cases.length;

            // Documents (first array)
            if(index <= (totalDocs - 1)) {
                return asctrl.liveSearchResults.documents[index];
            } else {
                var caseIndex = index - totalDocs;
                //console.log("caseindex: ", caseIndex)
                return asctrl.liveSearchResults.cases[caseIndex];
            }
        }

        function stopAndPrevent(e) {
            e.stopPropagation();
            e.preventDefault();
        }

        function clearResult(argument) {
            asctrl.liveSearchResults = {
                cases: null,
                documents: null
            };
            asctrl.totalSuggestion = 0;
            asctrl.selectedIndex = -1;
        }

        /**
        * Clears the searchText value and selected item.
        */
        function clearValue () {
            asctrl.searchTerm = '';
            clearResult();
        }

        /**
         * Handling keyboard input
         */
         asctrl.keydown = function(event) {
            switch (event.keyCode) {
                case $mdConstant.KEY_CODE.DOWN_ARROW:
                    if (asctrl.loading) return;
                    stopAndPrevent(event);
                    if(asctrl.selectedIndex < asctrl.totalSuggestion -1) asctrl.selectedIndex++;
                    //console.log("Selected index: ", asctrl.selectedIndex);
                    break;
                case $mdConstant.KEY_CODE.UP_ARROW:
                    if (asctrl.loading) return;
                    stopAndPrevent(event);
                    if(asctrl.selectedIndex > -1) asctrl.selectedIndex--;
                    //console.log("Selected index: ", asctrl.selectedIndex);
                    break;
                case $mdConstant.KEY_CODE.BACKSPACE:
                    if(asctrl.searchTerm === '') ContextService.clearContext();
                    break;
                case $mdConstant.KEY_CODE.TAB:
                case $mdConstant.KEY_CODE.ENTER:
                    if(asctrl.selectedIndex === -1) return;
                    stopAndPrevent(event);
                    var selected = getSelectedItemByIndex(asctrl.selectedIndex);
                    asctrl.goToSuggestion(selected);
                    break;
                case $mdConstant.KEY_CODE.ESCAPE:
                    stopAndPrevent(event);
                    clearValue();
                    break;
                default:
          }
      }

    }
