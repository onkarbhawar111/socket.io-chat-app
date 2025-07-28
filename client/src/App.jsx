import './App.css'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000');

const App = () => {

  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/messages')
      .then((res) => setChat(res.data))
    socket.on('chatMessage', (msg) => setChat(prev => [...prev, msg]))

    return () => {
      socket.off('chatMessage')
    }
  }, [])

  const sendMessage = () => {
    if (message.trim() && username.trim()) {
      socket.emit('chatMessage', { username, text: message })
      setMessage('')
    }
  }

  return (
    <div>
      <h2>Chat App using Socket.io</h2>
      <div>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter your name' />
      </div>
      <div>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter youe message' />
        <button onClick={sendMessage}>Send</button>
      </div>

      <ul>
        {chat.map((msg, index) => (
          <li key={index}><strong>{msg.username}: </strong>{msg.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default App