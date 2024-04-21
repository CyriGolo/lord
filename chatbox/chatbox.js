const button = document.querySelector('#createChannel');

button.addEventListener('click', () => {
    const title = document.querySelector('#title').value;
    const message = document.querySelector('#message').value;
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
});

async function startChat(title, message, threadId) {
    document.querySelector('#app').innerHTML = `
        <h2>${title}<br> #${threadId}</h2> <!-- Utiliser l'ID du thread ici -->
        <div class="chat">
            <ul id="chatMessage">
                <li class="me">
                    <div class="message">
                        <p class="person">Me</p>
                        <p>${message}</p>
                    </div>
                </li>
            </ul>
            <div class="new">
                <div id="newMessage" contentEditable></div>
                <button id="sendMessage">Envoyez le message 📤</button>
            </div>
        </div>
    `;

    
    setInterval(updateChat, 1000);

    const newMessage = document.querySelector('#newMessage');
    const sendMessage = document.querySelector('#sendMessage');

    sendMessage.addEventListener('click', async () => {
        const newMessageContent = newMessage.textContent;
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

    messages.forEach(message => {
        chatMessage.innerHTML += `
            <li class="${message.author === "Lord's" ? "me" : "you"}">
                <div class="message">
                    <p class="person">${message.author === "Lord's" ? "Me" : message.author}</p>
                    <p>${message.content}</p>
                </div>
            </li>
        `;
    });
}