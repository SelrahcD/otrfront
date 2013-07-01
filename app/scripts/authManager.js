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

		var authenticate = function(email, password, success, error) {

			$.ajax({
			  type: 'POST',
			  url: 'http://api.ontheroad.dev/auth',
			  data: { email: email, password: password },
			  success: function(data) {
			  	tokenData = new TokenData(data);
			  	success();
			  },
			  error: function() {
			  	console.log('Unable to log in.');
			  	error();
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
					tokenData = new TokenData(data);
				},
				error: function(jqXHR, textStatus, error) {
					console.log('Unable to refresh token');
				}
			});

			return null;
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
				expiration: 0
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

				var alertContainer = this.$('#alerts-container');

				authenticate(
					this.$('input[name=email]').val(),
					this.$('input[name=password]').val(),
					function() {
						console.log('Authenticated');
						Communicator.mediator.trigger('Auth:Authenticated');
					},
					function() {
						console.log('Failed');
						var alert = '<div data-alert class="alert-box alert">';
							alert += 'We were unable to log you in.';
							alert += '</div>';

						alertContainer.append(alert);
					});
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