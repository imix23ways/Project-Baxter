define([
        'AppView',
        'text!./Menu.html',
        'text!./MenuItem.html',
        'text!./SubMenuItem.html'
        ],
function(
		AppView,
		template,
		menuItem,
		subMenuItem
) {
	
	var events = [];
	events['click .toogleSubItems'] = 'toogleSubMenuItems';
	
	var MenuView = AppView.extend({
		
		start : function() {
			this.delegateEvents(events);
			this.setReady(true);
		},
		
		render : function() {
			this.applyTemplate(template);
			//console.log($(this.el))
			this.sectionTag = $(this.el)[0].children[0];
			this.displayMenu(this.menuData);
		},

		setData: function (data) {
			this.menuData = data;
		},

		displayMenu: function(menuData) {
			var menu = menuData.menu,
			menuDataLength = menu.length,
			i;

			for (i = 0; i < menuDataLength; i++) {
				
				if (menu[i].menuItem == undefined) {
					continue;
				}
				
				if (menu[i].itemPath == undefined) {
					menu[i].itemPath = '';
				}
				
				menu[i].itemNumber = i;	
				var newMenuItem = _.template(menuItem, menu[i]);
				$(this.sectionTag).append(newMenuItem);
				
				var menuItems = $(this.sectionTag).find(".main-item");
				var addedMenuItem = menuItems.last();
				this.addAdditionalAttributes(addedMenuItem, menu[i]);
				
				var subMenuItems = menu[i].subMenuItems;
				if (subMenuItems != undefined) {
					for (var j = 0; j < subMenuItems.length; j++) {
						if (subMenuItems[j].menuItem == undefined) {
							continue;
						}
						if (subMenuItems[j].itemPath == undefined) {
							subMenuItems[j].itemPath = '';
						}
						subMenuItems[j].itemNumber = i+"_"+j;
						subMenuItems[j].itemClass = "sb_item"+menu[i].itemNumber;
						var newSubMenuItem = _.template(subMenuItem, subMenuItems[j]);
						$(this.sectionTag).append(newSubMenuItem);
						
						var addedSubMenuItems = $(this.sectionTag).find(".sub-item");
						var addedSubMenuItem = addedSubMenuItems.last();
						this.addAdditionalAttributes(addedSubMenuItem, subMenuItems[j]);

					}
				}
				
			}
			// Set height and width for menus
			var menuWidth = menuData.menuWidth;
			var menuHeight = menuData.menuHeight;
			var subMenuWidth = menuData.subMenuWidth;
			var subMenuHeight = menuData.subMenuHeight;
			$(this.sectionTag).find(".main-item").each(function() {
				$(this).css("width", menuWidth + "px");
				$(this).css("height", menuHeight + "px");
				$(this).find("a").css("width", menuWidth + "px");
			});
			$(this.sectionTag).find(".sub-item").each(function() {
				$(this).css("width", subMenuWidth + "px");
				$(this).css("height", subMenuHeight + "px");
				$(this).find("a").css("width", subMenuWidth + "px");
			});
		},
		
		toogleSubMenuItems : function (ev) {
			var subMenuItemClass = ev.currentTarget.id;
			$('#'+$(this.el).attr('id')+" ."+subMenuItemClass).slideToggle( "fast" );
		},
		
		addHoverEvent : function (menuItem, hoverColor) {
			var currentBgColor;
			menuItem.data("hoverColor", hoverColor);
			menuItem.hover(
				function() {
					var savedHoverColor = $(this).data("hoverColor");
					currentBgColor = $(this).css("background-color");
					$(this).css("background-color", savedHoverColor);
				},
				function() {
					$(this).css("background-color", currentBgColor);
				}
			);
		},
		
		addAdditionalAttributes : function (menuItem, data) {
			var bgColor = data.bgColor;
			if (bgColor != undefined && bgColor != '') {
				menuItem.css("background-color", bgColor);
			}
			var textColor = data.textColor;
			if (textColor != undefined && textColor != '') {
				menuItem.find("a").css("color", textColor);
			}
			var hoverColor = data.hoverColor;
			if (hoverColor != undefined && hoverColor != '') {
				this.addHoverEvent(menuItem, hoverColor);
			}
		}
		
	});
	
	return MenuView;
	
});
