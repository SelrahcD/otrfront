(function() {
	'use strict';

	var root = this;

	root.define([
		'backbone',
		'communicator'
	],

	function( Backbone, Communicator) {

		var App = new Backbone.Marionette.Application();

		/* Add application regions here */
		App.addRegions({
			mainRegion: '#content'
		});

		/* Add initializers here */
		App.addInitializer( function () {

			Communicator.mediator.trigger("APP:START");
		});

		// Allow modules to set set the current view
		Communicator.command.setHandler("APP:setView", function(view){
			App.mainRegion.show(view);
		});

		return App;
	});
}).call( this );