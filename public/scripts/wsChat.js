if (typeof jQuery === "undefined") {
    throw new Error("require jQuery");
}

$(function () {

    var FADE_TIME = 150;
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
    var $window = $(window);

    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.inputMessage'); // Input message input box

    var $userList = $('.userList');

    var username;
    var connected = false;
    $inputMessage.focus();

    function addUserList(userList) {
        userList = userList || [];
        $userList.children('li').remove();
        for (var i = 0; i < userList.length; i++) {
            addParticipantsElement({ username: userList[i] });
        }
    }


    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            var arr = document.cookie.split(';');
            var key, value;
            for (var key in arr) {
                value = arr[key].split('=')[0].trim();
                if (value == c_name) {
                    return arr[key].split('=')[1];
                }
            }
            arr.forEach(function (cookie) {

            });
        }
        return null;
    }

    function getUsernameColor(username) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    function sendMessage() {
        var message = $inputMessage.val();
        // Prevent markup from being injected into the message
        message = cleanInput(message);
        // if there is a non-empty message and a socket connection
        if (message && connected) {
            $inputMessage.val('');
            addChatMessage({
                username: username,
                message:  message
            });
            // tell server to execute 'new message' and send along one parameter
            socket.emit('new message', message);
        }
    }

    function cleanInput(input) {
        return $('<div/>').text(input).text();
    }

    function addChatMessage(data, options) {
        // Don't fade the message in if there is an 'X was typing'
        options = options || {};

        var $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));

        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);


        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    function addMessageElement(el, options) {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    function addParticipantsElement(data) {
        var $usernameDiv = $('<li/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));
        $userList.prepend($usernameDiv);
    }

    var socket = io(url);
    var cookie = getCookie('token');
    socket.emit('join', cookie);

    //输入事件
    $window.keydown(function (event) {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {

            $inputMessage.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            sendMessage();
        }
    });
    $inputMessage.click(function () {
        $inputMessage.focus();
    });

    socket.on('new message', function (data) {
        addChatMessage(data);
    });

    socket.on('login', function (name) {
        username = name || '';
        connected = true;
    });
    socket.on('user list', function (data) {
        addUserList(data);
        //addParticipantsMessage(data);
    });

});