define([
		'jquery',
		'underscore',
		'backbone'
], function(
		$,
		_,
		Backbone
) {

	return Backbone.Model.extend({

		$: $,
		_: _,
		Backbone: Backbone,

		array: function(obj) {
			if (obj === undefined || obj == null) {
				return [];
			} else if (!this.isArray(obj)) {
				return [obj];
			} else {
				return obj;
			}
		},

		isObject: function(obj) {
			if (obj) {
				if (typeof obj === 'object') {
					return true;
				}
			}
			return false;
		},

		isArray: function(obj) {
			return obj instanceof Array;
		}

	});
});