/**
 *	Module dependencies
 */
var path = require('path'),
	fs = require('fs');
var debug = require('./debug');

var np = (function() {
	/**
	 *	Module api
	 */
	var api = {};
	var HOSTS_FILE = '../data/hosts';

	function getHosts() {
		fs.readFile(HOSTS_FILE, {encoding :'utf-8'}, function(err, data){
			if(err){
				throw err;
			}
			var hosts = data.trim().split(/\s+/);
			debug.showLog(hosts);
			return hosts;
		})
	}
	api.getHosts = getHosts;

	return api;
})();
module.exports = np;