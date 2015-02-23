define([
        'AppView',
        'text!./AdvancedForm.html',
        'text!./SimpleInputFieldView.html',
        'text!./ButtonView.html',
        'text!./DropDownView.html',
        'text!./SliderInputFieldView.html',
        'text!./DateInputFieldView.html',
        'text!./RadioButtonView.html',
        'text!./CheckBoxView.html',
        'text!./ColorPickerView.html'
        ],
function(
		AppView,
		template,
		SimpleInputFieldView,
		ButtonView,
		DropDownView,
		SliderInputFieldView,
		DateInputFieldView,
		RadioButtonView,
		CheckBoxView,
		ColorPickerView
) {
	
	var events = [];
	events['click .helpIcon'] = 'onclickHelp';
	events['keypress .sliderValue'] = 'onkeyPressSliderInput';
	events['change .sliderValue'] = 'onChangeSliderInput';
	
	var FormView = AppView.extend({
		
		start : function() {
			this.delegateEvents(events);
			this.setReady(true);
		},
		
		render : function() {
			var self= this;
			this.applyTemplate(template);
			this.sectionTag = $(this.el)[0].children[0];
			this.displayForm(this.formData);
			
			// Setup mouse listener to close help popups
			$(document).mouseup(function (e) {
			    var container = $('.helpTextContainer');
			    if (!container.is(e.target) // if the target of the click isn't the container
			        && container.has(e.target).length === 0) // or a descendant of the container
			    {
			        container.hide();
			    }
			});
			
			$(function() {
				$(".date-picker").datepicker();

				// To add support for CSS3 in IE8
				if (window.PIE) {
					$('.ui-slider-handle').each(function() {
						PIE.attach(this);
					});
					$('.helpIcon').each(function() {
						PIE.attach(this);
					});
				}
				
				$.getScript("../../core/js/vendor/jscolor.js");
			});
		},

		setData: function (data) {
			this.formData = data;
		},
		
		getValues: function () {
			var inputList = $(this.sectionTag).find('input, select, textarea'),
				inputListLength = inputList.length,
				i,
				valuesData = {};

			for (i = 0; i < inputListLength; i++) {
				valuesData[inputList[i].name] = inputList[i].value;
			}

			return valuesData;
		},
		
		setValues: function (values) {
			for (var key in values) {
				this.$('[name="'+key+'"]').val(values[key]);
			};
		},

		displayForm: function (formData) {
			
			var form = formData.form,
				formLength = form.length;
			
			self.container = $(".advance-form-container");
			self.formItems = self.container.find(".advance-form-item-container");
			
			if (formData.formDescription != undefined && formData.formDescription != '') {
				var formDesc = self.container.find('.form-desc');
				formDesc.html(formData.formDescription);	
				formDesc.show();
			}
			
			var sliderCount = 0;
			
			for (var i=0; i< formLength; i++) {
				var formField = form[i];
				
				if (formField == undefined || formField == null) {
					continue;
				}
				
				var label = formField.label;
				if (label == undefined || label == '') {
					label = '';
				}
				var name = formField.formItem;
				if (name == undefined || name == '') {
					name = '';
				}
				var value = formField.value;
				if (value == undefined || value == '') {
					value = '';
				}
				var required = formField.required;
				if (required == undefined || required == '') {
					required = false;
				}
				
				if (formField.formElement == 'input') {
					var simpleInputFieldView =  _.template(SimpleInputFieldView, {"label": label, "value": value, "type":"input", "required":required});
					self.formItems.append(simpleInputFieldView);
				} else if (formField.formElement == 'button') {
					var buttonView =  _.template(ButtonView, {"value": label, "name": name});
					self.formItems.append(buttonView);
					var button = self.container.find(".button-view-container button").last();
					$(button).click({viewRef: this}, formField.clickHandler);
				} else if (formField.formElement == 'select') {
					var dropDownView =  _.template(DropDownView, {"label": label, "name": name, "options":formField.options, "required": required });
					self.formItems.append(dropDownView);
				} else if (formField.formElement == 'slider') {
					var min = formField.minValue;
					var max = formField.maxValue;
					var sliderInputFieldView =  _.template(SliderInputFieldView, {"label": label, "name": name, "value": value, "required": required});
					self.formItems.append(sliderInputFieldView);
					
					// Fix the alignment issue with label and slider
					var labelContainer = self.formItems.find(".label-container").last();
					var label = $(labelContainer).find("label");
					var labelWidth = $(label).width();
					if(labelWidth > 120) {
						labelContainer.css("float", "none");
					}
					
					var sliderContainer = self.formItems.find(".slider-input-container")[sliderCount];
					var slider = $(sliderContainer).find(".slider-bar");
					$(slider).width(formField.width+"px");
					$(slider).data("min", min);
					$(slider).data("max", max);
					$(sliderContainer).find(".slider-bar").slider({
					      orientation: "horizontal",
					      range: "min",
					      min: min,
					      max: max,
					      value: formField.value,
					      slide: function( event, ui ) {
					    	  var target = event.target;
					    	  $(target).parent().parent().find(".sliderValue").val( ui.value );
					      }
					});
					
					sliderCount++;
				} else if (formField.formElement == 'date') {
					var dateInputFieldView =  _.template(DateInputFieldView, {"label": label, "name": name, "value": value, "required": required});
					self.formItems.append(dateInputFieldView);
				} else if (formField.formElement == 'radio') {
					if (formField.options == undefined || formField.options.length == undefined) {
						console.error("Options are mandatory for radio inputs.");
					} else {
						var radioButtonView =  _.template(RadioButtonView, {"label": label, "name": name, "options":formField.options, "required": required });
						self.formItems.append(radioButtonView);						
					}
				} else if (formField.formElement == 'checkbox') {
					if (formField.options == undefined || formField.options.length == undefined) {
						console.error("Options are mandatory for checkbox inputs.");
					} else {
						var checkBoxView =  _.template(CheckBoxView, {"label": label, "name": name, "options":formField.options, "required": required });
						self.formItems.append(checkBoxView);						
					}
				} else if (formField.formElement == 'color') {
					var colorPickerView =  _.template(ColorPickerView, {"label": label, "name": name, "value": value, "required": required });
					self.formItems.append(colorPickerView);						
				}
				var helpText = formField.helpText;
				if (helpText != undefined && helpText != '' && formField.formElement != 'button') {
					var fieldContainer = self.container.find(".advanceFormItem").last();
					this.addHelp(fieldContainer, helpText);
				}
				
			}
			
			var footNote = self.container.find(".required-footnote");
			if (footNote.html() == undefined) {
				self.container.find(".required-footnote-container").hide();
			}
		
		},
		
		onclickHelp : function (event) {
			var icon = $(event.currentTarget);
			var popup = icon.siblings(".helpTextContainer");
			var position = icon.position();
			popup.css("top", position.top +"px");
			popup.css("left", position.left+25+"px");
			
			popup.toggle();
		},
		
		onkeyPressSliderInput : function (event) {
			var self = this;
			self.allowNumericInput(event);
		},
		
		onChangeSliderInput : function (event) {
			var slider = $(event.currentTarget).parent().parent().find(".slider-bar");
			var minValue = $(slider).data("min");
			var maxValue = $(slider).data("max");
			var userValue = $(event.currentTarget).val();
			if (userValue < minValue ){
				userValue = minValue;
				$(event.currentTarget).val(minValue);
			}
			if (userValue > maxValue) {
				userValue = maxValue;
				$(event.currentTarget).val(maxValue);
			}
			$(slider).slider("value", userValue);
		},
		
		addHelp: function (fieldContainer, helpText) {
			var helpIconElement = document.createElement('div');
			$(helpIconElement).addClass("helpIcon");
			$(helpIconElement).text("?");
			$(fieldContainer).append(helpIconElement);
			
			var helpPopup = document.createElement('div');
			$(helpPopup).addClass("helpTextContainer");
			$(helpPopup).text(helpText);
			$(fieldContainer).append(helpPopup);
		},
		
		/**
		 * This function will restrict user to enter only numeric or decimal value in the input box.
		 * Should be called on keypress event
		 * @param event
		 */
		allowNumericInput: function (event) {
	        var isDotAllowed = true;
	       
	        if ($(event.currentTarget).val().indexOf(".") > -1){
	            isDotAllowed = false;
	        }
            if(event.which != 8 && isNaN(String.fromCharCode(event.which))){
                if (String.fromCharCode(event.which) != ".") {  
                	if (String.fromCharCode(event.which) == "-" &&  $(event.currentTarget).val().indexOf("-") == -1){
                        return;
                    }
                    event.preventDefault();
                } else {
                    if (isDotAllowed == false) {
                        event.preventDefault();
                    } else {
                        isDotAllowed = false;
                    }
                }
            }
		}
		
	});
	
	return FormView;
	
});
