define([
        'jquery','underscore',
        './ServicesInit'
        ], 
function(
		$,_,
		init
		) {
	
	// Initialize services data; including appData, commonGet..
	var iks = _.keys(init);
	for (var i=0; i<iks.length; i++) {
		eval('var '+iks[i]+' = init.'+iks[i]+';');
	}
	
	var ServicesManager = {
			
		// each route happens, app data is saved in session. 
		saveAppData : function() {
			if(typeof(Storage) !== "undefined") {
				// sessionStorage.setObject('appData', appData);
				sessionStorage.setItem('appData', JSON.stringify(appData));
			}
		},
		
		getAppData : function() {
			return appData;
		}
	};
	
	return ServicesManager;
});