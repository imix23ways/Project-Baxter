define([
        'AppView',
        'text!./Form.html'
        ],
function(
		AppView,
		template
) {
	
	var events = [];
	events['click .helpIcon'] = 'onclickHelp';
	
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
			// To add support for CSS3 in IE8
			$(function() {
				if (window.PIE) {
					$('.helpIcon').each(function() {
						PIE.attach(this);
					});
				}
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
			// supports input, select, textarea, button
			// need to add support for checkbox and radio button groups

			var form = formData.form,
				formLength = form.length,
				requiredFootnote = false,
				i;

			var formDescription = document.createElement('div');
			$(formDescription).html(formData.formDescription);
			$(formDescription).addClass('form-desc');
			$(this.sectionTag).append(formDescription);
			var newFormDiv = document.createElement('div');
			$(newFormDiv).addClass('form-items-container');
			
			for(i = 0; i < formLength; i++) {
				var newFormElement = document.createElement('div');
				$(newFormElement).addClass('form-item');
				var formElem = form[i].formElement;
				var helpText = form[i].helpText;
				var newInputWrapper = document.createElement('div');
				$(newInputWrapper).addClass("inputWrapper");
				var newInput = null;
				if (formElem=='hidden') {
					newInput = document.createElement('input');
				} else {
					newInput = document.createElement(form[i].formElement);
				}

				// Set up the label element
				if(formElem != 'button' && formElem != 'hidden') {
					var newLabel = document.createElement('label');
					var label = form[i].label;
					if (form[i].required == true) {
						label += '<span class="required-footnote">*</span>';
						requiredFootnote = true;
					}
					$(newLabel).html(label);
					$(newLabel).attr('for', form[i].formItem);
					var labelWrapper = document.createElement('div');
					$(labelWrapper).addClass("labelWrapper");
					$(labelWrapper).append(newLabel);
					$(newFormElement).append(labelWrapper);
				}
				
				// Set up the input element
				$(newInput).attr('name', form[i].formItem);

				// Set up input element specific attributes
				if(formElem == 'select') {
					// loop through options and create option tags
					var j,
						options = form[i].options;
						optionsLength = options.length;
					for(j = 0; j < optionsLength; j++) {
						var newOption = document.createElement("option");
						$(newOption).html(options[j].option);
						$(newOption).attr('value', options[j].option);
						$(newInput).append(newOption);
					}
				} else if(formElem == 'input') {
					$(newInput).attr('type', 'text');
				} else if(formElem == 'button') {
					$(newFormElement).addClass('form-item-button');
					$(newFormElement).removeClass('form-item');
					$(newInput).html(form[i].label);
					$(newInput).click({viewRef: this}, form[i].clickHandler);
				} else if(formElem == 'hidden') {
					$(newInput).attr('type', 'hidden');
				}

				// Append the elements to the form
				$(newInputWrapper).append(newInput);
				$(newFormElement).append(newInputWrapper);
				
				if (helpText != undefined && helpText != '' && formElem != 'button') {
					var helpIconElement = document.createElement('div');
					$(helpIconElement).addClass("helpIcon");
					$(helpIconElement).text("?");
					$(newFormElement).append(helpIconElement);
					
					var helpPopup = document.createElement('div');
					$(helpPopup).addClass("helpTextContainer");
					$(helpPopup).text(helpText);
					$(newFormElement).append(helpPopup);
				}

				$(newFormDiv).append(newFormElement);
			}
			$(this.sectionTag).append(newFormDiv);
			
			// Add footnote in any fields were required
			if (requiredFootnote) {
				var reqNote = "* required fields";
				var reqDiv = document.createElement('div');
				$(reqDiv).html(reqNote);
				$(reqDiv).addClass('required-footnote');
				$(this.sectionTag).append(reqDiv);
			}
			
		},
		
		onclickHelp : function (event) {
			var icon = $(event.currentTarget);
			var popup = icon.siblings(".helpTextContainer");
			var position = icon.position();
			popup.css("top", position.top +"px");
			popup.css("left", position.left+25+"px");
			
			popup.toggle();
		}
	});
	
	return FormView;
	
});
