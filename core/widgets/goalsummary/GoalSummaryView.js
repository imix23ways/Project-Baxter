define([
        'AppView',
        'text!./GoalSummary.html',
        'progressbar'
        ],
function(
		AppView,
		template,
		ProgressBar
) {
	
	var events = [];
	events['click .progress-ring'] = 'onclick';
	
	var GoalSummaryView = AppView.extend({
		
		start : function() {
			this.delegateEvents(events);
			this.setReady(true);
		},
		
		render : function() {
			var self= this;
			this.applyTemplate(template);

			this.progressRing = $(this.el)[0].children[0];
			this.goalLabel = $(this.el)[0].children[1];

			// Set values for ring color  ** Colors need to be pulled from highcharts theme definition **
			this.alertColor = '#e09027';
			this.defaultColor = '#5bbe90'

			// display the widget
			this.displayGoalSummary(this.goalData);
		},

		setData: function (data) {
			this.goalData = data;
		},

		displayGoalSummary: function (data) {
			var trailColor, progressAmount, circle;

			// Insert name of goal to label
			$(this.goalLabel).html(data.goalName);

			// Apply color based on goal type
			if (data.goalType == "alert") {
				trailColor = this.alertColor;
			} else {
				trailColor = this.defaultColor;
			}
			

			// Format progress value for progressbar.js
			progressAmount = data.goalProgress/100;

			// Create new Circle progressbar and inject values
			circle = new ProgressBar.Circle(this.progressRing, {
			    color: trailColor,
			    strokeWidth: 20,
			    trailWidth: 20,
			    trailColor: '#e3e1de',
			    duration: 1200,
			    easing: "easeOut",
			    text: {
			        value: '0%'
			    },
			    step: function(state, bar) {
			        bar.setText((bar.value() * 100).toFixed(0) + '%');
			    }
			});

			// Start the progress animation
			circle.animate(progressAmount, function() {
			    //console.log('Animation complete event: GoalSummary rendered');
			});
		},

		onclick: function () {
			window.location = '#goals';
		}
	});
	
	return GoalSummaryView;
	
});