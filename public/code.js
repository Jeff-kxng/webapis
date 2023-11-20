// client.js

document.addEventListener('DOMContentLoaded', function () {
    const socket = io();

    let username;
    const joinButton = document.getElementById('join-user');
    const sendMessageButton = document.getElementById('send-message');
    const exitChatButton = document.getElementById('exit-chat');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.getElementById('messages');

    joinButton.addEventListener('click', function () {
        username = document.getElementById('username').value;
        if (username.length === 0) {
            return;
        }
        socket.emit('newuser', username);
        document.querySelector('.join-screen').classList.remove('active');
        document.querySelector('.chat-screen').classList.add('active');
    });

    sendMessageButton.addEventListener('click', function () {
        const message = messageInput.value;
        if (message.length === 0) {
            return;
        }
        renderMessage('my', { username: username, text: message });
        socket.emit('chat', { username: username, text: message });
        messageInput.value = '';
    });

    exitChatButton.addEventListener('click', function () {
        socket.emit('exituser', username);
        window.location.href = window.location.href;
    });

    socket.on('update', function (update) {
        renderMessage('update', update);
    });

    socket.on('chat', function (message) {
        renderMessage('other', message);
    });

    function renderMessage(type, message) {
        const timestamp = new Date().toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true // Include AM/PM
        });

        if (type === 'my') {
            messagesContainer.innerHTML += `
                <div class="message my-message">
                    <div class="name">You</div>
                    <div class="timestamp">${timestamp}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type === 'other') {
            messagesContainer.innerHTML += `
                <div class="message other-message">
                    <div class="name">${message.username}</div>
                    <div class="timestamp">${timestamp}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
        } else if (type === 'update') {
            messagesContainer.innerHTML += `
                <div class="update">${message}</div>
            `;
        }
        messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
    }
});