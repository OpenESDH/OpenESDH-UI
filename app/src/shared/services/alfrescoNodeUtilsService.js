
    angular
        .module('openeApp')
        .factory('alfrescoNodeUtils', alfrescoNodeUtils);

    function alfrescoNodeUtils() {
        var service = {
            processNodeRef: processNodeRef
        };
        return service;

        function processNodeRef(nodeRefInput) {
            try
            {
               // Split the nodeRef and rebuild from composite parts, for clarity and to support input of uri node refs.
               var arr = nodeRefInput.replace(":/", "").split("/"),
                  storeType = arr[0],
                  storeId = arr[1],
                  id = arr[2],
                  uri = storeType + "/" + storeId + "/" + id,
                  nodeRef = storeType + "://" + storeId + "/" + id;

               return (
               {
                  nodeRef: nodeRef,
                  storeType: storeType,
                  storeId: storeId,
                  id: id,
                  uri: uri,
                  toString: function()
                  {
                     return nodeRef;
                  }
               });
            }
            catch (e)
            {
               e.message = "Invalid nodeRef: " + nodeRef;
               throw e;
            }
        }
    }