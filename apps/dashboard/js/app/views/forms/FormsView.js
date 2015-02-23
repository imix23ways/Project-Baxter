define([
        'AppView',
        'text!./Forms.html',
        'jqueryui',
        'highcharts',
        'highchartsMore',
        '../../../../../../core/components/advancedForm/AdvancedFormView',
        '../../../../../../core/widgets/goalsummary/GoalSummaryView',
        '../../../../../../core/widgets/datecountdown/DateCountDownView'
        ],
function(
		AppView,
		template,
		jqueryui,
		highcharts,
		highchartsMore,
		advancedform,
		goalsummary,
		dateCountDown
		) {

	var events = {};
	//events['click #btn'] = 'clickHandler';
	
	var GoalsView = AppView.extend({
		
		render : function() {
			this.applyTemplate(template);
			this.delegateEvents(events);
			//this.goalSummary();

			//Placeholders!
			//this.displayTimeToGoalPlaceholder();

			this.displayAdvancedForm();
		},

		goalSummary: function() {
			var goalData = {"goalProgress":92, "goalType":"default", "goalName":""};

			var goalDataLen = goalData.length;
			var i;
			
			var newGoalDiv = document.createElement('div');
				$('#goal_summary').append(newGoalDiv);

				var goalSum = new goalsummary({el:newGoalDiv});
				goalSum.setData(goalData);
				this.registerDescendantView(goalSum);
				goalSum.start();

		},

		displayGoalAmountPlaceholder: function() {
			var amount_fp = new amountfp({el:"#goal_amount"});
			amount_fp.setData({"presentAmount":"456143.56", "futureAmount":"987234.45"});
			this.registerDescendantView(amount_fp);
			amount_fp.start();
		},

		displayTimeToGoalPlaceholder: function() {
			var dateCountDownWidgetTest = new dateCountDown({el:"#time_to_goal"});
			dateCountDownWidgetTest.setData( {"defaultDate": {"month": 6,"year" : 2030}} );
			this.registerDescendantView(dateCountDownWidgetTest);
			dateCountDownWidgetTest.start();
		},

		displayAdvancedForm: function () {
			var advancedFormTest = new advancedform({el:"#advancedform"});
			advancedFormTest.setData(this.getAdvancedFormData());
			this.registerDescendantView(advancedFormTest);
			advancedFormTest.start();
		},
		
		getAdvancedFormData: function () {
			// mock JSON for AdvancedForm test
			var advancedFormData = {"form": [
											
										{"formItem":"firm_name", "label": "Firm Name", "formElement": "input", "required": true, "helpText": "This is a sample help text for Firm Name."},
										{"formItem":"email", "label": "Email", "formElement": "input", "required": false, "helpText": "This is a sample help text for Email"},
										{"formItem":"address", "label": "Address", "formElement": "input", "required": true},
										{"formItem":"Date", "label": "Date", "formElement": "date", "required": false},
										{"formItem":"state", "label": "State", "formElement": "select",
											"options": [
												{"option":"AL"},
												{"option":"AK"},
												{"option":"CA"},
												{"option":"CN"},
												{"option":"TN", "isSelected": true},
												{"option":"OK"},
												{"option":"ZZ"}
										]},
										{"formItem":"Gender", "label": "Gender", "formElement": "radio",
											"options": [
												{"optionValue":"male", "optionLabel": "Male", "isSelected": true},
												{"optionValue":"female", "optionLabel": "Female"}
												
										]},
										{"formItem":"risk", "label": "Select Risk", "formElement": "checkbox",
											"options": [
												{"optionValue":"moderate", "optionLabel": "Moderate", "isSelected": true},
												{"optionValue":"aggressive", "optionLabel": "Aggressive"},
												{"optionValue":"high-aggressive", "optionLabel": "Highly Aggressive", "isSelected": true}
												
										]},
										{"formItem":"Color Picker", "label": "Select Color", "formElement": "color", "value": "9CFFAC" },
										{"formItem":"Color Picker2", "label": "Select Color2", "formElement": "color", "value": "9CDEFF"},
										{"formItem":"testSlider", "label": "Test Slider", "formElement": "slider", "required": false, "width": 200, "value": 50, "minValue":-20, "maxValue":1000},
										{"formItem":"testSlider2", "label": "How much will you save for this gaol each month?", "formElement": "slider", "width": 300, "value": 60, "minValue":50, "maxValue":100},
										{"formItem":"Save_and_create_button", "label": "Save & Create Firm", "formElement": "button", "clickHandler": this.onSaveClick},
										{"formItem":"Edit_button", "label": "Edit", "formElement": "button", "clickHandler": this.onSaveClick},
										{"formItem":"Create_button", "label": "Create Firm", "formElement": "button", "clickHandler": this.onSaveClick},
										{"formItem":"Delete_button", "label": "Delete Firm", "formElement": "button", "clickHandler": this.onDeleteClick}
									],
								"formDescription" : "Create or Edit Firm information here. All Firms must be created<br>under an Enterprise and permissions must be set."
							};
			return advancedFormData;
		}

	});
	
	return GoalsView;
		
});