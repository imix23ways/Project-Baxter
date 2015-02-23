require.config({
	baseUrl : 'js/app',
	paths: {
		main: '../main',
		AppData : 'model/AppData',
		manager : '../../../../core/js/manager',
		/* vendor libraries */
		underscore: '../../../../core/js/vendor/underscore',
		backbone: '../../../../core/js/vendor/backbone',
		text: '../../../../core/js/vendor/text',
		jquery: '../../../../core/js/vendor/jquery-1.9.1.min',
		jqueryui: '../../../../core/js/vendor/jquery-ui',
		highcharts: '../../../../core/js/vendor/highcharts',
		highchartsMore	: '../../../../core/js/vendor/highcharts-more',
		drilldown	: '../../../../core/js/vendor/drilldown',
		progressbar : '../../../../core/js/vendor/progressbar.min',
		countdown : '../../../../core/js/vendor/countdown.min'
	},
	
	shim: {
		
		main : {
			deps : ["manager/ManagerRegistry","AppView","AppModel"]
		},
		
		backbone: {
			deps: [ "underscore", "jquery" ],
			exports: "Backbone"
		},

		underscore: {
			exports: "_"
		},

		highcharts: {
			deps: ['jqueryui'],
			exports: "Highcharts"
		},
		
		highchartsMore : {
			deps : ["highcharts"],
			exports : "Highcharts"
		},
		
		jquery : {
			exports: 'jQuery'
		},

		jqueryui: {
			deps: ['jquery','jquery'],
			exports: 'jQuery'
		},

		countdown : {
			exports: 'countdown'
		},

		drilldown : {
			deps : ["highcharts"],
			exports : "Highcharts"
		},

		progressbar : {
			exports: 'progressbar'
		}
	}
});

require(['app'], function(App) {
	App.initialize();
});