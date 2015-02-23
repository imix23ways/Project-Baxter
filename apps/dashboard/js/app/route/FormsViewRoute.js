define([
        'AppModel',
        'views/forms/FormsView'
        ],
function(
		AppModel,
		FormsView
		){
	
	var FromsViewRoute = AppModel.extend({
		renderRoute : function(frameView, appNav) {
			var formsView = new FormsView();
			formsView.setModel(frameView.model);
			frameView.renderMainContent(formsView);
			appNav.start();
		}	
	});
	
	return FromsViewRoute;
	
});