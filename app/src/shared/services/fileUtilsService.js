
    angular
        .module('openeApp')
        .factory('fileUtilsService', fileUtilsService);

    function fileUtilsService() {
        return {
            getFileIconByMimetype: getFileIconByMimetype,
            getFileExtension: getFileExtension,
            getMsProtocolForFileExtension: getMsProtocolForFileExtension,
            getMsProtocolForFile: getMsProtocolForFile
        };

        /**
         * Copied and adapted from Alfresco share for use in openESDH. The next 3 functions that is.
         */
        function getFileIconByMimetype  (mimetype, p_iconSize) {
            var extns =
            {
                "text/css": "css",
                "application/vnd.ms-excel": "xls",
                "image/tiff": "tiff",
                "audio/x-aiff": "aiff",
                "application/vnd.ms-powerpoint": "ppt",
                "application/illustrator": "ai",
                "image/gif": "gif",
                "audio/mpeg": "mp3",
                "message/rfc822": "eml",
                "application/vnd.oasis.opendocument.graphics": "odg",
                "application/x-indesign": "indd",
                "application/rtf": "rtf",
                "audio/x-wav": "wav",
                "application/x-fla": "fla",
                "video/x-ms-wmv": "wmv",
                "application/msword": "doc",
                "video/x-msvideo": "avi",
                "video/mpeg2": "mpeg2",
                "video/x-flv": "flv",
                "application/x-shockwave-flash": "swf",
                "audio/vnd.adobe.soundbooth": "asnd",
                "image/svg+xml": "svg",
                "application/vnd.apple.pages": "pages",
                "text/plain": "txt",
                "video/quicktime": "mov",
                "image/bmp": "bmp",
                "video/x-m4v": "m4v",
                "application/pdf": "pdf",
                "application/vnd.adobe.aftereffects.project": "aep",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
                "text/xml": "xml",
                "application/zip": "zip",
                "video/webm": "webm",
                "image/png": "png",
                "text/html": "html",
                "image/vnd.adobe.photoshop": "psd",
                "video/ogg": "ogv",
                "image/jpeg": "jpg",
                "application/x-zip": "fxp",
                "video/mp4": "mp4",
                "image/x-xbitmap": "xbm",
                "video/x-rad-screenplay": "avx",
                "video/x-sgi-movie": "movie",
                "audio/x-ms-wma": "wma",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
                "application/vnd.oasis.opendocument.presentation": "odp",
                "video/x-ms-asf": "asf",
                "application/vnd.oasis.opendocument.spreadsheet": "ods",
                "application/vnd.oasis.opendocument.text": "odt",
                "application/vnd.apple.keynote": "key",
                "image/vnd.adobe.premiere": "ppj",
                "application/vnd.apple.numbers": "numbers",
                "application/eps": "eps",
                "audio/basic": "au"
            };

            var prefix = "generic",
                iconSize = typeof p_iconSize === "number" ? p_iconSize : 32;
            if (mimetype in extns) {
                prefix = extns[mimetype];
            }

            return prefix + "-file-" + iconSize + ".png";
        }

        /**
         * Returns the extension from file url or path
         *
         * @method getFileExtension
         * @param filePath {string} File path from which to extract file extension
         * @return {string|null} File extension or null
         * @static
         */
        function getFileExtension(filePath) {
            var match = (new String(filePath)).match(/^.*\.([^\.]*)$/);
            if (Array.isArray(match) && (typeof(match[1]) === "string" || match instanceof String) ) {
                return match[1];
            }

            return null;
        }

        /**
         * Given a filename, returns either a filetype icon or generic icon file stem
         *
         * @method getFileIcon
         * @param p_fileName {string} File to find icon for
         * @param p_fileType {string} Optional: Filetype to offer further hinting
         * @param p_iconSize {int} Icon size: 32
         * @return {string} The icon name, e.g. doc-file-32.png
         * @static
         */
        function getFileIcon(p_fileName, p_fileType, p_iconSize, p_fileParentType) {
            // Mapping from extn to icon name for cm:content
            var extns =
            {
                "aep": "aep",
                "ai": "ai",
                "aiff": "aiff",
                "asf": "video",
                "asnd": "asnd",
                "asx": "video",
                "au": "audio",
                "avi": "video",
                "avx": "video",
                "bmp": "img",
                "css": "text",
                "divx": "video",
                "doc": "doc",
                "docx": "doc",
                "docm": "doc",
                "dotx": "doc",
                "dotm": "doc",
                "eml": "eml",
                "eps": "eps",
                "fla": "fla",
                "flv": "video",
                "fxp": "fxp",
                "gif": "img",
                "htm": "html",
                "html": "html",
                "indd": "indd",
                "jpeg": "img",
                "jpg": "img",
                "key": "key",
                "mkv": "video",
                "mov": "video",
                "movie": "video",
                "mp3": "mp3",
                "mp4": "video",
                "mpeg": "video",
                "mpeg2": "video",
                "mpv2": "video",
                "msg": "eml",
                "numbers": "numbers",
                "odg": "odg",
                "odp": "odp",
                "ods": "ods",
                "odt": "odt",
                "ogg": "video",
                "ogv": "video",
                "pages": "pages",
                "pdf": "pdf",
                "png": "img",
                "ppj": "ppj",
                "ppt": "ppt",
                "pptx": "ppt",
                "pptm": "ppt",
                "pps": "ppt",
                "ppsx": "ppt",
                "ppsm": "ppt",
                "pot": "ppt",
                "potx": "ppt",
                "potm": "ppt",
                "ppam": "ppt",
                "sldx": "ppt",
                "sldm": "ppt",
                "psd": "psd",
                "qt": "video",
                "rtf": "rtf",
                "snd": "audio",
                "spx": "audio",
                "svg": "img",
                "swf": "swf",
                "tif": "img",
                "tiff": "img",
                "txt": "text",
                "wav": "audio",
                "webm": "video",
                "wmv": "video",
                "xls": "xls",
                "xlsx": "xls",
                "xltx": "xls",
                "xlsm": "xls",
                "xltm": "xls",
                "xlam": "xls",
                "xlsb": "xls",
                "xml": "xml",
                "xvid": "video",
                "zip": "zip"
            };

            var prefix = "generic",
                fileType = typeof p_fileType === "string" ? p_fileType : "cm:content",
                fileParentType = typeof p_fileParentType === "string" ? p_fileParentType : null,
                iconSize = typeof p_iconSize === "number" ? p_iconSize : 32;

            // If type = cm:content, then use extn look-up
            var type = Alfresco.util.getFileIcon.types[fileType];
            if (type === "file") {
                var extn = p_fileName.substring(p_fileName.lastIndexOf(".") + 1).toLowerCase();
                if (extn in extns) {
                    prefix = extns[extn];
                }
            }
            else if (typeof type == "undefined") {
                if (fileParentType !== null) {
                    type = Alfresco.util.getFileIcon.types[fileParentType];
                    if (typeof type == "undefined") {
                        type = "file";
                    }
                }
                else {
                    type = "file";
                }
            }
            return prefix + "-" + type + "-" + iconSize + ".png";
        }
        
        function getMsProtocolForFileExtension(fileExtension){
           var msProtocolNames = {
              'doc'  : 'ms-word',
              'docx' : 'ms-word',
              'docm' : 'ms-word',
              'dot'  : 'ms-word',
              'dotx' : 'ms-word',
              'dotm' : 'ms-word',
              'xls'  : 'ms-excel',
              'xlsx' : 'ms-excel',
              'xlsb' : 'ms-excel',
              'xlsm' : 'ms-excel',
              'xlt'  : 'ms-excel',
              'xltx' : 'ms-excel',
              'xltm' : 'ms-excel',
              'ppt'  : 'ms-powerpoint',
              'pptx' : 'ms-powerpoint',
              'pot'  : 'ms-powerpoint',
              'potx' : 'ms-powerpoint',
              'potm' : 'ms-powerpoint',
              'pptm' : 'ms-powerpoint',
              'pps'  : 'ms-powerpoint',
              'ppsx' : 'ms-powerpoint',
              'ppam' : 'ms-powerpoint',
              'ppsm' : 'ms-powerpoint',
              'sldx' : 'ms-powerpoint',
              'sldm' : 'ms-powerpoint'
           };
           return msProtocolNames[fileExtension];
        }
        
        function getMsProtocolForFile(filePath){
            var ext = getFileExtension(filePath);
            return getMsProtocolForFileExtension(ext);
        }

    }