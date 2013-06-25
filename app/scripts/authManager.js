(function() {
	'use strict';

	var root = this;

	root.define([
		'backbone',
		'communicator'
	],
	function( Backbone, Communicator ) {

		var tokenData = null;

		// Functions

		var authenticate = function(email, password) {

			$.ajax({
			  type: 'POST',
			  url: 'http://api.ontheroad.dev/auth',
			  data: { email: email, password: password },
			  success: function(data) {
			  	tokenData = new TokenData(data);
			  	refreshToken(tokenData);
			  },
			  error: function() {
			  	console.log('Error');
			  }
			});
		}

		var recallToken = function() {
			console.log('Recall token from cookie');
			return null;
		}

		var refreshToken = function(tokenData) {
			$.ajax({
				type: 'POST',
				url: 'http://api.ontheroad.dev/auth/refresh',
				data: { refresh_token: tokenData.get('refresh_token')},
				crossDomain: true,
				username: tokenData.get('token'),
				password: 'x',
				beforeSend: function(xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + btoa(tokenData.get('token') + ":x"));
				},
				success: function(data) {
					console.log('success');
					console.log(data);
					tokenData = new TokenData(data);
				},
				error: function(jqXHR, textStatus, error) {
					console.log(error);
					console.log('Error');
				}
			});

			return null;
		}

		var make_base_auth = function(user) {
		  var tok = user + ':x';
		  var hash = btoa(tok);
		  return "Basic " + hash;
		}

		var isSessionValid = function() {

			var expiration = new Date(tokenData.get("expiration")),
				now = new Date();

			return tokenData !== null && expiration.getTime() > now.getTime();
		}

		var printLoginForm = function() {
			var loginView = new LoginView();
			Communicator.command.execute("APP:setView", loginView);
		}

		// Token Data
		
		var TokenData = Backbone.Model.extend({
			defaults: { 
				token: '',
				refresh_token: '',
				expiration: 9
			}
		});

		// View

		var LoginView = Backbone.Marionette.ItemView.extend({
			template: '#login_form--template',

			events: {
			  'submit #login_form': 'connectionAttempt'
			},

			connectionAttempt: function(e) {
				e.preventDefault();

				authenticate(this.$('input[name=email]').val(), this.$('input[name=password]').val());
			}
		});

		// Controller
		
		var AuthManager = Backbone.Marionette.Controller.extend({

			initialize: function( options ) {
				console.log("Initialize a Authentication Manager");

				// Recall token
				tokenData = recallToken();

				// If we have an outdated token get we can refresh it
				if(tokenData !== null && !isSessionValid()) {
					tokenData = refreshToken(tokenData);
				}

				// If we still don't have a token print login form
				if(tokenData === null) {
					printLoginForm();
				}
			}

		});

		return new AuthManager();
	});

}).call(this);