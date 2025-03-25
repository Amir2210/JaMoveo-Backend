import { dbService } from '../../services/db.service.js'
export const userService = {
    add,            // Create (Signup)
    getByUsername   // Used for Login
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        throw err
    }
}

async function add(user) {
    try {
        const userToAdd = {
            username: user.username,
            password: user.password,
            instrument: user.instrument,
            isAdmin: user.isAdmin
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        throw err
    }
}