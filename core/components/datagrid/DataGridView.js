define([
        'AppView',
        'text!./DataGrid.html',
        'text!./DataGridRow.html',
        'text!./DataGridFooter.html'
        ],
function(
		AppView,
		template,
		gridRow,
		gridFooter
) {
	
	var events = [];
	events['click .sortable'] = 'eventSortDataGrid';
	events['click .paginate-next'] = 'eventPaginateNext';
	events['click .paginate-prev'] = 'eventPaginatePrev';
	events['click .paginationNumberDiv'] = 'eventPaginationNumberClicked';
	
	var DataGridView = AppView.extend({
		
		setData: function (data) {
			this.componentData = data;
			var gridData = this.componentData.gridData;
			this.categories = this.componentData.categories;
			this.gridDataLength = gridData.length;
			this.currentPageNumber = 1;
			this.startIndex = 1;
			this.pageRows = this.componentData.pageRows;
			if (this.pageRows == undefined || this.pageRows == null || this.pageRows == '') {
				this.pageRows = 0;
				this.numberOfPagesToPaginate = 1;
				this.endIndex = gridData.length;
			} else {
				if (this.gridDataLength == this.pageRows) {
					this.numberOfPagesToPaginate = 1;
				} else {
					this.numberOfPagesToPaginate = parseInt(gridData.length/this.pageRows) + 1;
				}
				
				this.endIndex = (this.pageRows > gridData.length)? gridData.length : this.pageRows;
			}
			this.setPaginationData();
			this.footerStartPageNumber = 1;
			this.footerEndPageNumber = (this.numberOfPagesToPaginate < 5)?this.numberOfPagesToPaginate:5;
		},
		
		setPaginationData : function () {
			var gridData = this.componentData.gridData;
			var rowData = this.componentData.rowData || this.componentData.gridData;
			this.paginatedData = [];
			for (var i=this.startIndex; i <= this.endIndex; i ++) {
				var dataPoint = {};
				dataPoint.grid = gridData[i-1];
				dataPoint.data = rowData[i-1];
				this.paginatedData.push(dataPoint);
			}
		},
		
		start : function() {
			this.delegateEvents(events);
			this.setReady(true);
		},
		
		render : function() {
			this.applyTemplate(template);
			this.sectionTag = $(this.el)[0].children[0];
			this.displayGrid(this.componentData);
			this.initEvent(this.componentData);
		},
		
		initEvent : function(componentData) {
			if (componentData.clickHandler) {
				var self = this;
				this.$el.click({viewRef: self}, function(ev) {
					var $tr = $(ev.target).closest('tr');
					var $td = $(ev.target).closest('td');
					var rowIndex = self.$("tbody tr").index($tr);
					var colIndex = $("td", $tr).index($td);
					if (rowIndex >= 0 && colIndex >= 0) {
						componentData.clickHandler(ev, rowIndex, colIndex);
					}
				});
			}
		},
		
		getRowData : function(rowIndex) {
			return this.paginatedData[rowIndex].data;
		},
		
		getGridData : function(rowIndex) {
			return this.paginatedData[rowIndex].grid;
		},
		
		getCellData : function(rowIndex, colIndex) {
			var obj = this.getGridData(rowIndex);
			var curIndex = 0;
			for (var key in obj) {
				if (curIndex == colIndex) {
					return obj[key];
				}
		        curIndex++;
			};
		},

		displayGrid: function(componentData) {
			var paginated = this.paginatedData,
				categories = componentData.categories,
				j;
			
			this.catLength = categories.length;
			this.cellWidth = 100/this.catLength;

			// Create grid header
			var dataKeys = [];
			if (paginated[0]) {
				for(var key in paginated[0].grid) {
					dataKeys.push(key);
				}
			}
			
			var gridHeader = document.createElement('thead');
			$(this.sectionTag).append(gridHeader);
			var headerRow = document.createElement('tr');
			$(gridHeader).append(headerRow);
			$(gridHeader).addClass('grid-header');
			
			for (j = 0; j < this.catLength; j++) {
				var headerColumn = document.createElement('td');
				$(headerColumn).addClass("grid-header-cell");
				$(headerColumn).addClass("grid-col-"+categories[j].category.replace(" ",""));
				
				$(headerColumn).css("width", Math.round(this.cellWidth)+"%");
				$(headerColumn).html("<div class='grid-header-cell-label' >"+categories[j].category+"</div>");
				if (categories[j].sortable != undefined && categories[j].sortable == true) {
					$(headerColumn).addClass("sortable");	
					var sortableImgDiv = $('<div class="sortableImgDiv"></div>');
					$(headerColumn).append(sortableImgDiv);
				}
				
				if (dataKeys[j] != undefined) {
					$(headerColumn).data("key", dataKeys[j]);		
				}
				$(headerRow).append(headerColumn);
			}
			
			// Create rows
			var gridBody = document.createElement('tbody');
			$(this.sectionTag).append(gridBody);
			this.renderRows(paginated);
			
			// Create grid footer
			var gridFooter = document.createElement('tfoot');
			$(this.sectionTag).append(gridFooter);
			this.renderFooter();
			
		},
		
		eventSortDataGrid : function (event) {
			this.toggleSort(event);
		},
		
		toggleSort : function (event) {
			var currentTarget = event.currentTarget;
			var order = $(currentTarget).data("sortOrder");

			if (order == undefined || order == null) {
				order = 0;
			} else if (order == 0) {
				order = 1;
			} else if (order == 1) {
				order = 0;
			}

			this.sortDataGrid(event, order);
		},
		
		sortDataGrid : function (event, order) {
			var currentTarget = event.currentTarget;
			var key = $(currentTarget).data("key");
			$(currentTarget).data("sortOrder", order);

			// Perform sorting 
			this.paginatedData = this.sortBy(this.paginatedData, key, order);
			
			// Re-render rows with new data
			this.renderRows(this.paginatedData);

		},
		
		eventPaginateNext : function () {
			
			if (this.gridDataLength <= this.endIndex) {
				return;
			}
			if (this.currentPageNumber % 5 == 0) {
				this.footerStartPageNumber = this.footerStartPageNumber + 5;
				this.footerEndPageNumber = this.footerEndPageNumber + 5;
			}
			this.currentPageNumber = this.currentPageNumber + 1 ;
			
			this.startIndex = this.endIndex + 1 ;
			var endIndex = this.pageRows * this.currentPageNumber;
			this.endIndex = (endIndex >= this.gridDataLength)?this.gridDataLength:endIndex;
			
			this.setPaginationData();
			
			// Re-render rows with new data
			this.renderRows(this.paginatedData);
			
			this.renderFooter();
			
		},
		
		eventPaginatePrev : function () {
			if (this.currentPageNumber == 1) {
				return;
			}
			this.currentPageNumber = this.currentPageNumber - 1 ;
			if (this.currentPageNumber % 5 == 0) {
				this.footerStartPageNumber = this.footerStartPageNumber - 5;
				this.footerEndPageNumber = this.footerEndPageNumber - 5;
			}

			this.endIndex = this.startIndex - 1;
			var startIndex = this.pageRows * (this.currentPageNumber - 1) + 1;
			this.startIndex = (startIndex == 0)?1:startIndex;
			
			this.setPaginationData();
			
			// Re-render rows with new data
			this.renderRows(this.paginatedData);
			
			this.renderFooter();
			
		},
		
		eventPaginationNumberClicked : function (event) {
			var currentTarget = event.currentTarget;
			this.currentPageNumber = parseInt($(currentTarget).html());
			
			this.startIndex = (this.pageRows * (this.currentPageNumber - 1)) + 1 ;
			var endIndex = this.pageRows * this.currentPageNumber;
			this.endIndex = (endIndex >= this.gridDataLength)?this.gridDataLength:endIndex;
			
			this.setPaginationData();
			
			// Re-render rows with new data
			this.renderRows(this.paginatedData);
			
			this.renderFooter();
			
		},
		
		renderRows : function (data) {
			
			// Render the grid data rows
			var container = $(this.sectionTag).find("tbody");
			
			// Delete existing rows.
			container.html("");
			
			// Create new rows
			for (var i = 0; i < data.length; i++) {
				var newGridRow = _.template(gridRow, {"row": data[i].grid, "cellWidth": Math.round(this.cellWidth), "categories":this.categories});
				container.append(newGridRow);
			}
		},
		
		renderFooter : function () {
			
			// Render the grid footer
			var container = $(this.sectionTag).find("tfoot");
			
			// Delete existing footer.
			container.html("");
			
			var footerEndPageNumber = (this.numberOfPagesToPaginate < this.footerEndPageNumber)?this.numberOfPagesToPaginate:this.footerEndPageNumber;
			
			var newGridFooter = _.template(gridFooter, { 
				"catLength": this.catLength, 
				"startIndex": this.startIndex,
				"endIndex" : this.endIndex,
				"gridDataLength": this.gridDataLength,
				"startPageNumber": this.footerStartPageNumber - 1,
				"endPageNumber" : footerEndPageNumber,
				"numberOfPages" : this.numberOfPagesToPaginate,
				"currentPageNumber" : this.currentPageNumber
				});
			container.append(newGridFooter);
		},
		
		/**
		 * Sort an array of object, based on the objects key.
		 * "order" = 1 will result in reverse sorting.
		 * @param list
		 * @param key
		 * @param order (Order of sorting increasing/decreasing)
		 * @returns
		 */
		sortBy : function(list, key, order){
			var sortedList = _(list).sortBy(function(obj) { return obj.grid[key]; });
			
			if  (order == 1) {
				return sortedList.reverse();
			} else {
				return sortedList;
			}
		}
		
	});
	
	return DataGridView;
	
});
