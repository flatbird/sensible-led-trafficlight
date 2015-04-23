var	dgram = require ("dgram");
var	fs = require ("fs");
var	http = require ("http");
var	os = require ("os");
var path = require ("path")
var	url = require ("url");
// var rpio = require('./rpio-mock');
var rpio = require('rpio');

var GPIO_PINS = {
	PIN_G: 16,
	PIN_Y: 20,
	PIN_R: 21
};

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
	// start from OFF
	gSensibleApplication.setProperty('green', 'off');
	gSensibleApplication.setProperty('yellow', 'off');
	gSensibleApplication.setProperty('red', 'off');
	callback();
}

function onAfterStart(callback) {
	console.log('sensible app started');
	rpio.setMode('gpio');
	for (var pin in GPIO_PINS) {
		rpio.setOutput(GPIO_PINS[pin]);
	}
	callback();
}

function onSetProperties(request, callback) {
  var param = request.parameters;
  console.dir(param);
  setPin(GPIO_PINS.PIN_G, param.green);
  setPin(GPIO_PINS.PIN_Y, param.yellow);
  setPin(GPIO_PINS.PIN_R, param.red);
  setProperties.call(this, request, callback);
}

function setPin(pin, value) {
	if (value === 'on') {
		Blinker.remove(pin);
		rpio.write(pin, rpio.HIGH);
	} else if (value === 'off') {
		Blinker.remove(pin);
		rpio.write(pin, rpio.LOW);
	} else if (value === 'blink') {
		Blinker.add(pin);
	}
}

var Blinker = {
	//
	// values
	//
	pins: [],
	intervalID: null,
	on: false,
	//
	// methods
	//
	add: function(pin) {
		if (this.pins.indexOf(pin) < 0) {
			this.pins.push(pin);
			if (!this.intervalID) {
				console.log('start blinking');
				this.intervalID = setInterval(this._blink.bind(this), 1000);
			}
		}
	},
	remove: function(pin) {
		var index = this.pins.indexOf(pin);
		if (index >= 0) {
			this.pins.splice(index, 1);
			if (this.pins.length <= 0 && this.intervalID) {
				console.log('stop blinking');
				clearInterval(this.intervalID);
				this.intervalID = null;
			}
		}
	},
	_blink: function() {
		this.on = !this.on;	
		var value = this.on ? rpio.HIGH : rpio.LOW;	
		this.pins.forEach(function (pin) {
			rpio.write(pin, value);
		});
	}
}
