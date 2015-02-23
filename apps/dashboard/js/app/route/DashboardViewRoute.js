define([
        'AppModel',
        'views/dashboard/DashboardView'
        ],
function(
		AppModel,
		DashboardView
		){
	
	var DashboardViewRoute = AppModel.extend({
		renderRoute : function(frameView, appNav) {
			var dashboardView = new DashboardView();
			dashboardView.setModel(frameView.model);
			frameView.renderMainContent(dashboardView);
			appNav.start();
		}
	});
	
	return DashboardViewRoute;
	
});