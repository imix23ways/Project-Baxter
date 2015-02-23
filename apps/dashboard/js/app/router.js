define([
	'jquery','underscore','backbone','manager/ServicesManager', 'FrameView', 'AppData', 'views/app-nav/AppNavView'
], function(
	$, _, Backbone, ServicesManager, FrameView, AppData, AppNavView
) {

	/*
	 * Define route paths here.
	 */
	var AppRouter = Backbone.Router.extend({
		routes: {
			'dashboard' : 'showDashboardView',
			'forms' : 'showFormsView',
			'settings' : 'showSettingsView',
			'*path': 'showDashboardView'
		}
	});

	var initialize = function() {
		var appData = ServicesManager.getAppData();

		var frameView = new FrameView({el: 'body'});
		frameView.setModel(appData);

		var appNavView = new AppNavView({el: '#app-nav'});
		frameView.setAppNavView(appNavView);
		
		var route = function(routeDeps) {
			ServicesManager.saveAppData();
			require([routeDeps], function(RouteModule) {
				var routeModule = new RouteModule();
				routeModule.renderRoute(frameView, appNavView);
			});
		};
		
		/*
		 * Define route modules here.
		 */
		var app_router = new AppRouter;

		app_router.on('route:showDashboardView', function() {
			route('route/DashboardViewRoute');
		});
		app_router.on('route:showFormsView', function() {
			route('route/FormsViewRoute');
		});
		app_router.on('route:showSettingsView', function() {
			route('route/SettingsViewRoute');
		});

		Backbone.history.start();
	};

	return {
		initialize : initialize
	};
	
});