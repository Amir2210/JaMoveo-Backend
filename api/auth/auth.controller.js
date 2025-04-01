import { authService } from './auth.service.js'

export async function login(req, res) {
    const { username, password } = req.body
    try {
        const user = await authService.login(username, password)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { httpOnly: true, sameSite: 'None', secure: true })
        res.json(user)
    } catch (err) {
        res.status(401).send({ err: 'Failed to Login' })
    }
}

export async function signup(req, res) {
    try {
        const credentials = req.body
        const account = await authService.signup(credentials)
        const user = await authService.login(credentials.username, credentials.password, credentials.instrument, credentials.isAdmin)
        const loginToken = authService.getLoginToken(user)
        res.cookie('loginToken', loginToken, { httpOnly: true, sameSite: 'None', secure: true })
        res.json(user)
    } catch (err) {
        res.status(400).send({ err: 'Failed to signup', msg: err })
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        res.status(400).send({ err: 'Failed to logout' })
    }
}

