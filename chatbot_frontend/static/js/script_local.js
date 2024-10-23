// JS Script for AqarAI Chatbot

// Prompt Buttons: List of Queries for Initial Prompt Buttons
const allQueries = [
    "Share some renting financial advice.",
    "Explain Freehold vs Leasehold.",
    "Can foreigners buy property in Dubai?",
    "Process of buying a property in Dubai?",
    "Average rent for a 3BHK in Marina?",
    "Best areas to invest?",
    "Top developers in UAE?",
    "What does ROI mean?",
    "What's a good down payment?",
    "How's the real estate market?",
    "Can I rent short term?"
];

// Arabic detection
function isRTL(text) { 
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB70-\uFCFF\uFE70-\uFEFF]/.test(text);
}

// Cookie functions 
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

// Fetch and display chat history
function loadChat(chatID) {
    setCookie('chatID', chatID, 7); 
    fetch(`http://127.0.0.1:4500/chat/${chatID}`, {
        method: 'GET',
        credentials: 'include', 
    })
    .then(response => response.json())
    .then(data => {
        if (data.chat_history) {
            displayChatHistory(data.chat_history, data.AI_sugg, true); 
        } else {
            console.error('Chat not found');
        }
    })
    .catch(error => console.error('Error fetching chat:', error));
}

function displayChatHistory(chatHistory, AIsuggestions, isExistingChat) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; 

    const botImage = document.createElement('img');
    botImage.src = 'static/images/bot_home.png'; 
    botImage.alt = 'bot';
    messagesDiv.appendChild(botImage);
    addGreeting('Hello! I am the Aqar AI ChatBot. How may I assist you today with your real-estate needs?');

    const cleanSuggestions = AIsuggestions
        .replace(/^\s*[\d\.\-\*]+\s+/gm, '') 
        .replace(/^\s*\-\s+/gm, '') 
        .replace(/^\s*\*\s+/gm, '') 
        .trim(); 

    // Process suggestions
    const suggestions = cleanSuggestions.split('\n').map(q => q.trim()).filter(q => q.length > 0);
    document.getElementById('fab-container').style.display = 'flex';

    const questionButtonsDiv = document.getElementById('question-buttons');
    questionButtonsDiv.innerHTML = ''; 
    suggestions.forEach(suggestion => {
        const button = document.createElement('button');
        button.classList.add('queryButton');
        button.setAttribute('data-query', suggestion);
        button.textContent = suggestion;
        button.addEventListener('click', function() {
            sendQuery(suggestion);
            questionButtonsDiv.innerHTML = ''; 
        });
        questionButtonsDiv.appendChild(button);
    });

    chatHistory.forEach(msg => {
        const sender = msg.type === 'user' ? 'user' : 'ai';
        const content = marked.parse(msg.content);
        
        if (sender === 'ai' && isRTL(content)) {
            addMessageToChat('AR', content, true); 
        } else if (sender === 'user' && isRTL(content)) {
            addMessageToChat('userAR', content, true); 
        } else {
            addMessageToChat(sender, content, true); 
        }
    });

    document.getElementById('chatbox').style.display = 'flex';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    if (isExistingChat) {
        hidePreTypedButtons(); 
    } else {
        showPreTypedButtons(); 
    }
}

// Sidebar Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarContent = document.getElementById('sidebar-content');
    const sidebarButton = document.getElementById('sidebar-btn');
    const overlay = document.getElementById('overlay');
    const newConvo = document.getElementById('new-convo-btn');
    const sidebarLogo = document.querySelector('.sidebar_header img')
    
    sidebarToggle.addEventListener('click', function() {
        if (sidebar.style.left === '0px') { // close
            sidebar.style.left = '-250px'; 
            overlay.style.display = 'none';
        } else { // open
            sidebar.style.left = '0px'; 
            overlay.style.display = 'block';
            populateSidebar();
        }
    });

    // if u click in between buttons, it closes but idk how to make it just the button
    sidebarContent.addEventListener('click', function() {
        if (sidebar.style.left === '0px') { // close
            sidebar.style.left = '-250px'; 
            overlay.style.display = 'none';
        } else { // open
            sidebar.style.left = '0px'; 
            overlay.style.display = 'block';
            populateSidebar();
        }
    });

    newConvo.addEventListener('click', function() {
        if (sidebar.style.left === '0px') { // close
            sidebar.style.left = '-250px'; 
            overlay.style.display = 'none';
        } else { // open
            sidebar.style.left = '0px'; 
            overlay.style.display = 'block';
            populateSidebar();
        }
    });

    sidebarLogo.addEventListener('click', function() {
        if (sidebar.style.left === '0px') { // close
            sidebar.style.left = '-250px'; 
            overlay.style.display = 'none';
        } else { // open
            sidebar.style.left = '0px'; 
            overlay.style.display = 'block';
            populateSidebar();
        }
    });

    overlay.addEventListener('click', function() {
        if (overlay.style.display === 'block') { // open
            sidebar.style.left = '-250px'; 
            overlay.style.display = 'none';
        }
    });

});

