angular
        .module('openeApp.translations.init')
        .provider('languageFiles', LanguageFilesProvider);

function LanguageFilesProvider() {
    var availableFiles = {files: []};
    this.addFile = addFile;
    this.getLanguageFiles = getLanguageFiles;
    this.$get = LanguageFilesService;

    function addFile(prefix, suffix) {
        availableFiles.files.push({
            prefix: prefix,
            suffix: suffix
        });
        return this;
    }

    function getLanguageFiles() {
        return availableFiles;
    }

    function LanguageFilesService() {
        var service = {
            getLanguageFiles: getLanguageFiles
        };
        return service;
    }
}