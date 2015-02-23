define([
		'AppView',
		'text!./AppNav.html',
		'../../../../../../core/widgets/menu/MenuView'
		],
function(
	AppView,
	template,
	menu
	) {

	var events = [];
	events['click .app-nav-header'] = 'onClickNav';
	events['click #appNavContainer'] = 'onClickNav';

	var AppNavView = AppView.extend({
		
		start : function() {

			if (!this.isReady()) {
				this.setReady(true);
				this.delegateEvents(events);
			}
		},
		
		render : function() {
			this.applyTemplate(template);
			var testMenu = new menu({el:"#appNavContainer"});
			testMenu.setData(this.getMenuData());
			this.registerDescendantView(testMenu);
			testMenu.start();
		},

		onClickNav: function (ev) {
			$('.menu_bar, .app-nav-header').toggleClass( 'open' );
		},

		getMenuData: function () {
			var menuData = {"menu": [
						{"menuItem":"<i class='ico-gauge' /> Dashboard Test", "itemPath": "#dashboard"},
						{"menuItem":"<i class='ico-wallet' /> Forms", "itemPath": "#forms"},
						{"menuItem":"<i class='ico-star' /> Settings", "itemPath": "#settings"}
				]
			};
			return menuData;
		}

	});
	
	return AppNavView;
		
});
	