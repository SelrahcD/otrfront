(function() {
    'use strict';

    var root = this;

    root.require([
		'backbone',
		'application',
		'regionManager',
		'authManager'
	],
	function ( Backbone, App ) {
		App.start();
	});
}).call( this );