// Toggle Chatbot Functionality
function toggleChatbot() {
    const chatbotPopup = document.getElementById('chatbox');
    const toggleButton = document.getElementById('chatbot-toggle-btn');

    if (chatbotPopup.style.display === 'none' || chatbotPopup.style.display === '') {
        chatbotPopup.style.display = 'flex';
        toggleButton.style.display = 'none';
    } else {
        chatbotPopup.style.display = 'none';
        toggleButton.style.display = 'block';
    }
}

// Functions to create Initial Prompt Buttons
function getRandomQueries(queries) {
    const x = queries.sort(() => 0.5 - Math.random());
    return x.slice(0, 3);
}

function hidePreTypedButtons() {
    document.getElementById('pre-typed-buttons').style.display = 'none';
}

function showPreTypedButtons() {
    const preTypedButtonsDiv = document.getElementById('pre-typed-buttons');
    preTypedButtonsDiv.style.display = 'flex';
}

function generateQueryButtons() {
    const preTypedButtonsDiv = document.getElementById('pre-typed-buttons');
    preTypedButtonsDiv.innerHTML = '';

    const randomQueries = getRandomQueries(allQueries);

    randomQueries.forEach(query => {
        const button = document.createElement('button');
        button.classList.add('queryButton');
        button.setAttribute('data-query', query);
        button.textContent = query;
        button.addEventListener('click', function() {
            sendQuery(query);
            hidePreTypedButtons();
        });
        preTypedButtonsDiv.appendChild(button);
    });
}

let isGenerating = false;

// Sending user message functionality
function sendMessage() {
    if (isGenerating) return;

    const inputBox = document.getElementById('input-box');
    const query = inputBox.value.trim();
    if (query) {
        sendQuery(query);
        inputBox.value = '';
        hidePreTypedButtons();
    }
}

// Variables for disabling feature
const sendButton = document.getElementById('send-button');
const clearButton = document.getElementById('clear-btn');
const inputBox = document.getElementById('input-box');
const fabButton = document.getElementById('fab-btn');

// Function to handle storing user data in local storage
function storeUserData(userID, chatID, email, phone) {
    localStorage.setItem('userID', userID);
    localStorage.setItem('chatID', chatID);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPhone', phone);
}

// const userName = localStorage.getItem('userEmail');
// const userNameBeforeAt = userName.split('@')[0];
// const userNameF = userNameBeforeAt.charAt(0).toUpperCase() + userNameBeforeAt.slice(1);

// if (userName) {
//     document.getElementById('user-id').textContent = userNameF;
// } else {
//     console.log('No user name found in local storage');
// }

