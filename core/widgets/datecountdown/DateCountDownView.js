define([
        'AppView',
        'text!./DateCountDown.html',
        'countdown'
        ],
function(
		AppView,
		template,
		countdown
) {
	
	var events = [];
	events['click .OK-button'] = 'onClickOk';
	events['click .countDown-container'] = 'onClickCountDown';
	events['change .date-year input'] = 'onChangeYear';
	events['keypress .date-year input'] = 'onkeyPressYearInput';
	events['keyup .date-year input'] = 'onkeyupYearInput';
	
	var dateCountDownView = AppView.extend({
		
		setData: function (data) {
			this.data = data;
			this.defaultDate = data.defaultDate;
		},
		
		start : function() {
			this.delegateEvents(events);
			this.setReady(true);
		},
		
		render : function() {
			this.applyTemplate(template);
			this.sectionTag = $(this.el)[0];
			this.displayDateCountDown();
			
		},
		
		validateData: function() {
			var self = this;
			if (self.defaultDate == undefined) {
				console.error("DefaultDate is undefined");
				return false;
			}
			if (self.defaultDate.month == undefined) {
				console.error("DefaultDate.month is undefined");
				return false;
			}
			if (self.defaultDate.year == undefined) {
				console.error("DefaultDate.year is undefined");
				return false;
			}
			if (isNaN(self.defaultDate.month)) {
				console.error("DefaultDate.month is invalid");
				return false;
			}
			if (isNaN(self.defaultDate.year)) {
				console.error("DefaultDate.year is invalid");
				return false;
			}
			var currentTime = new Date();
			self.currentMonth = currentTime.getMonth();
			self.currentYear = currentTime.getFullYear();
			
			if (self.defaultDate.month < 1 || self.defaultDate.month > 12) {
				console.error("DefaultDate.month is invalid, should be between 1-12");
				return false;
			}
			
			if (self.currentYear > self.defaultDate.year) {
				console.error("DefaultDate.year is invalid, should be greater than or equal to current year");
				return false;
			}
			
			if  (self.currentYear == self.defaultDate.year) {
				if (self.currentMonth > self.defaultDate.month -1) {
					console.error("DefaultDate.month is invalid, should be greater than current month of the year");
					return false;
				}
				
				// Validation for last month of current year
				if (self.currentMonth == 11 && self.defaultDate.month == 12) {
					console.error("DefaultDate is invalid, should be greater than current month of the year");
					return false;
				}	

			}
			
			return true;
		},
		
		displayDateCountDown : function () {
			var self = this;
			self.mainContainer = $(self.sectionTag).find(".dateCountDown-container");
			self.countDownContainer = self.mainContainer.find(".countDown-container");
			self.dateContainer = self.mainContainer.find(".date-container");
			self.options = $(self.dateContainer).find(".date-month option");
			$(self.dateContainer).hide();
			
			if (!self.validateData()) {
				$(this.el).hide();
				return;
			}
			
			// Set default date
			self.yearInput = $(self.dateContainer).find(".date-year input");
			$(self.yearInput).val(self.defaultDate.year);
			$($(self.dateContainer).find(".date-month option")[self.defaultDate.month - 1]).attr("selected","true");
			
			
			// Validate month drop down as per date
			var options = $(self.dateContainer).find(".date-month option");
			if (self.currentYear >= self.defaultDate.year) {
				$(self.yearInput).val(self.currentYear);
				
				for (var i=0; i<=self.currentMonth; i++) {
					options[i].disabled = true;
				}
				
				if  (self.currentMonth >= self.defaultDate.month -1) {
					options[self.currentMonth + 1].selected=true;
				} else {
					options[self.defaultDate.month - 1].selected=true;	
				}
			} 
			
			var yearValue = $(self.yearInput).val();
			var monthValue = $(self.dateContainer).find(".date-month")[0].selectedIndex;
			
			var countdownString = self.createCountDownString(yearValue, monthValue);
			$(self.countDownContainer).find("span").html(countdownString);
			
			
		},
		
		onClickCountDown : function (event) {
			var self = this;
			$(self.countDownContainer).hide();
			$(self.dateContainer).show();
		},

		onClickOk : function (event) {
			var self = this;
			
			var year = $(self.yearInput).val();
			var monthValue = $(self.dateContainer).find(".date-month")[0].selectedIndex;
			
			var countdownString = self.createCountDownString(year, monthValue);
			$(self.countDownContainer).find("span").html(countdownString);
			
			var errorMessage = $(self.mainContainer).find(".error-message");
			$(errorMessage).hide();
			
			if (self.currentYear > year) {
				$(errorMessage).html("Invalid Input. Year should be greater than or equal to current year");
				$(errorMessage).show();
			} else if (self.currentYear < year){
				$(self.countDownContainer).show();
				$(self.dateContainer).hide();
			} else if (self.currentYear == year){
				if (self.currentMonth == 11) {
					// If last month of this year.
					// User cannot select this year.
					$(errorMessage).html("Invalid Input. Date should be greater than current month of this year");
					$(errorMessage).show();
				} else {
					$(self.countDownContainer).show();
					$(self.dateContainer).hide();
				}
			}
		},
		
		onChangeYear : function(event) {
			var self = this;
			var year = $(event.currentTarget).val();
			self.validateDateOnYearChange(year);
			
		},
		
		onkeyPressYearInput : function (event) { 
			var self = this;
			self.allowNumericInput(event);
		},
		
		onkeyupYearInput : function (event) { 
			var self = this;
			var year = $(event.currentTarget).val();
			if (year.length >= 5){
				year = year.substring(0,4);
				$(event.currentTarget).val(year);
			}
		},
		
		createCountDownString: function (year, month) {
			var countdownString = countdown( new Date(year, month, 1) ,null, null , 2).toString();
			countdownString = countdownString.replace(",", "");
			return countdownString;
		},
		
		validateDateOnYearChange : function (year) {
			var self = this;
			var options = self.options;
			
			// Enable all month options
			for (var i=0; i<12; i++) {
				options[i].disabled = false;
			}

			if (self.currentYear == year) {
		
				// Disable all months
				for (var i=0; i<=self.currentMonth; i++) {
					options[i].disabled = true;
				}
				
				// If last month of this year, then show first month of next year as selected and enable all months
				if (self.currentMonth == 11) {
					//$(self.yearInput).val(self.currentYear+1);
					options[0].selected=true;
					// Enable all months
					for (var i=0; i<12; i++) {
						options[i].disabled = false;
					}
				} else {
					var monthValue = $(self.dateContainer).find(".date-month")[0].selectedIndex;
					if (monthValue <= self.currentMonth) {
						// Show next month selected
						options[self.currentMonth+1].selected=true;						
					}
				}
			}
				
		},
		
		validateYear : function (year) {
			var self = this;
			if (self.currentYear > year) {
				return false;
			} else if (self.currentYear < year){
				return true;
			} 
		},
		
		/**
		 * This function will restrict user to enter only numeric value in the input box.
		 * Should be called on keypress event
		 * @param event
		 */
		allowNumericInput: function (event) {
            if(event.which != 8 && isNaN(String.fromCharCode(event.which))){
            	event.preventDefault();
            }
		}
				
	});
	
	return dateCountDownView;
	
});
