var ChatRoom = (function() {
	"use strict";
	
	function render() {
		
	};
	
	function init(container) {
		var messages, input, button;
		messages = document.createElement('div');
		messages.className = 'chat_messages c_abs c_fill';
		container.appendChild(messages);
		
		input = document.createElement('input');
		input.type = 'text';
		input.className = 'chat_input c_abs c_fill';
		input.onkeydown = handleKeyPresses.bind(this);
		container.appendChild(input);
		
		button = document.createElement('input');
		button.type = 'button';
		button.className = 'chat_send c_abs c_btn';
		button.value = 'send';
		button.onclick = submit.bind(this);
		container.appendChild(button);
		
		this.elements = {
			container: container,
			messages: messages,
			input: input,
			button: button,
			username: document.down('.chat_user')
		};
	};
	
	function setName(name) {
		this.username = name;
		this.elements.username.update(name);
	};
	
	function formatDate(date) {
		return date.getHours()+':'+date.getMinutes();
	};
	
	function appendMessage(sender, msg, date) {
		var senderEl, msgEl, rowEl, timeEl;
		rowEl = document.createElement('div');
		rowEl.className = 'chat_row c_striped';

		timeEl = document.createElement('span');
		timeEl.className = 'chat_time';
		timeEl.innerHTML = formatDate(date || new Date());
		rowEl.appendChild(timeEl);
		
		senderEl = document.createElement('span');
		senderEl.update(sender);
		senderEl.className = 'chat_sender';
		rowEl.appendChild(senderEl);
		
		msgEl = document.createElement('div');
		msgEl.className = 'chat_msg';
		msgEl.update(msg);
		rowEl.appendChild(msgEl);

		this.elements.messages.appendChild(rowEl);
	};
	
	function submit() {
		var text = this.elements.input.value;
		this.elements.input.value = '';
		this.appendMessage(this.username, text);
	};
	
	function handleKeyPresses(evt) {
		switch(evt.keyCode) {
			case 13: // enter
				this.submit();
				break;
			case 27: // esc
				this.elements.input.value = '';
				break;
		};
	};
	
	function ChatRoom() {
		this.init.apply(this, arguments);
	};
	ChatRoom.prototype = {
		init: init,
		submit: submit,
		appendMessage: appendMessage,
		setName: setName
	};
	return ChatRoom;
}());