// Function to process query
function sendQuery(query) {
    if (isGenerating) return;

    const chatID = localStorage.getItem('chatID');
    const chatHistory = sessionStorage.getItem('chatHistory') || []; 
    

    hidePreTypedButtons();

    sendButton.disabled = true;
    clearButton.disabled = true;
    fabButton.disabled = true;
    isGenerating = true;

    if (isRTL(query)) {
        addMessageToChat('userAR', query);
    } else {
        addMessageToChat('user', query);
    }

    const thinkingBubble = addThinkingBubble();

    fetch('http://127.0.0.1:4500/chat', { 
        method: 'POST',
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, chatID, chatHistory }) 
    })
    .then(response => response.json())
    .then(data => {
        if (data.response) {
            const responseText = data.response;
            const suggestionsText = data.suggestions;
            const authenticatedBool = data.authenticated;

            const userID = data.userID || '';
            const chatID = data.chatID || '';
            setCookie('chatID', chatID, 7); 

            const userEmail = data.email || '';
            const userPhone = data.phone || '';

            storeUserData(userID, chatID, userEmail, userPhone);

            if (authenticatedBool === 0) {
                document.getElementById('fab-container').style.display = 'flex';
            } else {
                document.getElementById('fab-container').style.display = 'none';
            }
            
            const cleanSuggestions = suggestionsText
                // Remove any numbered or bulleted lists
                .replace(/^\s*[\d\.\-\*]+\s+/gm, '') 
                .replace(/^\s*\-\s+/gm, '') 
                .replace(/^\s*\*\s+/gm, '') 
                .trim(); 

            // Process suggestions
            const suggestions = cleanSuggestions.split('\n').map(q => q.trim()).filter(q => q.length > 0);
            document.getElementById('fab-container').style.display = 'flex';

            // Display the response content
            const htmlContent = marked.parse(responseText);
            removeThinkingBubble(thinkingBubble);

            if (isRTL(htmlContent)) {
                addMessageToChat('AR', htmlContent, true);
            } else {
                addMessageToChat('ai', htmlContent, true);
            }

            // Generate question buttons
            const questionButtonsDiv = document.getElementById('question-buttons');
            questionButtonsDiv.innerHTML = ''; 
            suggestions.forEach(suggestion => {
                const button = document.createElement('button');
                button.classList.add('queryButton');
                button.setAttribute('data-query', suggestion);
                button.textContent = suggestion;
                button.addEventListener('click', function() {
                    sendQuery(suggestion);
                    questionButtonsDiv.innerHTML = ''; 
                });
                questionButtonsDiv.appendChild(button);
            });

            // Update session's chat history
            sessionStorage.setItem('chatHistory', JSON.stringify(data.chat_history));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        removeThinkingBubble(thinkingBubble);
    })
    .finally(() => {
        sendButton.disabled = false;
        clearButton.disabled = false;
        fabButton.disabled = false;
        isGenerating = false;
    });
}

// Thinking bubble for when AI is generating response
let thinkingInterval;

function addThinkingBubble() {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'ai', 'thinking');

    const messageContentDiv = document.createElement('div');
    messageContentDiv.classList.add('message-content', 'ai');
    messageContentDiv.textContent = 'Thinking';

    messageDiv.appendChild(messageContentDiv);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    let dotCount = 0;
    thinkingInterval = setInterval(() => {
        dotCount = (dotCount % 3) + 1;
        messageContentDiv.textContent = 'Thinking' + '.'.repeat(dotCount);
    }, 500);

    return messageDiv;
}

function removeThinkingBubble(bubble) {
    clearInterval(thinkingInterval);
    if (bubble && bubble.parentNode) {
        bubble.parentNode.removeChild(bubble);
    }
}

// Clear chat history functionality
function clearChat() {
    if (isGenerating) return;

    sendButton.disabled = true;
    clearButton.disabled = true;

    fetch('http://127.0.0.1:4500/clear_chat', {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML = '';

            const botImage = document.createElement('img');
            botImage.src = 'static/images/bot_home.png';
            botImage.alt = 'bot';
            messagesDiv.appendChild(botImage);
            
            addGreeting('A new chat has been created! How may I assist you today with your real-estate needs?');
            
            document.getElementById('fab-container').style.display = 'none';
            generateQueryButtons();
            showPreTypedButtons();
        }
    })
    .catch(error => console.error('Error:', error))
    .finally(() => {
        sendButton.disabled = false;
        clearButton.disabled = false;
        fabButton.disabled = false;
        isGenerating = false;
    });
}

// Displaying messages
function addMessageToChat(sender, content, isMarkdown = false) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const messageContentDiv = document.createElement('div');
    messageContentDiv.classList.add('message-content', sender);

    if (isMarkdown) {
        messageContentDiv.innerHTML = content; 
    } else {
        messageContentDiv.textContent = content; 
    }

    messageDiv.appendChild(messageContentDiv);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Displaying the greeting message 
function addGreeting(message) {
    const messagesDiv = document.getElementById('messages');
    const greetingDiv = document.createElement('div');
    greetingDiv.classList.add('botgreeting');

    const greetingContent = document.createElement('button');
    greetingContent.id = 'greeting';
    greetingContent.textContent = message;

    greetingDiv.appendChild(greetingContent);
    messagesDiv.appendChild(greetingDiv);
}

// Variables for Terms and Conditions Modal
const termsModal = document.getElementById('terms-modal');
const termsLink = document.getElementById('terms-link');
const termsModalClose = document.getElementById('terms-modal-close');

termsLink.addEventListener('click', () => {
    termsModal.style.display = 'block';
});

termsModalClose.addEventListener('click', () => {
    termsModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === termsModal) {
        termsModal.style.display = 'none';
    }
});

