// Custom rules for jQuery validate
$.validator.addMethod('isGreaterThanZero', function (value, element, param) {
    return this.optional(element) || (accounting.unformat(value) > 0 ? true : false);
}, 'Number must be greater than zero');

$.validator.addMethod('isInteger', function (value, element, param) {
    return this.optional(element) || (value.toString().match(/^[0-9]+(,?\d+)*$/) ? true : false);
}, 'Number must be an integer');

$.validator.addMethod('isFloat', function (value, element, param) {
    return this.optional(element) || (value.match(/^\d+(,?\d+)*(\.\d{0,2})?$/) ? true : false);
}, 'Number must be float');

function appendParam(uri, key, value) {
    var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    } else {
        return uri + separator + key + "=" + value;
    }
}

function checkUncheck(a) {
    var inputs = a.form.elements;
    var inputstwo = [];
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type == 'checkbox') {
            inputstwo.push(inputs[i]);
        }
    }
    for (var j = 0; j < inputstwo.length; j++) {
        if (inputstwo[0].checked) {
            inputstwo[j].checked = true;
        } else {
            inputstwo[j].checked = false;
        }
    }
}

var ELpntr = false;
function showHide(EL, PM) {
    var ELpntr = document.getElementById(EL);
    if (ELpntr.style.display == 'none') {
        document.getElementById(PM).innerHTML = '';
        ELpntr.style.display = 'block';
    } else {
        document.getElementById(PM).innerHTML = '';
        ELpntr.style.display = 'none';
    }
}

function showMessage(msg) {
    $('#show-message').html(msg).stop(true, true).show().fadeOut({ duration: 5000 });
}

function toggleDemoButton(element) {
    var toggle = element;
    var input = toggle.children(':input');
    var audienceRow = toggle.closest('.audience-row');
    var audience = audienceRow.siblings('.audience');
    if (toggle.hasClass('selected')) {
        toggle.removeClass('selected');
        input.val('false');

        audience.find('input.gender_age_group_hidden').val('false');
        audience.find('input.democheckbox').prop('checked', false);
    } else {
        toggle.addClass('selected');
        input.val('true');

        var demoSelectableButtonsLength = audienceRow.find('.demoselectable').length;
        var activeButtonsLength = audienceRow.find('.demoselectable.selected').length;
        if (demoSelectableButtonsLength == activeButtonsLength) {
            audience.find('input.gender_age_group_hidden').val('true');
            audience.find('input.democheckbox').prop('checked', true);
        }
    }

    makeAjaxCall();
}

function toggleCheckbox(element) {
    var toggle = element;
    var demoSelectable = toggle.closest('.audience').siblings('.audience-row').find('.demoselectable');
    var input = toggle.siblings('input.gender_age_group_hidden');
    var val = input.val();
    if (val == 'true') {
        input.val('false');
        demoSelectable.removeClass('active selected');
        demoSelectable.find('input.gender_age_group_hidden').val('false');
    } else {
        input.val('true');
        demoSelectable.addClass('active selected');
        demoSelectable.find('input.gender_age_group_hidden').val('true');
    }

    makeAjaxCall();
}

function updateLinearCpm() {
    var offerCpmId = $('#cpm');
    var offerCpm = parseFloat(offerCpmId.val()).toFixed(2);
    offerCpmId.val(offerCpm);
    var incidencePercent = $('#incidencePercent').html();
    var incidenceValue = parseFloat(incidencePercent);
    var linearCpm = 0.0;
    if (!isNaN(incidenceValue)) {
        linearCpm = offerCpm * incidenceValue / 100;
    }
    linearCpm = linearCpm.toFixed(2);
    $('#linearCpm').val(linearCpm);
}

