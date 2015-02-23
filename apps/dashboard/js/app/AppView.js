define(['underscore', 'backbone'],
function(_, Backbone) {

	return Backbone.View.extend({

		_:_,
		Backbone:Backbone,
		unreadiness: 1,
		bufferDescendants: [],

		// Render ready polling flag.
		setReady: function(ready) {
			if (ready) {
				if (this.unreadiness>0) {
					this.unreadiness--;
				}
			} else {
				this.unreadiness++;
			}
			if (this.unreadiness==0) {
				this.render();
			}
		},

		isReady: function() {
			return (this.unreadiness == 0);
		},

		// First, reset the ready number. Then, call start to reduce the number by one.
		// For actual use, please read the comment below
		load: function() {
			this.unreadiness = 1;
			this.start();
		},

		// when this function is overriden, timing of render function can be managed.
		// For example. ready(true) should not be called until data is fetched.
		// For example. do not call render when the view is already rendered.
		start: function() {
			this.setReady(true);
		},

		// This is the major function to draw HTML on the designated dom element.
		applyTemplate: function(template, data) {
			data = data || {};
			data = _.extend(data, {
				_: _
			});
			var compiledTemplate = _.template(template, data);
			this.$el.html(compiledTemplate);
		},

		// retrieve all child views
		getDescendants: function() {
			return this.descendants = this.descendants || {};
		},

		// retrieve a specified child view
		getDescendantView: function(name) {
			var descendants = this.getDescendants();
			return descendants[name].view;
		},
		
		// insert a new child view into buffer. defer append at the end.
		// This is ONLY useful when all descendants belong to one parent selector!
		bufferNewDescendant: function(name, descendant) {
			descendant.name = name;
			this.bufferDescendants.push(descendant);
		},
		// suggestion from http://ozkatz.github.io/avoiding-common-backbonejs-pitfalls.html
		addBufferedDescendants: function() {
			var container = document.createDocumentFragment();
			var selector = null;
			var descendants = this.getDescendants();
			_.each(this.bufferDescendants, function(descendant) {
				descendant.view.load();
				container.appendChild(descendant.view.el);
				descendants[descendant.name] = descendant;
				selector = descendant.selector;
			}, this);
			this.$(selector).append(container);
			this.bufferDescendants = [];
		},

		// insert a new child view into the specified css selector.
		addDescendant: function(name, descendant) {
			var descendants = this.getDescendants();
			this.$(descendant.selector).append(descendant.view.$el);
			descendants[name] = descendant;
			descendant.view.load();
		},

		// remove a specified child view
		removeDescendant: function(name) {
			var descendants = this.getDescendants();
			if (descendants[name]) {
				this.stopListening(descendants[name].view);
				descendants[name].view.clear();
				delete descendants[name];
			}
		},

		// remove all child views.
		removeDescendants: function() {
			var descendants = this.getDescendants();
			var names = _.keys(descendants);
			for (var i=0; i<names.length; i++) {
				this.removeDescendant(names[i]);
			}
		},

		// replace a specified child view
		replaceDescendant: function(name, descendant) {
			this.removeDescendant(name);
			this.$(descendant.selector).empty();
			this.addDescendant(name, descendant);
		},

		setModel: function(model) {
			this.model = model;
		},

		// remove itself from the DOM. remove all event listeners.
		clear: function() {
			this.removeDescendants();
			this.model = undefined;
			this.remove();
			this.off();
		},

		// In some case, descendant is not added via methods above.
		// But it is still useful to register to prevent from memory leak.
		registerDescendantView: function(childView) {
			var descendants = this.getDescendants();
			descendants[_.uniqueId('reg_')] = {view:childView};
		},
		
		// navigate
		navigate: function(url) {
			Backbone.history.navigate(url,{trigger: true});
		}

	});
});
