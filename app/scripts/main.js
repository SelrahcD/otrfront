(function() {
    'use strict';

    var root = this;

    root.require([
		'backbone',
		'application',
		'regionManager',
		'module/authManager'
	],
	function ( Backbone, App ) {
		App.start();
	});
}).call( this );