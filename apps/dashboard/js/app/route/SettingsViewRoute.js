define([
        'AppModel',
        'views/settings/SettingsView'
        ],
function(
		AppModel,
		SettingsView
		) {

	var SettingsViewRoute = AppModel.extend({
		renderRoute : function(frameView, appNav) {
			var settingsView = new SettingsView();
			settingsView.setModel(frameView.model);
			frameView.renderMainContent(settingsView);
			appNav.start();
		}
	});
	return SettingsViewRoute;

});