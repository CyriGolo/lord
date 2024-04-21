const button = document.querySelector('#createChannel');

function escapeHtml(text) {
    let map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

button.addEventListener('click', () => {
    const title = document.querySelector('#title').value;
    const message = document.querySelector('#message').value;
    if(title && message){
        fetch('http://localhost:3000/create-channel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, message }),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('Failed to send channel creation request');
            }
        })
        .then(data => {
            const { threadId } = data;
            startChat(title, message, threadId);
        })
        .catch(error => {
            console.error('Error sending channel creation request:', error);
        });
    }
});

async function startChat(title, message, threadId) {
    document.querySelector('#app').innerHTML = `
        <h2 style="border-bottom: 1.5px solid #0f3250;padding-bottom: 1rem;">${escapeHtml(title)}<br> #${escapeHtml(threadId)}</h2>
        <div class="chat">
            <ul id="chatMessage">
                <li class="me">
                    <div class="message">
                        <p class="person">Me</p>
                        <p>${escapeHtml(message)}</p>
                    </div>
                </li>
            </ul>
            <div class="new">
                <div id="newMessage" contentEditable></div>
                <button id="sendMessage">📤</button>
            </div>
        </div>
    `;

    
    setInterval(updateChat, 1000);

    const newMessage = document.querySelector('#newMessage');
    const sendMessage = document.querySelector('#sendMessage');

    sendMessage.addEventListener('click', async () => {
        const newMessageContent = newMessage.textContent;
        if(newMessageContent){
            newMessage.textContent = '';
            await fetch('http://localhost:3000/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: newMessageContent }),
            })
            .then(response => {
                if (response.ok) {
                    console.log('Message sent successfully');
                } else {
                    console.error('Failed to send message');
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
        };
    });
};


async function getMessages() {
    try {
        const response = await fetch('http://localhost:3000/get-messages');
        if (response.ok) {
            const messages = await response.json();
            return messages;
        } else {
            console.error('Failed to fetch messages');
            return [];
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
}

async function updateChat() {
    const messages = await getMessages();
    const chatMessage = document.querySelector('#chatMessage');
    chatMessage.innerHTML = '';

    let lastDisplayedUser = '';
    for(let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message.author !== lastDisplayedUser) {
            chatMessage.innerHTML += `
                <li class="${message.author === "Lord's" ? "me" : "you"}" ${i !== (message.length - 1) ? 'style="margin-top: 1.3rem;"' : ""}>
                    <div class="message">
                        <p class="person">${escapeHtml(message.author === "Lord's" ? "Vous" : message.author)}</p>
                        <p>${escapeHtml(message.content)}</p>
                    </div>
                </li>
            `;
            lastDisplayedUser = message.author;
        } else {
            chatMessage.innerHTML += `
                <li class="${message.author === "Lord's" ? "me" : "you"}">
                    <div class="message">
                        <p>${escapeHtml(message.content)}</p>
                    </div>
                </li>
            `;
        }
    };
};