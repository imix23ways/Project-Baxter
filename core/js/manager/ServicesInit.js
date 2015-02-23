define([
        'AppData'
        ],
function(
		AppData
) {
	
	var ServiceInit = {
			
		init : function() {

			// A common jquery ajax get to factor out.
			var commonGet = {
					type: 'get',
					dataType: 'json',
					headers:{
						'Accept':'application/json'
					}
				};
			
			// A common jquery ajax post to factor out.
			var commonPost = {
					type: 'post',
					dataType: 'json',
					headers:{
						'Accept':'application/json',
						'Content-Type' : 'application/json; charset=UTF-8'
					}
				};
			
			// A common jquery ajax update to factor out.
			var commonPut = {
					type: 'put',
					dataType: 'json',
					headers:{
						'Accept':'application/json',
						'Content-Type' : 'application/json; charset=UTF-8'
					}
				};
			
			// A common jquery ajax delete to factor out.
			var commonDelete = {
					type: 'delete',
					dataType: 'json',
					headers:{
						'Accept':'application/json'
					}
				};
			
			// A common jquery service that fires serviceDone event.
			var commonService = function(context, ajax, opts) {
				opts = opts || {};
				if (ajax.data) {
					ajax.data = JSON.stringify(ajax.data);
				}
				$.ajax(
					ajax
				).done(function(data) {
					var result = data;
					if (opts.parse) {
						result = opts.parse(data);
					}
					if (opts.parseArray) {
						result = opts.parseArray(data);
						if (result) {
							if (!_.isArray(result)) {
								result = [result];
							}
						} else {
							result = [];
						}
					}
					if (opts.success) {
						opts.success(result);
					} else {
						context.trigger('serviceDone', {success:true,result:result});
					}
				}).fail(function(jqXHR) {
					context.trigger('serviceDone', {success:false,result:jqXHR.responseText});
				});
			};
			
			// When ajax can be skipped
			var commonDone = function(context, result) {
				context.trigger('serviceDone', {success:true,result:result});
			};
			
			var appData = new AppData();
			
			// Restore previously stored data, it is useful to keep session data.
			if(typeof(Storage) !== "undefined") {
				var value = sessionStorage.getItem('appData');
				var cachedAppData = value && JSON.parse(value);
				if (cachedAppData) {
					appData.set(appData.parse(cachedAppData));
				}
			}
			
			return {
				appData : appData,
				commonGet : commonGet,
				commonPost : commonPost,
				commonPut : commonPut,
				commonDelete : commonDelete,
				commonService : commonService,
				commonDone : commonDone,
				urlbase : '/base/',
				apibase : '/apibase/'
			};
			
		}
	
	};
	
	return ServiceInit.init();
	
});