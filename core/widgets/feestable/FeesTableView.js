define([
        'AppView',
        'text!./FeesTable.html',
        '../../components/datagrid/DataGridView'
        ],
function(
		AppView,
		template,
		dataGrid
) {
	
	var events = [];
	events['change .timeFrameSelect'] = 'onChangeTimeFrame';
	
	var feesTableView = AppView.extend({
		
		setData: function (data) {
			this.feesTableData = data;
			this.categories = data.categories;
			this.clickHandler = data.clickHandler;
			this.pageRows = data.pageRows;
			this.label = data.label;
			this.timeFrame = data.timeFrame;
			this.paginate = data.paginate;
		},
		
		start : function() {
			this.delegateEvents(events);
			this.setReady(true);
		},
		
		render : function() {
			this.applyTemplate(template);
			this.sectionTag = $(this.el)[0];
			this.displayFeesTable();
		},
		
		validateData: function() {
			var self = this;
			if (self.timeFrame == undefined || self.timeFrame.length <= 0) {
				console.error("TimeFrame is undefined");
				return false;
			}
			if (self.categories == undefined || self.categories.length <= 0) {
				console.error("Categories is undefined");
				return false;
			}
			if (self.paginate == undefined) {
				self.paginate = true;
			}
			return true;
		},
		
		validateTimeFrameData: function(timeFrame) {
			var self = this;
			if (timeFrame.name == undefined || timeFrame.name == '') {
				console.error("Name is mandatory for timeFrame");
				return false;
			}
			if (timeFrame.value == undefined || timeFrame.value == '') {
				console.error("Value is mandatory for timeFrame");
				return false;
			}
			if (timeFrame.gridData == undefined) {
				console.error("GridData is mandatory for timeFrame");
				return false;
			}
			return true;
		},
		
		displayFeesTable : function () {
			var self = this;
			self.mainContainer = $(self.sectionTag).find(".feesTableContainer");
			self.dropdown = $(self.mainContainer).find(".timeFrameDropdown");
			
			if (!self.validateData()) {
				$(this.el).hide();
				return;
			}
			
			// Disable pagination
			if (self.paginate == false) {
				self.pageRows = 0;
			}
			
			self.tableData = {
					"categories": self.categories,
					"clickHandler": self.clickHandler,
					"pageRows": self.pageRows
			};
			
			var options = [];
			self.timeFrameDataMap = {};
			
			for (i=0; i<self.timeFrame.length; i++) {
				var timeFrame = self.timeFrame[i];
				if (!self.validateTimeFrameData(timeFrame)) {
					$(this.el).hide();
					return;
				}
				var option = {
						"name": timeFrame.name,
						"value": timeFrame.value
						};
				options.push(option);
				self.timeFrameDataMap[timeFrame.value] = timeFrame.gridData;
			}
			
			if (options.length != undefined && options.length > 0) {
				var select = document.createElement("select");
				$(select).addClass("timeFrameSelect");
				for(j = 0; j < options.length; j++) {
					var newOption = document.createElement("option");
					$(newOption).html(options[j].name);
					$(newOption).attr('value', options[j].value);
					$(select).append(newOption);
				}
				$(self.dropdown).append(select);
			}
			var timeFrameDropDown = $(self.dropdown).find(".timeFrameSelect");
			var selectedTimeFrame = $(timeFrameDropDown).children("option").filter(":selected").val();
			var dataForGrid = self.timeFrameDataMap[selectedTimeFrame];
			
			self.tableData["gridData"] = dataForGrid;
			self.createTable(self.tableData);
			
			var timeFrameLabel = self.mainContainer.find(".timeFrameLabel");
			$(timeFrameLabel).text(self.label);
			
		},
		
		createTable : function (tableData) {
			var self = this;
			var grid = new dataGrid({el:".feesTableDataGrid"});
			grid.setData(tableData);
			this.registerDescendantView(grid);
			grid.start();
			
			// Hide the pagination option.
			if (self.paginate == false) {
				var footer = $(self.mainContainer).find("tfoot");
				$(footer).hide();
			}
		},
		
		deleteTable :  function () {
			var tableContainer = $(self.mainContainer).find(".feesTableDataGrid");
			$(tableContainer).html("");
		},
		
		onChangeTimeFrame : function (event) {
			var self = this;
			self.deleteTable();
			var selectedTimeFrame = $(event.currentTarget).val();
			var dataForGrid = self.timeFrameDataMap[selectedTimeFrame];
			self.tableData["gridData"] = dataForGrid;
			self.createTable(self.tableData);
		}
		
				
	});
	
	return feesTableView;
	
});
