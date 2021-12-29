import {Request, Response} from 'express'

import AuthService from './auth.service'

export class AuthController {
    async store (req: Request, res: Response) {

        //return res.json(req.body)

        const { username, password } = req.body

        const authService = new AuthService()

        try {
            const result = await authService.create({ username, password })

            return res.status(200).json({
                status: true,
                data: result
            }) 
        } catch (error) {
            return res.status(401).json({
                status: false,
                error
            })
        }
    }
}