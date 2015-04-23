exports.HIGH = 'HIGH';
exports.LOW = 'LOW';
exports.setMode = function(v) {
	console.log('setMode', v);
};
exports.setOutput = function(pin) {
	console.log('setOutput', pin);
};
exports.write = function(pin, v) {
	console.log('write', pin, v);
};

