const socketIO = require("socket.io")

let io

const initializeSocket = (server) => {
    io = socketIO(server)

    io.on('connection', (socket) => {
        console.log("Nuevo cliente conectado")
    })
}

const getSocketIO = () => {
    return io
}

module.exports = { initializeSocket, getSocketIO };