function updateOfferCpm() {
    var linearCpmId = $('#linearCpm');
    var linearCpm = parseFloat(linearCpmId.val()).toFixed(2);
    linearCpmId.val(linearCpm);
    var incidencePercent = $('#incidencePercent').html();
    var incidenceValue = parseFloat(incidencePercent);
    var offerCpm = 0.0;
    if (!isNaN(incidenceValue) && incidenceValue != 0) {
        offerCpm = linearCpm * 100 / incidenceValue;
    }
    offerCpm = offerCpm.toFixed(2);
    $('#cpm').val(offerCpm);
}

function updateForecast(audienceTargetResult) {
    $('#audienceForecast').html(accounting.formatNumber(audienceTargetResult['audience_forecast']));
    $('#impressionsForecast').html(accounting.formatNumber(audienceTargetResult['impressions_forecast']));
    $('#incidencePercent').html(accounting.formatNumber(audienceTargetResult['incidence_percent'] * 100, 1) + '%');
}

function audienceDiscoveryPath(action) {
    if (action === undefined) {
        action = 'Submit';
    }
    return 'api/audienceDiscovery/?action=' + action;
}

function updateJsonData(data) {
    if (data["attributes"] === undefined) {
        data["attributes"] = {};
    }
    if (data["demo_attributes"] === undefined) {
        data["demo_attributes"] = {};
    }
    var totalAudienceSize = accounting.unformat(data["total_audience_size"]);
    data["total_audience_size"] = totalAudienceSize;

    var frequency = accounting.unformat(data["frequency"]);
    data["frequency"] = frequency;

    data = JSON.stringify(data);

    // Remove single quote
    data = data.replace(/'/g, "");

    return data;
}

function makeAjaxCall(action) {
    var form = $('#attributeForm');
    var url = audienceDiscoveryPath(action);
    var data = form.serializeJSON();
    data = updateJsonData(data);
    var token = $("meta[name='_csrf']").attr("content");

    var notificationBox = $('.notification_box');
    var notificationMsg = $('.notification_message');
    var audienceDiscoveryAction = $('#audienceDiscoveryResultAction');

    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: data,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', token);

            if (action !== undefined && action != 'Submit') {
                notificationBox.removeClass('notification_error notification_success').addClass('notification_sending');
                notificationMsg.html('');
                audienceDiscoveryAction.html('Sending ' + action + ' email...');
                notificationBox.show();
                $('html,body').animate({ scrollTop: notificationBox.position().top + 100 }, 'slow');
            }
        },
        success: function (json) {
            updateForecast(json['audience_target_result']);
            var success = json['action_success'];

            if (action === undefined || action == 'Submit') {
                $('.result-value-cpm').show();
            } else if (success != null) {
                var msg = '';
                if (success) {
                    msg = 'Your ' + action + ' email was sent.';
                    notificationBox.removeClass('notification_sending notification_error').addClass('notification_success');
                    notificationMsg.html('Success!');
                } else {
                    msg = 'Unable to send ' + action + ' email.';
                    notificationBox.removeClass('notification_sending notification_success').addClass('notification_error');
                    notificationMsg.html('Error!');
                }
                audienceDiscoveryAction.html(msg);
                notificationBox.show().fadeOut({ duration: 5000 });
            }
        },
        error: function (xhr, textStatus, thrownError) {
            if (xhr.status == 403) {
                // response of 403 indicates access denied due to invalid session or timeout
                // redirect back to the current page, which will handle login appropriately
                var currentPath = window.location.pathname;
                var newPath = appendParam(currentPath, 'flash',
                    'Previous session was invalid, please try again.');
                window.location.replace(newPath);
            } else {
                if (action === undefined || action == 'Submit') {
                    showMessage('Error processing request, please try again.');
                } else {
                    var msg = 'Unable to send ' + action + ' email.';
                    notificationBox.removeClass('notification_sending notification_success').addClass('notification_error');
                    notificationMsg.html('Error!');
                    audienceDiscoveryAction.html(msg);
                    notificationBox.show().fadeOut({ duration: 5000 });
                }
            }
        },
        complete: function () {
            $('#offer-btn, #reserve-btn').removeAttr("disabled");
            var offerCpm = parseFloat($('#cpm').val());
            if (isNaN(offerCpm) || offerCpm == 0) {
                updateOfferCpm();
            } else {
                updateLinearCpm();
            }
        }
    });
}

