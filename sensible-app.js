//
// using mjpg_streamer to run webcam
//
var	dgram = require ("dgram");
var	fs = require ("fs");
var	http = require ("http");
var	os = require ("os");
var path = require ("path")
var	url = require ("url");

// load sensible
var baseDir = path.dirname(process.argv[1]);
var	sensibleContent = fs.readFileSync(path.join(baseDir, 'sensible.js'));
eval(sensibleContent.toString());

var app = sensible.node.Application;

app.prototype.onBeforeStart = onBeforeStart;
app.prototype.onAfterStart = onAfterStart;
var setProperties = app.prototype.properties_set;
app.prototype.properties_set = onSetProperties;

sensible.ApplicationFactory.createApplication(function (error) {
	if (error) {
		console.log('ERROR:', error);
	} else {
		console.log('sensible app created');
	}
});

function onBeforeStart(callback) {
	callback();
}

function onAfterStart(callback) {
	console.log('sensible app started');
	callback();
}

function onSetProperties(request, callback) {
	console.log('onSetProperties()');
  var parameters = request.parameters;

  setProperties.call(this, request, callback);
}
