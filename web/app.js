$(function () {
	$('#toggle').click(function () {
		$.get('/properties/get', function (data) {
			data.forEach(function(item) {
				if (item.value === 'on') {
					item.value = 'off';
				} else {
					item.value = 'on';
				}
			});
			$.post('/properties/set', data, function (data) {
				$('#output').text(JSON.stringify(data, undefined, '  '));
			});
		});
	});
});