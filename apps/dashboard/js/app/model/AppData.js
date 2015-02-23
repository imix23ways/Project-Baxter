define([
        'AppModel'
        ],
function(
		AppModel
		){
	
	/*
	 * AppData provides a common place for holding application data
	 */
	var AppData = AppModel.extend({
		
		defaults : {
			userId : undefined,
			browser : undefined
		}
	});
	return AppData;
});