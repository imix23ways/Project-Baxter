define([
        'AppView',
        'text!./Checklist.html',
        'text!./ChecklistItem.html'
        ],
function(
		AppView,
		template,
		checklistItem
) {
	
	var ChecklistView = AppView.extend({
		
		start : function() {
			this.setReady(true);
		},
		
		render : function() {
			this.applyTemplate(template);
			this.sectionTag = $(this.el)[0].children[0];
			this.displayChecklist(this.checklistData);
		},

		setData: function (data) {
			this.checklistData = data;
		},

		getValues: function () {
			console.log('checklist values');
		},

		displayChecklist: function(checklistData) {
			var checklist = checklistData.checklist,
				checklistDataLength = checklist.length,
				checklistName = checklistData.checklistName,
				i;

			// Create title header
			var headerDiv = document.createElement('div');
			$(headerDiv).html(checklistData.listTitle);
			$(headerDiv).addClass('checklist-header');
			$(this.sectionTag).append(headerDiv);

			// Create info text
			var infoDiv = document.createElement('div');
			$(infoDiv).html(checklistData.listDescription);
			$(infoDiv).addClass('checklist-info');
			$(this.sectionTag).append(infoDiv);

			for (i = 0; i < checklistDataLength; i++) {
				checklist[i].itemNumber = i;
				checklist[i].checklistName = checklistName;
				var newChecklistItem = _.template(checklistItem, checklist[i]);
				$(this.sectionTag).append(newChecklistItem);
			}
		}
		
	});
	
	return ChecklistView;
	
});
