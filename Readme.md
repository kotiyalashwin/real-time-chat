# Real-Time Chat Application(Pure WebSocket)

WebSocket is a protocol just like http.Both client and server side application understand WebSocket.
Try and write following in console

```
WebSocket

```

But socket.io is made over WebSocket to make the setup fast. But for better understanding one should build a project out of pure WebSocket just like this one.

A simple real-time chat application built using Node.js and WebSockets.

## Basics

- Real-time messaging between multiple users
- No external libraries for WebSockets (pure WebSocket implementation)
- Lightweight and fast

## Applications

- Connect to a WebSocket server in real-time
- Send and receive messages instantly
- Chat with multiple users in a shared environment
- Maintain persistent WebSocket connections
- Experience a minimal and efficient communication platform

## Chronology

- The WebSocket server listens for connections from clients.
- When a client sends a message, the server broadcasts it to all connected clients.
- Clients receive and display incoming messages in real-time.