// Updating the chat name after rename
function updateChatName(chatId, button) {
    const iconContainer = button.querySelector('.icon-container');
    
    fetch(`http://127.0.0.1:4500/get_chat_name/${chatId}`, {
        method: 'GET',
        credentials: 'include' // Include credentials (cookies) in the request
    })
    .then(response => response.json())
    .then(chatData => {
        const currentName = chatData.name || 'Unnamed Chat';

        showInputModal(function(newName) {
            fetch('http://127.0.0.1:4500/update_chat_name', {
                method: 'POST',
                credentials: 'include', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, name: newName })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    button.innerHTML = ''; 
                    const nameContainer = document.createElement('div');
                    nameContainer.className = 'chat-name-container'; 
                    nameContainer.textContent = newName;
                    button.appendChild(nameContainer);
                    
                    if (iconContainer) {
                        button.appendChild(iconContainer);
                    }

                    button.classList.add('sidebar-btn');
                } else {
                    alert('Failed to update chat name.');
                }
            })
            .catch(error => console.error('Error updating chat name:', error));
        }, currentName);
    })
    .catch(error => console.error('Error fetching chat name:', error));
}

// Add rename and delete listeners to a chat button
function addRenameAndDeleteListeners(button, chatId) {
    const iconContainer = document.createElement('div');
    iconContainer.className = 'icon-container';

    // Create the rename icon
    const renameIcon = document.createElement('span');
    renameIcon.className = 'rename-icon';
    const renameImg = document.createElement('img');
    renameImg.src = 'static/images/edit-icon-1022x1024-kes437mc.png';
    renameImg.width = 12;
    renameImg.height = 12;
    renameImg.title = 'Rename Chat';
    renameIcon.appendChild(renameImg);

    // Create the delete icon
    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'delete-icon';
    const deleteImg = document.createElement('img');
    deleteImg.src = 'static/images/trash-2-xxl.png';
    deleteImg.width = 12;
    deleteImg.height = 12;
    deleteImg.title = 'Delete Chat';
    deleteIcon.appendChild(deleteImg);

    iconContainer.appendChild(renameIcon);
    iconContainer.appendChild(deleteIcon);

    button.appendChild(iconContainer);

    // Listener for renaming
    renameIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        updateChatName(chatId, button);

    });

    // Listener for deletion
    deleteIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        deleteChat(chatId, button);
    });
}

// Variables for Confirmation Modal
const confirmModal = document.getElementById('confirm-modal');
const confirmMessage = document.getElementById('confirm-message');
const confirmYesButton = document.getElementById('confirm-yes');
const confirmNoButton = document.getElementById('confirm-no');
const modalClose = document.querySelector('.modal-close');

let confirmCallback = null;

function showConfirmModal(message, callback) {
    confirmMessage.textContent = message;
    confirmModal.style.display = 'block';
    confirmCallback = callback;
}

function hideConfirmModal() {
    confirmModal.style.display = 'none';
}

confirmYesButton.addEventListener('click', function() {
    hideConfirmModal();
    if (confirmCallback) confirmCallback();
});

confirmNoButton.addEventListener('click', function() {
    hideConfirmModal();
});

modalClose.addEventListener('click', function() {
    hideConfirmModal();
});

confirmModal.addEventListener('click', function() {
    hideConfirmModal();
});

// Input Modal
const inputModal = document.getElementById('input-modal');
const inputModalClose = document.getElementById('input-modal-close');
const inputSubmit = document.getElementById('input-submit');
const inputCancel = document.getElementById('input-cancel');
const inputField = document.getElementById('input-field');

function showInputModal(callback, initialValue = '') {
    inputModal.style.display = 'block';
    inputField.value = initialValue; 
    inputSubmit.onclick = function() {
        const userInput = inputField.value.trim();
        if (userInput) {
            callback(userInput);
            hideInputModal();
        }
    };
    inputCancel.onclick = hideInputModal;

    inputField.focus();
}

function hideInputModal() {
    inputModal.style.display = 'none';
    inputField.value = '';
}

inputModalClose.addEventListener('click', hideInputModal);
window.addEventListener('click', function(event) {
    if (event.target === inputModal) {
        hideInputModal();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && inputModal.style.display === 'block') {
        event.preventDefault();
        const userInput = inputField.value.trim();
        if (userInput) {
            inputSubmit.click();
        } else {
            hideInputModal();
        }
    }
});

function hideInputModal() {
    inputModal.style.display = 'none';
    inputField.value = '';
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && inputModal.style.display === 'block') {
        event.preventDefault();
        const userInput = inputField.value.trim();
        if (userInput) {
            inputSubmit.click();
        } else {
            hideInputModal();
        }
    }
});

