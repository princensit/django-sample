function current_time() {
    var date = new Date();
    $('#runtime').text(date);
}

$(function () {
    current_time();
    setInterval(current_time, 1000);
});
