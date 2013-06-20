(function() {
    'use strict';

    var root = this;

    root.require([
		'backbone',
		'application',
		'regionManager',
		'authenticationManager'
	],
	function ( Backbone, App ) {
		App.start();
	});
}).call( this );