function addCpmRules(form) {
    form.validate();
    $('#cpm').rules("add", {
        required: true,
        isGreaterThanZero: true
    });
    $('#linearCpm').rules("add", {
        required: true,
        isGreaterThanZero: true
    });
}

function removeCpmRules(form) {
    form.validate();
    $('#cpm').rules("remove", "required isGreaterThanZero");
    $('#linearCpm').rules("remove", "required isGreaterThanZero");
}

$(function () {
    var form = $('#attributeForm');
    form.validate({
        rules: {
            frequency: {
                required: true,
                isGreaterThanZero: true,
                isInteger: true
            },
            totalAudienceSize: {
                required: true,
                isGreaterThanZero: true,
                isInteger: true
            }
        },
        focusInvalid: false,
        invalidHandler: function (form, validator) {
            if (!validator.numberOfInvalids()) {
                return;
            }

            $('html, body').animate({ scrollTop: $(validator.errorList[0].element).offset().top - 100}, 20);
        },
        errorPlacement: function (error, element) {
            if (element.attr('name') == 'frequency' || element.attr('name') == 'totalAudienceSize') {
                error.addClass('inline-errors');
            }
            error.insertAfter(element);
        }

    });

    var demo_toggle_button_container = $('#demo_toggle_button_container');
    demo_toggle_button_container.on('click', '.demoselectable', function () {
        if (form.valid()) {
            toggleDemoButton($(this));
        }
    });

    demo_toggle_button_container.on('click', '.democheckbox', function () {
        if (form.valid()) {
            toggleCheckbox($(this));
        }
        else {
            if ($(this).is(':checked')) {
                $(this).prop('checked', false);
            }
            else {
                $(this).prop('checked', true);
            }
        }
    });


    $('#reset-btn').click(function () {
        demo_toggle_button_container.find('.audience-row .demoselectable').removeClass('active selected');
        demo_toggle_button_container.find('input.democheckbox').prop('checked', false);
        demo_toggle_button_container.find('input.gender_age_group_hidden').val('false');
        $('.selectpicker').selectpicker('deselectAll');
        $('.result-value-cpm').hide();
        $('#frequency').val('1');
        $('.reset-value-empty').val('');
        $('.reset-value-currency').val('0.00');
        $('.reset-value-dash').html('-');
        form.valid();
    });

    $('.datepicker', '#attributeForm').datepicker();

    $(document).on('focusin', 'textarea#comments', function () {
        $(this).css({
            'width': '165px',
            'height': '90px'
        });
    });

    $(document).on('focusout', 'textarea#comments', function () {
        $(this).css({
            'width': '108px',
            'height': '20px'
        });
    });

    $('.selectpicker').selectpicker({
        hideDisabled: true
    });

    $(document).on('click', '#logoff-button', function () {
        $(this).closest('form').submit();
    });

    $('#linearCpm').on('change', function () {
        updateOfferCpm();
        form.valid();
    });

    $('#cpm').on('change', function () {
        updateLinearCpm();
        form.valid();
    });

    $('.submitOnChange').on('change', function () {
        if (form.valid()) {
            makeAjaxCall();
        }
    });

    $('#offer-btn, #reserve-btn').click(function () {
        addCpmRules(form);
        if (form.valid()) {
            var action = $(this).attr('value');
            $('#offer-btn, #reserve-btn').attr("disabled", true);
            makeAjaxCall(action);
        }
        removeCpmRules(form);
    });

    $('.dropdown-menu').on('click', function (event) {
        if (!form.valid()) {
            event.stopPropagation();
            $('.dropdown-menu > li > a').blur();
        }
    });
});
