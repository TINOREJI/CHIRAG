document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const showSidebarButton = document.getElementById('show-sidebar');
    const sidebar = document.getElementById('sidebar');
    const newChatButton = document.getElementById('new-chat-button');
    const chatList = document.getElementById('chat-list');
    let chatCount = 1;

    toggleSidebarButton.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
        if (sidebar.classList.contains('hidden')) {
            document.querySelector('.chat-container').style.width = '100%';
        } else {
            document.querySelector('.chat-container').style.width = 'calc(100% - 250px)';
        }
    });

    showSidebarButton.addEventListener('click', () => {
        sidebar.classList.remove('hidden');
        document.querySelector('.chat-container').style.width = 'calc(100% - 250px)';
    });

    // newChatButton.addEventListener('click', () => {
    //     const newChatItem = document.createElement('div');
    //     newChatItem.classList.add('chat-list-item');
    //     newChatItem.textContent = `Chat ${chatCount++}`;
    //     chatList.appendChild(newChatItem);
    // });

    sendButton.addEventListener('click', () => {
        const userMessage = userInput.value.trim();
        if (userMessage !== "") {
            appendMessage(userMessage, 'user');
            userInput.value = '';
            getAiResponse(userMessage);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        messageBubble.textContent = message;

        messageElement.appendChild(messageBubble);
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function getRandomResponse() {
        const responses = [
            "Hello! How can I help you today?",
            "I'm here to assist you.",
            "What can I do for you?",
            "How's your day going?",
            "Feel free to ask me anything."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function getAiResponse(message) {
        // For demo purposes, we use a random response
        const aiResponse = getRandomResponse();
        appendMessage(aiResponse, 'ai');
    }
});



//  NEW CODE: 


let chatCount = 1;

        // Handle new chat button click
        const newChatButton = document.getElementById('new-chat-button');
        const chatList = document.getElementById('chat-list');

        newChatButton.addEventListener('click', () => {
            const newChatItem = document.createElement('div');
            newChatItem.classList.add('chat-list-item');
            newChatItem.textContent = `Chat ${chatCount++}`;
            chatList.appendChild(newChatItem);
        });

        // Handle send button click
        $('#send-button').click(function() {
            var query = $('#user-input').val();
            $.ajax({
                url: '/search',
                type: 'POST',
                data: { query: query },
                success: function(response) {
                    const chatWindow = document.getElementById('chat-window');
                    const message = document.createElement('div');
                    message.textContent = response.message;
                    chatWindow.appendChild(message);
                    chatWindow.scrollTop = chatWindow.scrollHeight;
                }
            });
        });