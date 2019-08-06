;
(function() {

    'use strict';
    var app = angular.module('um');

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('/', {
            url: '/',
            templateUrl: 'views/login.html',
        })
        .state('/user-management-home', {
            url: '/home'
        })
        .state('/user-management-action', {
            url: '/action',
            templateUrl: 'views/templates/action-manager.html',
            controller: 'ActionManagerController'
        })
        .state('/user-management-institution',{
            url: '/institute',
            templateUrl: 'views/templates/institute-manager.html',
            controller: 'InstituteManagerController'
        })
        .state('/user-management-product', {
            url: '/product',
            templateUrl: 'views/templates/product-manager.html',
            controller: 'ProductManagerController'
        })
        .state('/user-management-user', {
            url: '/user',
            templateUrl: 'views/templates/user-manager.html',
            controller: 'UserSearchController'
        })
        .state('/user-management-profile', {
            url: '/profile',
            templateUrl: 'views/templates/profile-details.html',
            controller: 'ProfileDataController'
        })
        .state('/user-management-change-password', {
            url: '/change-password',
            templateUrl: 'views/change-password.html',
            controller: 'ChangePasswordController'
        })
        .state('/user-management-role', {
            url: '/role',
            templateUrl: 'views/templates/role-manager.html',
            controller: 'RoleManagerController'
        })
        .state('/user-management-branch', {
            url: '/branch',
            templateUrl: 'views/templates/branch-manager.html',
            controller: 'BranchManagerController'
        })
        .state('/user-management-dealer', {
            url: '/dealer',
            templateUrl: 'views/templates/dealer-manager.html',
            controller: 'DealerManagerController'
        })
        .state('/user-management-upload', {
            url: '/upload',
            templateUrl: 'views/templates/upload.html',
            controller: 'UploadController'
        })
        .state('/user-management-download', {
            url: '/download',
            templateUrl: 'views/templates/download.html',
            controller: 'DownloadController'
        })
        .state('/user-management-bulkUserDownload', {
            url: '/bulk-users',
            templateUrl: 'views/templates/bulk-user-download.html',
            controller: 'BulkUserDownloadController'
        });
        $urlRouterProvider.otherwise('/');
    }]);

    app.factory("Interceptor", function($q, $location) {
        return {

            request: function(config) {
                config.requestTimestamp = new Date().getTime();
                return config;
            },

            response: function(response) {

                response.config.responseTimestamp = new Date().getTime();

                return response || $q.when(response);
            },

            responseError: function(response) {

                //TODO in case of error define your handler function

                if (response.status === 422) {
                    //response.finalData = (response.data.errors);
                }

                return $q.reject(response);
            }
        };
    });

    app.run(['$rootScope', '$location', 'APP_CONST', '$window', function($rootScope, $location, APP_CONST, $window) {
        $rootScope.online = navigator.onLine;
        $window.addEventListener("offline", function() {
            $rootScope.$apply(function() {
                $rootScope.online = false;
            });
        }, false);

        $window.addEventListener("online", function() {
            $rootScope.$apply(function() {
                $rootScope.online = true;
            });
        }, false);

        $rootScope.$on('$stateChangeStart', function(event, to, toParam, from, fromParam) {

            if (_.contains(["/"], to.name)) return;

            var guid = sessionStorage.getItem('GUID');

            if (_.isUndefined(guid) || _.isNull(guid)) {
                event.preventDefault();
                $location.path(APP_CONST.getConst('APP_CONTEXT'));
            }
        })
    }]);
}).call(this);