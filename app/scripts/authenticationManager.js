(function() {
	'use strict';

	var root = this;

	root.define([
		'backbone',
		'communicator'
	],
	function( Backbone, Communicator ) {

		var LoginView = Backbone.Marionette.ItemView.extend({
			template: '#loginForm',

			initialize: function() {
				console.log('Initialize new LoginView');
			}
		});

		var AuthenticationManager = Backbone.Marionette.Controller.extend({

			token: null,

			initialize: function( options ) {
				console.log("Initialize a Authentication Manager");

				// Recall token
				this.token = this.recallToken();

				// If we have an outdated token get we can refresh it
				if(this.token !== null && !this.isSessionValid()) {
					this.token = this.refreshToken();
				}

				// If we still don't have a token print login form
				if(this.token === null) {
					var loginView = new LoginView();
					Communicator.command.execute("setView", loginView);
				}
			},

			recallToken: function() {
				console.log('Recall token from cookie');
				return null;
			},

			refreshToken: function() {
				console.log('Refresh token from backend');
				return null;
			},

			isSessionValid: function() {
				return false;
			}


		});

		return new AuthenticationManager();
	});

}).call(this);