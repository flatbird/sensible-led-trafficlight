$(function () {
	var swGreen;
	var swYellow;
	var swRed;
	var blink = $('#blink');
	var properties;
	var isHidden = false;

	$.get('/properties/get', function (data, status) {
		console.log('/properties/get', status);
		if (data) {
			properties = data;
			init();
		}
	});

	function init() {
		swGreen = new SwitchLightView('#green', 'green', 'green-off');
		swYellow = new SwitchLightView('#yellow', 'yellow', 'yellow-off');
		swRed = new SwitchLightView('#red', 'red', 'red-off');
		swGreen.change(onChange);
		swYellow.change(onChange);
		swRed.change(onChange);
		blink.change(onBlinkChange);
		document.addEventListener('visibilitychange', onVisibilityChange, false);
		$(window).unload(turnOffAll);
	}

	function onBlinkChange() {
		var isBlink = blink.get(0).checked;
		swGreen.setBlink(isBlink);
		swYellow.setBlink(isBlink);
		swRed.setBlink(isBlink);

		var on = isBlink ? 'blink' : 'on'; 
		properties.forEach(function (item) {
			var swObj;
			var name = item.name;
			if (name === 'green') {
				swObj = swGreen;
			} else if (name === 'yellow') {
				swObj = swYellow;
			} else if (name === 'red') {
				swObj = swRed;
			}
			item.value = swObj.enabled ? on : 'off';
		});
		$.post('/properties/set', properties, function (data) {
			properties = data;
		});
	};

	function onChange(swObj) {
		if (isHidden) return;
		properties.forEach(function (item) {
			var name = item.name;
			if (name === swObj.onClass) {
				if (swObj.enabled) {
					item.value = swObj.blink ? 'blink' : 'on';
				} else {
					item.value = 'off';
				}
			}
		});
		$.post('/properties/set', properties, function (data) {
			properties = data;
		});
	}

	function turnOffAll() {
		properties.forEach(function (item) {
			item.value = 'off';
		});
		$.post('/properties/set', properties);
		blink.get(0).checked = false;
		swGreen.reset();
		swYellow.reset();
		swRed.reset();		
	}

	function onVisibilityChange() {
    if (document.hidden) {
			isHidden = true;
    	turnOffAll();
    } else  {
			isHidden = false;
    }
	}
});
