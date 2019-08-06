;
(function() {

    'use strict';

    /**
     *  Module
     *
     * Description
     *  setting system wide configurations
     */
    var app = angular.module('um');

    app.config(["$httpProvider","notifierProvider", function($httpProvider,notifierProvider) {
        $httpProvider.interceptors.push('Interceptor');

        $httpProvider.defaults.headers.delete = { 'Content-Type' : 'application/json' };
        $httpProvider.defaults.transformResponse = appendTransform($httpProvider.defaults.transformResponse, function(response){

            // if(response){
            //     if(response.oStatus && response.oStatus.iStatus === 200){
            //         response = response.oBody.payLoad;
            //     }else if(response.oStatus && (response.oStatus.iStatus == 204)){
            //         return null;
            //     }else if(response.aError){
            //         response = response;
            //     }else{
            //         //console.log("unexpected response recovered from server ")
            //     }
            //     else if(response.oStatus && (response.oStatus.iStatus != 200 && response.oStatus.iStatus != 204)){
            //         notifierProvider.$get().logWarning(response.aError[0].sMessage);
            //         return null;
            //     }
            // }

            if(response){
                if(response.oStatus && response.oStatus.iStatus === 200 && response.oBody){
                    response = response.oBody.payLoad;
                }else if(response.oStatus && (response.oStatus.iStatus == 204)){
                    return null;
                }else if(response.oStatus && response.aError){
                    notifierProvider.$get().logWarning(response.aError.oDeveloperMessage );
                    return null;
                }
            }

            return response;
        })

        // $httpProvider.defaults.transformRequest = appendTransform($httpProvider.defaults.transformRequest, function(data){
        //     //console.log(data);
        //
        //     if(data){
        //         data.replace(/[^\x20-\x7E]/gmi, "");
        //         //console.log(data);
        //     }
        //     return data;
        // })
    }]);

    function appendTransform(defaults, transform){
        defaults = angular.isArray(defaults) ? defaults : [defaults]

        return defaults.concat(transform);
    }

    app.config(['$resourceProvider',"APP_CONSTProvider", function ($resourceProvider,APP_CONSTProvider) {

            $resourceProvider.defaults.stripTrailingSlashes = false;

      }]);

    app.config(['cfpLoadingBarProvider', '$compileProvider', function(cfpLoadingBarProvider, $compileProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.parentSelector = 'nav';
        $compileProvider.debugInfoEnabled(false);

    }]);

    app.config(['$uibModalProvider', function($uibModalProvider) {
        $uibModalProvider.options = {
            backdrop: 'static',
            keyboard: false,
            animation: true
        }
    }]);

    app.config(['$provide', '$logProvider', function($provide, $logProvider) {
        $logProvider.debugEnabled(true);
        $provide.decorator('$log', ['$delegate', function($delegate) {

            var origDebug = $delegate.debug;
            var origInfo = $delegate.info;
            var origLog = $delegate.log;

            $delegate.info = function() {
                if ($logProvider.debugEnabled()) {
                    origInfo.apply(null, arguments);
                }
            };

            $delegate.log = function() {
                if ($logProvider.debugEnabled()) {
                    origLog.apply(null, arguments);
                }
            }

            $delegate.debug = function() {
                var args = [].slice.call(arguments);
                args[0] = [new Date().toString(), ':', args[0]].join('');
                origDebug.apply(null, args);
            };

            return $delegate;
        }]);
    }]);

    app.config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            return date ? moment(date).format('DD:MM:YYYY') : '';
        };

        $mdDateLocaleProvider.parseDate = function(dateString) {
            var m = moment(dateString, 'DD:MM:YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
    }]);

    app.config(['$compileProvider', function($compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image|data:application\//);
    }]);

    app.config(function($mdThemingProvider) {
        var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ffffff'
        });
        $mdThemingProvider.definePalette('customBlue', customBlueMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('customBlue', {
                'default': '500',
                'hue-1': '50'
            })
            .accentPalette('pink');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey')
    });
}).call(this);
