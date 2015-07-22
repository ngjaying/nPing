/**
 *	Module dependencies
 */
var path = require('path'),
	fs = require('fs'),
	dns = require('dns'),
	ping = require ('net-ping');
var debug = require('./debug');

var np = (function() {
	/**
	 *	Module api
	 */
	var api = {}, hosts = [];
	var HOSTS_FILE = '../data/hosts';

	function getHosts( callback) {
		fs.readFile(HOSTS_FILE, {encoding :'utf-8'}, function(err, data){
			if(err){
				throw err;
			}
			var hostnames = data.trim().split(/\s+/);
			(function next(i){
				debug.showLog(hostnames[i]);
				dns.resolve4(hostnames[i], function(err, ips){
					if(err){
						throw err;
					}
					debug.showLog(ips);
					hosts[i] = {};
					hosts[i].name = hostnames[i];
					hosts[i].ip = ips[0];
					if(i<hostnames.length - 1){
						next(i+1);
					}else{
						debug.showLog(hosts);
						callback(null, hosts);
					}
				});	
			})(0);					
		});
	}

	function pingHosts(){
		getHosts(function(err, hosts){
			var session = ping.createSession(), count=0, time=0, best = {}, j=0, host = hosts[j];
			(function next(i){
				session.pingHost(host.ip, function(err, target, sent, rcvd){
					var ms = rcvd - sent;
				    if (err){
				        debug.showLog(target + ": " + err.toString ());
				    }else{
				    	count++;
				    	time += ms;					    	
				        debug.showLog(target + ": Alive (ms=" + ms + ")");
				    }
				    	
			        if(i<2){
			        	next(i+1);
			        }else{
			        	if(count > 0){
							var av = time/count;
							if(!best.target || av<best.av){
								best.target = host;
								best.av = av;
							}
							debug.showLog(host.name + ": Average time " + av);
						}else{
							debug.showLog(host.name + ": Cannot access");
						}
						if(j<hosts.length - 1){
							count = time = 0;
							j++;
							host = hosts[j];
							next(0);
						}else{
							debug.showLog("Best server:" + best.target.name + ", average time:" + best.av);
						}								
			        }
				    
				});
			})(0);			
		});
	}
//	api.getHosts = getHosts;
	api.ping = pingHosts;
	return api;
})();
module.exports = np;