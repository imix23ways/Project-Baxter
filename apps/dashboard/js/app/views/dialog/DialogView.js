define(['AppView'], 
		
function(AppView) {
	
	var DialogView = AppView.extend({
	
		el: '#dialog-box',
		
		events : {
			
			'click #dialog-ok' : "okClicked",
			
			'click #dialog-yes' : "yesClicked",
			
			'click #dialog-no' : "noClicked"
			
		},
		
		show: function() {
			
			this.$el.show();
			
		},
		
		setMessage: function(message) {
			
			this.$('.dialog-box-message').html(message);
			this.setWidth(500);
			
		},
		
		setWidth: function(width) {
			this.$('.dialog-box-content').css('width', width);
		},
		
		makeOK: function() {
			this.$('.dialog-box-control-yes-no').hide();
			this.$('.dialog-box-control-ok').show();
		},
		
		makeYesNo: function() {
			this.$('.dialog-box-control-yes-no').show();
			this.$('.dialog-box-control-ok').hide();
		},
		
		okClicked: function() {
			
			this.trigger('dialog-click', 'ok');
			this.$el.hide();
			
		},
		
		yesClicked: function() {
			
			this.trigger('dialog-click', 'yes');
			this.$el.hide();
			
		},
		
		noClicked: function() {
			
			this.trigger('dialog-click', 'no');
			this.$el.hide();
			
		}
		
	});
	
	var dialogView = new DialogView();
	
	return dialogView;
	
});
