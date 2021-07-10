const socket = io('/') // This means your client will always be connected to your server, locally or on Heroku.

const chatBox = document.getElementById('chatBox')
const messageEl = document.getElementById('message')
const errorContainer = document.getElementById('errMsg')
const user = document.getElementById('user')
const date = new Date() // Date implementation

socket.on('newMessage', (data) => {
    addMessage(data, false);
});

socket.on('userJoin', (data) => {
    userConnected(data, false);
});

const getPastMessages = async(data) => {
    fetch('/fetch')
        .then(res => res.json())
        .then(msgs => {
            // console.log(msgs);
            for (var i = 0; i < msgs.length; i++) {
                var message = msgs[i]['message'];
                var from = msgs[i]['from'];
                var time = msgs[i]['time'];
                var currentUser = false;
                if (user.value == from) {
                    currentUser = true;
                }
                var data = { message, from, time };
                addMessage(data, currentUser)
            }
        })


    // console.log(response);
}
getPastMessages();

// A simple function to format the time as a string
const getTime = () => {
    const d = new Date();

    // Use String.padStart to add leading zeroes
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');

    // Return the time as a string
    return `${hours}:${mins}`;
};

// Post message to board
const postMessage = () => {
    // Get input values from the page
    const message = messageEl.value.trim();
    errorContainer.innerHTML = '';
    if (!message || message.trim() === '') {
        errorContainer.innerHTML = '<span class="notice">Message cannot be empty!</span>';
        return;
    }
    const from = user.value;
    const time = getTime();

    const data = { message, from, time };

    // Emit the message
    socket.emit('message', data);
    const postData = fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    // Add the message to the page
    addMessage(data, true);

    // Clear input
    messageEl.value = '';
};

const userConnected = (data = {}, user = false) => {
    // Add the message to the page
    chatBox.innerHTML += `
            <li class="welcome">
                ${data.time}: >> 
                ${data.message}
            </li>
            `;

};

// Add message from any user to chatbox, determine if added
// by current user.
const addMessage = (data = {}, user = false) => {
    // Add an li to the page containing the new message
    // Give it the uMessage class if from the current user
    chatBox.innerHTML += `
      <li class="message${user ? ' uMessage' : ''}">
          ${data.from} @${data.time}:<br/> ${data.message}
      </li>
      `;
};