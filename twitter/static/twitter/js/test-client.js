function okJson(element, json) {
	element.html('<pre class="alert alert-success">' + JSON.stringify(json, undefined, 2) + '</pre>');
}

function ok(element) {
	element.html('<div class="alert alert-success">OK</div>');
}

function okPath(element, path, method) {
	element.html('<div class="alert alert-info"><b>' + method + ': </b> /'+ path +
					'<button type="button" class="close result-scroll-top">' +
					'<i class="icon-chevron-up"></i></button></div>');
}

function error(element) {
	element.html('<div class="alert alert-error">ERROR</div>');
}

function getElement(prefix, suffix) {
	return $('#' + prefix + '-' + suffix);
}

function getEncodedVal(prefix, suffix) {
	return encodeURIComponent(getElement(prefix, suffix).val());
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function addTrailingSlash(path) {
	if (!endsWith(path, '/')) {
		return path.concat('/');
	} else {
		return path;
	}
}

//dynamically build request params
function buildRequestParams(prefix, paramNames) {
	if (paramNames == null) {
		return '';
	}
	var params = [];
	for (var i = 0; i < paramNames.length; i++) {
		var paramName = paramNames[i];
		var element = getElement(prefix, paramName);
		if (element.attr('disabled') === undefined) {
			var paramVal = element.val().trim();
			if (paramVal !== '') {
				params.push(paramName + '=' + encodeURIComponent(paramVal));
			}
		}
	}
	if (params.length > 0) {
		return '?' + params.join('&');
	} else {
		return '';
	}
}

// bind onClick logic to a submit button
function bindRequest(prefix, type, url, params, hasResultData, hasRequestBody) {
	getElement(prefix, 'submit').click(function() {
		var resultDiv = getElement(prefix, 'result');
		var pathDiv = getElement(prefix, 'path');
		var path = addTrailingSlash(url(prefix)) + buildRequestParams(prefix, params);
		var body = getElement(prefix, 'body');
		var data = (hasRequestBody && (body.attr('disabled') === undefined)
				? body.val().trim() : null);
		var token = $("meta[name='_csrf']").attr("content");
		$.ajax({
			type : type,
			url : path,
			contentType : 'application/json',
			data : data,
			beforeSend : function(xhr) {
				xhr.setRequestHeader('X-CSRFToken', token);
			},
			success : function(json) {
				if (hasResultData) {
					okJson(resultDiv, json);
				} else {
					ok(resultDiv);
				}
			},
			error : function() {
				error(resultDiv);
			},
			complete : function() {
				okPath(pathDiv, path, type);
				$('html,body').animate({
					scrollTop: '+=' + (pathDiv.offset().top - $('body').scrollTop() - 10) + 'px'
				}, 'fast');
				pathDiv.find('.result-scroll-top').click(function() {
					$('html,body').animate({
						scrollTop: '0px'
					}, 'fast');
				});
			}

		});
		return false;
	});
}

$(function() {
	// clear the result and path divs when changing tabs
	$('a[data-toggle="tab"]').on('show', function(e) {
		var href = $(e.target).attr('href');
		$(href + ' .tab-result,.tab-path').each(function() {
			$(this).html('');
		});
		$('html,body').animate({
			scrollTop: '0px'
		}, 'fast');
	});

	// buttons to enable/disable optional params
	$('.optional-param-ok').click(function() {
		$(this).closest('.optional-param-toggle').siblings(':input')
			.removeAttr('disabled');
		$(this).siblings('.optional-param-remove')
			.removeClass('btn-danger')
			.children().removeClass('icon-white');
		$(this)
			.addClass('btn-success')
			.children().addClass('icon-white');
	});

	$('.optional-param-remove').click(function() {
		$(this).closest('.optional-param-toggle').siblings(':input')
			.attr('disabled', 'disabled');
		$(this).siblings('.optional-param-ok')
			.removeClass('btn-success')
			.children().removeClass('icon-white');
		$(this)
			.addClass('btn-danger')
			.children().addClass('icon-white');
	});
});