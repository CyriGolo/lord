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
            console.log('Channel creation request sent successfully');
        } else {
            console.error('Failed to send channel creation request');
        }
    })
    .catch(error => {
        console.error('Error sending channel creation request:', error);
    });
});
