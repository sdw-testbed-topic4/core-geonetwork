(function() {
  goog.provide('gn_suggestion_service');

  var module = angular.module('gn_suggestion_service', [
  ]);

  module.factory('gnSuggestion', [
    'gnBatchProcessing',
    'gnHttp',
    'gnEditor',
    'gnCurrentEdit',
    function(gnBatchProcessing, gnHttp, gnEditor, gnCurrentEdit) {

      var current = undefined;
      var callbacks = [];

      /**
       * gnSuggestion service PUBLIC METHODS
       * - load
       *******************************************
       */
      return {

        /**
         * Called on suggestion click in the list.
         * Either open a popup with a form or directly
         * execute the process.
         */
        onSuggestionClick: function(sugg) {
          this.setCurrent(sugg);
          if (sugg.params) {
            $('#runsuggestion-popup').modal('show');
            this.dispatch();
          } else {
            this.runProcess(sugg['@process']);
          }
        },

        /**
         * Directives can register callback that will be
         * executed when other call the dispatcher.
         * This is use because the suggestion content is in
         * a popup, whom scope can't be accessed by gnSuggestionList
         */
        register: function(cb) {
          callbacks.push(cb);
        },
        dispatch: function() {
          for (var i = 0; i < callbacks.length; ++i) {
            callbacks[i]();
          }
        },

        /**
         * Save current state to share suggestion between all
         * directives.
         */
        setCurrent: function(sugg) {
          current = sugg;
        },
        getCurrent: function() {
          return current;
        },

        /**
         * Call GN service to load all suggestion for the current
         * metadata
         */
        load: function() {
          return gnHttp.callService('suggestionsList', {
            id: gnCurrentEdit.id,
            action: 'analyze'
          });
        },

        runProcess: function(service, params) {
          if (angular.isUndefined(params)) {
            params = {};
          }
          params.process = service;
          gnBatchProcessing.runProcessMd(params).then(function(data) {
          });
        }
      };
    }]);
})();
