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

			events: {
			  'click .connection_button': 'connectionAttempt'
			},

			connectionAttempt: function() {
				Communicator.mediator.trigger('AuthManager:connectionAttempt', 'aaa', 'bbbb');
				return false;
			}
		});

		var AuthManager = Backbone.Marionette.Controller.extend({

			user: null,

			token: null,

			initialize: function( options ) {
				console.log("Initialize a Authentication Manager");

				// Handler for connection form submission
				Communicator.mediator.on('AuthManager:connectionAttempt', this.authenticate);


				// Recall token
				this.token = this.recallToken();

				// If we have an outdated token get we can refresh it
				if(this.token !== null && !this.isSessionValid()) {
					this.token = this.refreshToken();
				}

				// If we still don't have a token print login form
				if(this.token === null) {
					this.printLoginForm();	
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

			authenticate: function(email, password) {
				console.log('Use form data to authenticate');
				console.log(email);
				console.log(password);
			},

			isSessionValid: function() {
				return false;
			},

			printLoginForm: function() {
				var loginView = new LoginView();
				Communicator.command.execute("APP:setView", loginView);
			},

			getUserDataFromApi: function() {
				console.log("Fetching user data from the api");
				return null;
			},

			getUser: function() {
				return this.user;
			}

		});

		return new AuthManager();
	});

}).call(this);