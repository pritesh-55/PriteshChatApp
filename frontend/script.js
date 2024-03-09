const app = document.querySelector('.app')
const socket = io()
let uname; // This variable is taken jisse exit hote time username yaad rahe

app.querySelector('.join-screen #join-user').addEventListener('click',()=>{
    let username = app.querySelector('.join-screen #username').value
    if(username){
        socket.emit('newUser',username)
        uname = username
        app.querySelector('.join-screen').classList.remove('active')
        app.querySelector('.chat-screen').classList.add('active')
    }
    else alert('Please enter a valid Username')
})

app.querySelector('.chat-screen #exit-chat').addEventListener('click',()=>{
    app.querySelector('.chat-screen').classList.remove('active')
    app.querySelector('.join-screen').classList.add('active')
    // window.location.href = window.location.href    // Alternative of above 2 lines for changing screen
    socket.emit('exitUser',uname)
})

app.querySelector('.chat-screen #send-message').addEventListener('click',()=>{
    let message = app.querySelector('.chat-screen #message-input').value
    if(message){
        renderMessage('my',{
            username:uname,
            text:message
        })
        socket.emit('chat',{
            username:uname,
            text:message
        })
        app.querySelector('.chat-screen #message-input').value=""  //Msz send krne ke baad input field ko empty karne ke liye
    }
})

// Function which handles the data coming from socket events and how to represent it on screen based on different use cases 
function renderMessage(type,message){
    let messageContainer = app.querySelector('.chat-screen .messages')

    if(type=='my'){
        let myMsz = document.createElement('div')
        myMsz.setAttribute('class','message my-message')
        myMsz.innerHTML = `
            <div>
              <div class="name">You</div>
              <div class="text">${message.text}</div>
            </div>
        `
        messageContainer.appendChild(myMsz)
    }
    else if(type=='other'){
        let otherMsz = document.createElement('div')
        otherMsz.setAttribute('class','message other-message')
        otherMsz.innerHTML = `
            <div>
              <div class="name">${message.username}</div>
              <div class="text">${message.text}</div>
            </div>
        `
        messageContainer.appendChild(otherMsz)
    }
    else if(type=='update'){
        let updateMsz = document.createElement('div')
        updateMsz.setAttribute('class','update')
        updateMsz.innerText = message
        messageContainer.appendChild(updateMsz)
    }
    // Scroll chat to end
    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight
}

socket.on('update',(msz)=>{
    renderMessage('update',msz)
})

socket.on('chat',(msz)=>{
    renderMessage('other',msz)
})


