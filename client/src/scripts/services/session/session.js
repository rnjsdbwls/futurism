angular.module('futurism')
	.factory('session', function($http, $location, websites, account, TokenResource) {
		'use strict';

		var self = this;
		var sitesToTry = ['j', 'g'];
		var token = '';
		var tempCredentials;


		self.makeNew = function(callback) {
			checkLogins(function(err) {
				if(err) {
					return callback(err);
				}

				authorizeLogin(function(err, data) {
					if(err) {
						return callback(err);
					}

					updateAccount(data);
					setToken(data.token);
					return callback(null, data);
				});
			});
		};


		self.destroy = function(callback) {
			setToken(null);
			$http
				.delete('/api/token')
				.success(function(data) {callback(null, data);})
				.error(callback);
		};


		self.renew = function(callback) {
			var token = self.getToken();

			if(token) {
				TokenResource.update({token: token}, function(data) {
					if(data.error) {
						return self.makeNew(callback);
					}
					updateAccount(data);
					return callback(null, data);
				},
				function(err) {
					return self.makeNew(callback);
				});
			}

			else {
				return self.makeNew(callback);
			}
		};


		self.getToken = function() {
			if(!token && typeof Storage !== 'undefined') {
				token = account.token = sessionStorage.getItem('token');
			}
			return token;
		};
		token = self.getToken();


		var setToken = function(tkn) {
			token = account.token = tkn;
			if(typeof Storage !== 'undefined') {
				sessionStorage.setItem('token', tkn);
			}
		};


		var updateAccount = function(data) {
			_.assign(account, data);
			console.log('account', account);
			console.log('data', data);
			account.loggedIn = true;
		};


		var checkLogins = function(callback) {
			var i = 0;

			var checkNext = function() {
				if(i >= sitesToTry.length) {
					return callback('not logged into these sites: '+sitesToTry.join(','));
				}

				var site = sitesToTry[i];
				i++;

				var lookupFn = websites.lookup[site].loginFn;
				return lookupFn(checkResult);
			};

			var checkResult = function(error, tempCred) {
				if(error) {
					return checkNext();
				}
				tempCredentials = tempCred;
				return callback(null);
			};

			checkNext();
		};


		var authorizeLogin = function(callback) {
			TokenResource.get(tempCredentials, function(data) {
				if(data.error) {
					return callback(data.error);
				}
				return callback(null, data);
			});
		};


		return self;
	});