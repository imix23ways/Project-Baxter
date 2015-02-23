define(["underscore","jquery"],function(_,$) {
	
	var RouteCSSManager = {
			
		registeredCSS : [],
		
		registerRouteCSS : function(cssid, urlPath) {
			if (_.contains(this.registeredCSS,cssid)) {
				alert('css id is already registered. please choose another one: ' + cssid);
			} else {
				$('head').append('<link href="'+urlPath+'?'+require.asi_app_version+'" rel="stylesheet" id="'+cssid+'" />');
				this.registeredCSS.push(cssid);
			}
		},
		
		enableRouteCSS : function(cssid) {
			if (!_.contains(this.registeredCSS,cssid)) {
				alert('css id has not been registered: ' + cssid);
			} else {
				_.each(this.registeredCSS, function(id) {
					if(id!=cssid) {
						$('link#'+id).get(0).disabled = true;
					}
				});
				$('link#'+cssid).get(0).disabled = false;
			}
		}

	};
	
	return RouteCSSManager;	
	
});