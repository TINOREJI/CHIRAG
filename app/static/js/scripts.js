document.addEventListener("DOMContentLoaded", () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const showSidebarButton = document.getElementById('show-sidebar');
    const sidebar = document.getElementById('sidebar');
    const newChatButton = document.getElementById('new-chat-button');
    const chatList = document.getElementById('chat-list');
    const chatContainer = document.querySelector('.chat-container');
    const togglebtn = document.getElementById('toggle');

    toggleSidebarButton.addEventListener('click', toggleSide);

    function toggleSide() {
        sidebar.classList.toggle('hidden');
        if (sidebar.classList.contains('hidden')) {
            chatContainer.style.width = '100%';
            showSidebarButton.style.display = 'block';  // Show the button to reopen the sidebar
        } else {
            chatContainer.style.width = 'calc(100% - 250px)';
            showSidebarButton.style.display = 'none';  // Hide the button as the sidebar is already open
        }
    }

    showSidebarButton.addEventListener('click', () => {
        sidebar.classList.remove('hidden');
        chatContainer.style.width = 'calc(100% - 250px)';
        showSidebarButton.style.display = 'none';  // Hide the button as the sidebar is open
    });

    newChatButton.addEventListener('click', () => {
        const newChatItem = document.createElement('div');
        newChatItem.classList.add('chat-list-item');
        newChatItem.textContent = 'New Chat';
        chatList.appendChild(newChatItem);
    });

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

    function getAiResponse(message) {
        $.ajax({
            url: '/search',
            type: 'POST',
            data: { query: message },
            success: function(response) {
                appendMessage(response.message, 'ai');
            }
        });
    }
});
