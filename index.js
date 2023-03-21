const io = require('socket.io')(8900, {
     cors: {
          origin: "http://localhost:3000",
     }
})

let users = []

const addUser = (userId, SocketId) => {
     //ADD users
     !users.some((user) => user.userId === userId) && users.push({ userId, SocketId })
}

const removeUser = (socketId) => {
     users = users.filter(user => user?.socketId !== socketId)
}

const getUser = (userId) => {
     return users.find((user) =>user.userId === userId)
}

io.on("connection", (socket) => {
     // When connect
     console.log('a user connected');


     // take userId and SocketId from user
     socket.on("addUser", (userId) => {
          console.log('userId Add Users:>> ', userId,socket.id);
          addUser(userId, socket.id);
          io.emit("getUsers", users)
     })

     // Send and get Message
     socket.on("sendMessage", ({ senderId, receiverId, text }) => {
          const user = getUser(receiverId)
          console.log('user :>> ', user);
          io.to(user.SocketId).emit("getMessage", {      
               senderId, text
          })
     })

     // When Disconnect
     socket.on("disconnect", () => {
          console.log('a user is disconnected');
          removeUser(socket.id)
          io.emit("getUsers", users)

     })
});
