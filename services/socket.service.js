import { Server } from 'socket.io'
var gIo = null
export function setupSocketAPI(server) {
    gIo = new Server(server, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        console.log(`New connected socket [id: ${socket.id}]`)
        socket.on('disconnect', socket => {
            console.log(`Socket disconnected [id: ${socket.id}]`)
        })
        socket.on('admin-set-song', song => {
            socket.broadcast.emit('admin-choose-song', song)
        })
        socket.on('admin-search-for-new-song', song => {
            socket.broadcast.emit('admin-pick-new-song', song)
        })

        socket.on('set-user-socket', userId => {
            console.log(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
            socket.userId = userId
        })

        socket.on('unset-user-socket', () => {
            console.log(`Removing socket.userId for socket [id: ${socket.id}]`)
            delete socket.userId
        })

    })
}

async function broadcast({ type, data, room = null, userId }) {
    userId = userId.toString()

    console.log(`Broadcasting event: ${type}`)
    const excludedSocket = await _getUserSocket(userId)
    if (room && excludedSocket) {
        console.log(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        console.log(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        console.log(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        console.log(`Emit to all`)
        gIo.emit(type, data)
    }
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => s.userId === userId)
    return socket
}
async function _getAllSockets() {
    const sockets = await gIo.fetchSockets()
    return sockets
}

export const socketService = {
    setupSocketAPI,
    broadcast,
}
