define([
        'AppView',
        'text!./Settings.html',
        'jqueryui',
        '../../../../../../core/components/datagrid/DataGridView'
        ],
function(
		AppView,
		template,
		jqueryui,
		datagrid
		){

	var events = {};
	//events['click #btn'] = 'clickHandler';
	
	var AccountsView = AppView.extend({
		
		render : function() {
			this.applyTemplate(template);
			this.delegateEvents(events);
			this.displayHoldingsDatagrid();
		},

		displayHoldingsDatagrid: function () {
			var holdings = new datagrid({el:"#holdings_table"});
			holdings.setData(this.getHoldingsData());
			this.registerDescendantView(holdings);
			holdings.start();
		},
		getHoldingsData: function () {
			var tableData = {"categories": [
									{"category": "Asset Class", "sortable": true},
									{"category": "ETF", "sortable": true},
									{"category": "%", "sortable": true},
									{"category": "$", "sortable": true}
							],
							"gridData": [
									{"c1":"US Bonds", "c2": "SCHZ", "c3": "12.0%", "c4":"$15,245"},
									{"c1":"Short-Term Treasury", "c2": "SCHO", "c3": "9.0%", "c4":"$9,275"},
									{"c1":"US Equities", "c2": "SCHB", "c3": "32.0%", "c4":"$5,785"},
									{"c1":"International Equities", "c2": "SCHF", "c3": "12.0%", "c4":"$6,245"},
									{"c1":"Emerging Markets", "c2": "SCHE", "c3": "6.0%", "c4":"$2,245"},
									{"c1":"Real Estate", "c2": "SCHH", "c3": "7.0%", "c4":"$245"}
							],
							"paginate": false,
							"pageRows" : 0
							};
			return tableData;
		}

	});
	
	return AccountsView;
		
});