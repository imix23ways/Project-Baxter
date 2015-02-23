define([
        'AppView',
        'text!./ProgressBar.html',
        ],
function(
		AppView,
		template
) {
	
	
	var ProgressBarView = AppView.extend({
		
		start : function() {
			this.setReady(true);
		},
		
		render : function() {
			var self = this;
			this.applyTemplate(template);
			this.sectionTag = $(this.el)[0].children[0];
			this.displayProgressBar(this.progressBarData);
		},

		setData: function (data) {
			var self = this;
			self.progressBarData = data;
			
		},
		
		validateData: function(data) {
			var self = this;
			if (data.label == undefined) {
				self.label = "";
			} else {
				self.label = data.label;
			}
				
			if (data.value == undefined) {
				console.error("Value is undefined");
				return false;
			}
			if (isNaN(data.value) || data.value < 0 || data.value > 100) {
				console.error("Value is invalid");
				return false;
			}
			self.value = parseInt(data.value);
			
			if (data.percentageText == undefined) {
				self.percentageText = self.value + "%";
			} else {
				self.percentageText = data.percentageText;
			}
			
			if (data.alignLabel == undefined || data.alignLabel == '') {
				self.alignLabel = "left";
			} else if (jQuery.inArray(data.alignLabel, ["left", "right", "top", "bottom"]) == -1) {
				console.error("AlignLabel is invalid");
				return false;
			}
			self.alignLabel = data.alignLabel;
						
			return true;
		},

		displayProgressBar: function (data) {
			var self = this;
			self.container = $(self.sectionTag).find(".progressBar-container");
			self.labelContainer = self.container.find(".label-container");
			self.barContainer = self.container.find(".bar-container");
			
			if (!self.validateData(data)) {
				$(this.el).hide();
				return;
			}
			
			if (data.width != undefined && data.width != '') {
				self.container.width(data.width+"px");
			}
			if (data.height != undefined && data.height != '') {
				self.container.height(data.height+"px");
			}
			self.container.find(".label-text").html(self.label);
			if (data.labelSize != undefined && data.labelSize != '') {
				self.container.find(".label-text").css("font-size", data.labelSize+"px");
			}
			self.container.find(".percentage-text").find("div").html(self.percentageText);
			if (data.percentageTextSize != undefined && data.percentageTextSize != '') {
				self.container.find(".percentage-text").css("font-size", data.percentageTextSize+"px");
			}
			self.container.find(".filled-bar").css("width", self.value+"%");
			self.container.find(".empty-bar").css("width", 100 - self.value+"%");
			
			if (self.label == "") {
				self.labelContainer.hide();
				self.barContainer.css("width", "96%");
			} 
			
			if (self.alignLabel == "right") {
				self.labelContainer.css("float", "right");
				self.barContainer.css("float", "left");
			} else if (self.alignLabel == "top") {
				self.barContainer.width("96%");
				
				if (self.label != "") {
					self.labelContainer.width("100%");
					self.container.find(".empty").first().hide();	
					self.barContainer.height("40%");
					self.labelContainer.height("45%");
					self.container.height(self.container.height() * 1.4+"px");
				}
			} else if (self.alignLabel == "bottom") {
				self.barContainer.width("96%");
				if (self.label != "") {
					self.container.height(self.container.height() * 1.4+"px");
					self.barContainer.height("35%");
					self.labelContainer.height("45%");
					
					self.labelContainer.width("100%");
					self.labelContainer.css("position", "absolute");
					self.labelContainer.css("top", "50%");
					self.container.find(".empty").last().hide();
					self.container.find(".empty").first().height("15%");
				}
			}
			
			if (data.bgColor != undefined || data.bgColor != '') {
				self.container.css("background-color", data.bgColor);
			}
			if (data.barColor != undefined || data.barColor != '') {
				self.container.find(".filled-bar").css("background-color", data.barColor);
			}
			if (data.barBgColor != undefined || data.barBgColor != '') {
				self.container.find(".empty-bar").css("background-color", data.barBgColor);
			}
			if (data.labelColor != undefined || data.labelColor != '') {
				self.container.find(".label-text").css("color", data.labelColor);
			}
			if (data.percentageTextColor!= undefined || data.percentageTextColor != '') {
				self.container.find(".percentage-text").css("color", data.percentageTextColor);
			}
		}
		
	});
	
	return ProgressBarView;
	
});
