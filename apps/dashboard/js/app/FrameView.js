define(
	['AppView'
	],
function(
	AppView
	) {
	
	// This is the main body tag view
	var FrameView = AppView.extend({

		appNavView: null,

		// this is <div id="main-content">
		currentContentView : null,
		
		// render <div id="main-content">
		renderMainContent : function(contentView) {
			this.currentContentView = contentView;				
			this.setReady(true);		
		},
		
		render: function() {
			this.replaceDescendant('main-content', {selector: '#main-content', view: this.currentContentView});
		},

		setAppNavView: function(anView) {
			this.appNavView = anView;
		}
		
	});
	
	return FrameView;
		
});
	