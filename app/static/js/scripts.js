document.addEventListener("DOMContentLoaded", () => {
    // Element selectors
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const showSidebarButton = document.getElementById('show-sidebar');
    const sidebar = document.getElementById('sidebar');
    const newChatButton = document.getElementById('new-chat-button');
    const chatList = document.getElementById('chat-list');
    const voiceButton = document.getElementById('voice-button');
    const audioPlayback = document.getElementById('audio-playback');
    const predefinedQuestions = document.getElementById('predefined-questions');
    const ageGroupSelect = document.getElementById('age-group');
    const genderSelect = document.getElementById('gender');
    const languageSelect = document.getElementById('language');
    const aiImage = document.querySelector('.ai');
    const aiVideo = document.getElementById('ai-video');
    const chatContainer = document.querySelector('.chat-container');
    let chatCount = 1;
    let currentChatId = null;
    const chats = {}; // To store chat states

    // Define predefined questions based on age and language
    const questions = {
        '10-18': {
            'english': [
                "What's the best way to start investing?",
                "How do I save money as a teenager?",
            ],
            'hindi': [
                "निवेश शुरू करने का सबसे अच्छा तरीका क्या है?",
                "एक किशोर के रूप में पैसे कैसे बचाएं?",
            ],
            'malayalam': [
                "നിക്ഷേപം ആരംഭിക്കുന്നതിനുള്ള മികച്ച മാർഗം എന്താണ്?",
                "താരതമ്യേന ചെറുതായ ഒരു ആളായാൽ പണം എങ്ങനെ കണ്ടെത്താം?",
            ]
        },
        '19-35': {
            'english': [
                "What are some effective investment strategies?",
                "How do I build an emergency fund?",
            ],
            'hindi': [
                "कुछ प्रभावी निवेश रणनीतियाँ क्या हैं?",
                "मैं आपातकालीन कोष कैसे बनाऊं?",
            ],
            'malayalam': [
                "കൂടെ ചില ഫലപ്രദമായ നിക്ഷേപ തന്ത്രങ്ങൾ എന്താണ്?",
                "എങ്ങനെ ഒരു അടിയന്തര ഫണ്ട് നിർമ്മിക്കാം?",
            ]
        },
        '36+': {
            'english': [
                "How can I optimize my retirement savings?",
                "What are the best ways to diversify my investments?",
            ],
            'hindi': [
                "मैं अपनी रिटायरमेंट बचत को कैसे ऑप्टिमाइज़ कर सकता हूँ?",
                "मेरे निवेशों को विविध बनाने के लिए सबसे अच्छे तरीके कौन से हैं?",
            ],
            'malayalam': [
                "എങ്ങനെ എന്റെ വിരമിക്കൽ പണവുമായി മികച്ച രീതിയിൽ കൈകാര്യം ചെയ്യാം?",
                "എന്റെ നിക്ഷേപങ്ങളെ വൈവിധ്യമാക്കാൻ മികച്ച മാർഗങ്ങൾ എന്തെല്ലാം?",
            ]
        }
    };

    // Update predefined questions based on selected age and language
    function updatePredefinedQuestions() {
        const age = ageGroupSelect.value;
        const language = languageSelect.value;
        const questionList = questions[age][language];

        predefinedQuestions.innerHTML = ''; // Clear existing questions
        questionList.forEach(question => {
            const button = document.createElement('button');
            button.classList.add('question-btn');
            button.textContent = question;
            button.addEventListener('click', () => {
                appendMessage(question, 'user');
                predefinedQuestions.style.display = 'none'; // Hide predefined questions
                sendMessage(question);
            });
            predefinedQuestions.appendChild(button);
        });

        predefinedQuestions.style.display = 'block'; // Ensure predefined questions are visible
    }

    // Update predefined questions on selection change
    ageGroupSelect.addEventListener('change', updatePredefinedQuestions);
    languageSelect.addEventListener('change', updatePredefinedQuestions);

    // Define video mapping based on age and gender
    const videoMapping = {
        '10-18': {
            'male': '/static/assets/teen.mp4',
            'female': '/static/assets/teen.mp4'
        },
        '19-35': {
            'male': '/static/assets/teen.mp4',
            'female': '/static/assets/adult_female.mp4'
        },
        '36+': {
            'male': '/static/assets/senior_male.mp4',
            'female': '/static/assets/senior_female.mp4'
        }
    };

    // Get video URL based on selected age group and gender
    function getVideoUrl(ageGroup, gender) {
        return videoMapping[ageGroup]?.[gender] || null; // Return null if no matching video URL is found
    }

    // Update video based on selected age group and gender
    function updateVideo() {
        const selectedAgeGroup = ageGroupSelect.value;
        const selectedGender = genderSelect.value;
        const videoUrl = getVideoUrl(selectedAgeGroup, selectedGender);
            alert(videoUrl);
        if (videoUrl) {
            showVideoAndPlay(videoUrl);
        }
    }

    // Show and play video
    function showVideoAndPlay(url) {
        aiImage.style.display = 'none';
        aiVideo.style.display = 'block';
        aiVideo.src = url;
        aiVideo.load(); // Ensure video element reloads the source
        aiVideo.play().catch(error => {
            console.error('Error playing video:', error);
        });

        aiVideo.onended = () => {
            aiVideo.style.display = 'none';
            aiImage.style.display = 'block';
        };

        audioPlayback.onended = () => {
            aiVideo.style.display = 'none';
            aiImage.style.display = 'block';
        };
    }

    // Send message and handle response
    function sendMessage(message) {
        fetch('/process_input', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: message })
        })
        .then(response => response.json())
        .then(data => {
            appendMessage(data.translated_text, 'user');
            appendMessage(data.response, 'ai');
            appendMessage(data.native_response, 'native');

            // Show video and play it
            const videoUrl = getVideoUrl(ageGroupSelect.value, genderSelect.value);
            showVideoAndPlay(videoUrl);

            // Play audio
            audioPlayback.src = data.audio_url;
            audioPlayback.play();
        });
    }

    // Append message to chat window
    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        messageBubble.textContent = message;

        messageElement.appendChild(messageBubble);
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        if (currentChatId) {
            chats[currentChatId].messages.push({ text: message, sender });
        }
    }

    // Create a new chat
    function createNewChat() {
        const chatId = `${chatCount++}`;
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-list-item');
        chatItem.textContent = `New Chat ${chatId}`;
        chatItem.addEventListener('click', () => switchToChat(chatId));

        chatList.appendChild(chatItem);
        chats[chatId] = {
            messages: [],
            ageGroup: ageGroupSelect.value,
            gender: genderSelect.value,
            language: languageSelect.value
        };
        switchToChat(chatId);
    }

    // Switch to a specific chat
    function switchToChat(chatId) {
        currentChatId = chatId;
        chatWindow.innerHTML = ''; // Clear the chat window
        const chatState = chats[chatId];

        if (chatState) {
            chatState.messages.forEach(message => appendMessage(message.text, message.sender));
            ageGroupSelect.value = chatState.ageGroup;
            genderSelect.value = chatState.gender;
            languageSelect.value = chatState.language;
            updatePredefinedQuestions();
            updateVideo(); // Update video based on saved state
        }
    }

    // Event listeners for buttons
    newChatButton.addEventListener('click', createNewChat);

    voiceButton.addEventListener('click', () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                let audioChunks = [];
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'audio.wav');

                    fetch('/process_input', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        appendMessage(data.translated_text, 'user');
                        appendMessage(data.response, 'ai');
                        appendMessage(data.native_response, 'native');
                        audioPlayback.src = data.audio_url;
                        audioPlayback.play();
                    });
                };

                setTimeout(() => mediaRecorder.stop(), 5000);
            });
        } else {
            alert('Audio recording is not supported in this browser.');
        }
    });

    // Toggle sidebar visibility
    toggleSidebarButton.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
        showSidebarButton.classList.toggle('hidden2');
        if (sidebar.classList.contains('hidden')) {
            chatContainer.style.width = '100%';
            showSidebarButton.style.display = 'block';
        } else {
            chatContainer.style.width = 'calc(100% - 250px)';
            showSidebarButton.style.display = 'none';
        }
    });

    // Show sidebar when button is clicked
    showSidebarButton.addEventListener('click', () => {
        sidebar.classList.remove('hidden');
        showSidebarButton.classList.add('hidden2');
        chatContainer.style.width = 'calc(100% - 250px)';
        showSidebarButton.style.display = 'none';
    });

    // Send message when send button is clicked
    sendButton.addEventListener('click', () => {
        const userMessage = userInput.value.trim();
        if (userMessage !== "") {
            appendMessage(userMessage, 'user');
            userInput.value = '';
            predefinedQuestions.style.display = 'none'; // Hide predefined questions
            sendMessage(userMessage);
        }
    });

    // Send message when Enter key is pressed
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });

    // Initial setup
    updatePredefinedQuestions();
});
