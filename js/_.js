
function login(form) {
	var input = form.down('input[type=text]'),
		username = input.value,
		classNames = 'not_logged_in logged_in logging_in';
	document.body.removeClass(classNames).addClass('logging_in');
	chatroom.register(username, {
		onopen: function() {
			document.body.removeClass(classNames).addClass('logged_in');
			chatroom.setName(username);
		},
		onclose: function() {}
	});
	return false;
}

var chatroom = new ChatRoom($('chat'));

