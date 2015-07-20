var debug = (function(){
	var api = {};
	api.showLog = function(msg){
		console.log(msg);
	}

	return api;
})();
module.exports = debug;