var BLINK_INTERVAL = 1000;

// use jquery
var SwitchLightView = function(elm, onClass, offClass) {
	this.el = $(elm);
	this.onClass = onClass;
	this.offClass = offClass;
	this.enabled = false;
	this.onChange = null;
	this.blink = false;
	this.el.addClass(this.offClass);
	this.el.click(this._onClick.bind(this));
}

SwitchLightView.prototype._onClick = function () {
	this._setLight(!this.enabled);
	if (this.onChange) {
		this.onChange(this);
	}
}

SwitchLightView.prototype._setLight = function (enabled) {
	this.enabled = enabled;
	var toAdd = this.enabled ? this.onClass : this.offClass;
	var toRemove = this.enabled ? this.offClass : this.onClass;
	this.el.addClass(toAdd);
	this.el.removeClass(toRemove);
	this._handleBlink();
}

SwitchLightView.prototype._startBlink = function () {
	if (!this.intervalID) {
		this.intervalID = setInterval(toggleLight.bind(this), BLINK_INTERVAL);
	}
	function toggleLight() {
		this.el.toggleClass(this.onClass);
		this.el.toggleClass(this.offClass);
	}
}

SwitchLightView.prototype._stopBlink = function () {
	if (this.intervalID) {
		clearInterval(this.intervalID);
		this.intervalID = null;
		this._setLight(this.enabled);
	}
}

SwitchLightView.prototype._handleBlink = function () {
	if (this.enabled && this.blink) {
		this._startBlink();
	} else {
		this._stopBlink();
	}
}

//
// Public methods
//
SwitchLightView.prototype.change = function(callback) {
	this.onChange = callback;
}

SwitchLightView.prototype.setBlink = function(blink) {
	this.blink = blink;
	this._handleBlink();
}

SwitchLightView.prototype.reset = function() {
	this.blink = false;
	this._stopBlink();
	this._setLight(false);
}