inputModalClose.addEventListener('click', hideInputModal);
window.addEventListener('click', function(event) {
    if (event.target === inputModal) {
        hideInputModal();
    }
});

// Deleting the chat
function deleteChat(chatId, button) {
    showConfirmModal('Are you sure you want to delete this chat permanently?', function() {
        fetch(`http://127.0.0.1:4500/delete_chat/${chatId}`, {
            method: 'POST',
            credentials: 'include' 
        })
        .then(response => response.json())
        .then(data => {
            if (data.msg === "deleted") {
                if (button) {
                    button.remove();
                }
                populateSidebar();
            } else {
                console.error('Failed to delete chat.');
            }
        })
        .catch(error => console.error('Error deleting chat:', error));
    });
}

// Deleting all chats
function deleteAllChats() {
    showConfirmModal('Are you sure you want to delete ALL chats permanently?', function() {
        fetch(`http://127.0.0.1:4500/delete_all`, { 
            method: 'POST',
            credentials: 'include' 
        })
            .then(response => response.json())
            .then(data => {
                if (data.msg === "All chats deleted") {
                    populateSidebar();
                } else {
                    console.error('Failed to delete all chats.');
                }
            })
            .catch(error => console.error('Error deleting all chats:', error));
    });
}

const deleteAll = document.getElementById('delete-all-btn');
deleteAll.addEventListener('click', function(event) {
    event.stopPropagation();
    deleteAllChats();
});

// Displaying all chats in sidebar
function populateSidebar() {
    fetch('http://127.0.0.1:4500/chat_ids', {
        method: 'GET',
        credentials: 'include' 
    })
        .then(response => response.json())
        .then(data => {
            const sidebarContent = document.getElementById('sidebar-content');
            sidebarContent.innerHTML = '';

            // Placeholder for empty sidebar
            const placeholder = document.createElement('div');
            placeholder.id = 'no-history-placeholder';
            placeholder.className = 'sidebar-placeholder';
            placeholder.textContent = 'Chat history will be displayed here';

            const existingChatIds = new Set();

            // const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date)); 
            const sortedData = data.sort((a, b) => b.id - a.id); 


            function createButton(chat) {
                if (existingChatIds.has(chat.id)) return;
                existingChatIds.add(chat.id);

                const button = document.createElement('button');
                button.className = 'sidebar-btn';
                button.setAttribute('data-chat-id', chat.id);

                const nameContainer = document.createElement('div');
                nameContainer.className = 'chat-name-container'; 

                fetch(`http://127.0.0.1:4500/get_chat_name/${chat.id}`, {
                    method: 'GET',
                    credentials: 'include' // Include credentials (cookies) in the request
                })
                    .then(response => response.json())
                    .then(chatData => {
                        const chatName = chatData.name || 'Unnamed Chat';
                        nameContainer.textContent = chatName;
                    })
                    .catch(error => console.error('Error fetching chat name:', error));

                button.appendChild(nameContainer);

                button.addEventListener('click', function () {
                    localStorage.setItem('chatID', chat.id);
                    loadChat(chat.id);
                });

                addRenameAndDeleteListeners(button, chat.id);
                sidebarContent.appendChild(button);
            }

            if (data.length === 0) {
                sidebarContent.appendChild(placeholder); // placeholder if no chats
            } else {
                sortedData.forEach(chat => createButton(chat)); 
            }
        })
        .catch(error => console.error('Error fetching chat IDs:', error));
}

// Main:
document.getElementById('chatbot-toggle-btn').addEventListener('click', toggleChatbot);
document.getElementById('close-btn').addEventListener('click', toggleChatbot);
document.getElementById('chatbox').style.display = 'none';

generateQueryButtons();
addGreeting('Hello! I am the Aqar AI ChatBot. How may I assist you today with your real-estate needs?');

document.addEventListener('DOMContentLoaded', () => {
    sendButton.disabled = false;
    clearButton.disabled = false;
    fabButton.disabled = false;
});

document.getElementById('send-button').addEventListener('click', sendMessage);

inputBox.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

document.getElementById('new-convo-btn').addEventListener('click', clearChat);
document.getElementById('clear-btn').addEventListener('click', clearChat);

document.addEventListener('DOMContentLoaded', function() {
    const chatID = getCookie('chatID');
    if (chatID) {
        loadChat(chatID);
        localStorage.setItem('chatID', chatID);
    }
});

