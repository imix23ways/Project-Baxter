define([
        'AppView',
        'text!./Alert.html'
        ],
function(
		AppView,
		template
) {
	
	var events = [];
	//events['click .helpIcon'] = 'onclick';
	
	var AlertView = AppView.extend({
		
		start : function() {
			this.delegateEvents(events);
			this.setReady(true);
		},
		
		render : function() {
			var self= this;
			this.applyTemplate(template);
			this.sectionTag = $(this.el)[0].children[0];
			this.alert_content = $(this.sectionTag)[0].children[0].children[1];
			this.displayAlert(this.alertData.alert);
		},

		setData: function (data) {
			this.alertData = data;
		},

		displayAlert: function (alertText) {
			$(this.alert_content).html(alertText);
		}
	});
	
	return AlertView;
	
});
