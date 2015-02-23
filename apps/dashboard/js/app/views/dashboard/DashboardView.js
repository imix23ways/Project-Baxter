define([
        'AppView',
        'text!./Dashboard.html',
        'jqueryui',
        'highcharts',
        'highchartsMore',
        '../../../../../../core/components/datagrid/DataGridView',
        '../../../../../../core/widgets/feestable/FeesTableView',
        '../../../../../../core/widgets/goalsummary/GoalSummaryView'
        ],
function(
		AppView,
		template,
		jqueryui,
		highcharts,
		highchartsMore,
		datagrid,
		feesTable,
		goalsummary
		) {

	var events = {};
	//events['click #tab1-1'] = 'tab1_1clickHandler';

	var PortfolioView = AppView.extend({
		
		render : function() {
			this.applyTemplate(template);
			this.delegateEvents(events);

			// Call function to display menu
			this.goalSummary();
			this.displayFeesTable();
			this.displayLeadersTable();
			this.displayLaggersTable();

			// change test
			//this.listenTo(this.model, 'change', this.changeDetected);
			//this.model.set('testVar', 'value23')
			//console.log(this.model);
		},

		changeDetected: function (ev) {
			console.log('data change');
			console.log(ev);
		},

		goalSummary: function() {
			var goalData = [];
			goalData.push({"goalProgress":92, "goalType":"default", "goalName":"Component Base"});
			goalData.push({"goalProgress":24, "goalType":"alert", "goalName":"Settings Data Model"});
			goalData.push({"goalProgress":56, "goalType":"default", "goalName":"Art Book"});

			var goalDataLen = goalData.length;
			var i;
			
			for (i = 0; i < goalDataLen; i++) {
				var newGoalDiv = document.createElement('div');
				$('#goalsummary').append(newGoalDiv);

				var goalSum = new goalsummary({el:newGoalDiv});
				goalSum.setData(goalData[i]);
				this.registerDescendantView(goalSum);
				goalSum.start();
			}

		},

		displayFeesTable: function () {
			var feesTableWidgetTest = new feesTable({el:"#feestable"});
			feesTableWidgetTest.setData(this.getFeesTableData());
			this.registerDescendantView(feesTableWidgetTest);
			feesTableWidgetTest.start();
		},

		displayLeadersTable: function () {
			var leaderTableWidgetTest = new datagrid({el:"#leaders"});
			leaderTableWidgetTest.setData(this.getLeaderLaggerTableData());
			this.registerDescendantView(leaderTableWidgetTest);
			leaderTableWidgetTest.start();
		},

		displayLaggersTable: function () {
			var laggerTableWidgetTest = new datagrid({el:"#laggers"});
			laggerTableWidgetTest.setData(this.getLeaderLaggerTableData());
			this.registerDescendantView(laggerTableWidgetTest);
			laggerTableWidgetTest.start();
		},

		getLeaderLaggerTableData: function () {
			var tableData = {"categories": [
									{"category": "%"},
									{"category": "Ticker", "sortable": true},
									{"category": "Stock name"}
							],
							"gridData": [
									{"c1":"10%", "c2": "IBM", "c3": "International Business Machines"},
									{"c1":"23%", "c2": "GOOG", "c3": "Google"},
									{"c1":"2%", "c2": "APPL, LLC", "c3": "Apple"},
									{"c1":"8%", "c2": "ASI", "c3": "Advisor Software"},
									{"c1":"14%", "c2": "XXL", "c3": "Extra Extra Large"}
							],
							"paginate": false,
							"pageRows" : 0
							};
			return tableData;
		},

		getFeesTableData : function () {
			var clickHandler = function(ev, rowIndex, colIndex) {
				var grid = ev.data.viewRef;
				console.log(JSON.stringify(grid.getRowData(rowIndex)));
				console.log(JSON.stringify(grid.getCellData(rowIndex, colIndex)));
			};
			// mock JSON 
			var feesTableData = {
					"categories": [
									{"category": "Amount"},
									{"category": "%"},
									{"category": "Fee"}
							],
					"clickHandler" : clickHandler,
					"pageRows" : 2,
					"paginate": false,
					"label": "Time Frame",
					"timeFrame": [
					              {   "name":"First Quarter", 
					            	  "value":"Q1",
					            	  "gridData": [
													{"c1":"1K", "c2": ".75%", "c3": "Mutual Fund"},
													{"c1":"2K", "c2": ".2%", "c3": "ETF"},
													{"c1":"4K", "c2": ".4%", "c3": "Advisor"},
													{"c1":"13K", "c2": ".1%", "c3": "Other"},
													{"c1":"20K", "c2": "1.45%", "c3": "Total"}
											]
					              },
					              {   "name":"Second Quarter", 
					            	  "value":"Q2",
					            	  "gridData": [
													{"c1":"2K", "c2": ".6%", "c3": "Mutual Fund"},
													{"c1":"6K", "c2": ".2%", "c3": "ETF"},
													{"c1":"3K", "c2": ".4%", "c3": "Advisor"},
													{"c1":"12K", "c2": ".1%", "c3": "Other"},
													{"c1":"23K", "c2": "1.3%", "c3": "Total"}
											]
					              },
					              {   "name":"Third Quarter", 
					            	  "value":"Q3",
					            	  "gridData": [
													{"c1":"3K", "c2": ".35%", "c3": "Mutual Fund"},
													{"c1":"20K", "c2": ".2%", "c3": "ETF"},
													{"c1":"4K", "c2": ".4%", "c3": "Advisor"},
													{"c1":"11K", "c2": ".1%", "c3": "Other"},
													{"c1":"40K", "c2": "1.05%", "c3": "Total"}
											]
					              },
					              {   "name":"Fourth Quarter", 
					            	  "value":"Q4",
					            	  "gridData": [
													{"c1":"4K", "c2": ".75%", "c3": "Mutual Fund"},
													{"c1":"2K", "c2": ".4%", "c3": "ETF"},
													{"c1":"8K", "c2": ".4%", "c3": "Advisor"},
													{"c1":"10K", "c2": ".1%", "c3": "Other"},
													{"c1":"24K", "c2": "1.85%", "c3": "Total"}
											]
					              }
					 ]
					
			};
			
			return feesTableData;
		}

	});
	
	return PortfolioView;
		
});