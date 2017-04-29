module.exports = function(data,hbsObj) {

	if (arguments.length <= 1) {
		return;
	} else if (arguments.length > 2) {
		throw '[hbsHelper]:isTrue has more than 1 arguments';
		return;
	}

	if (data && data != false && data != 'false') {
		return hbsObj.fn(this); 
	} else {
		/**
		 * work in condition inverse
		 * {{#Helper}}
		 * 		fn()
		 * {{else}} //key
		 * 		inverse()
		 * {{/Helper}}
		 */
		return hbsObj.inverse(this);
	}
  
};