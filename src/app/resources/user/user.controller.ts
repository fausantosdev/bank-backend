import {Request, Response} from 'express'
import UserService from './user.service'

export class UserController {
    async store (req: Request, res: Response) {
        const userService = new UserService()

        const { name, username, email, password } = req.body

        try {
            const newUser = await userService.create({ name, email, username, password })

            return res.status(200).json({
                status: true,
                data: newUser
            })
        } catch (error) {
            return res.status(401).json({
                status: false,
                error
            })
        }

    }

    async me (req: Request, res: Response) {
        const userService = new UserService()
 
        try {
            const user = await userService.me(req.user)

            return res.status(200).json({
                status: true,
                data: user
            })
        } catch (error) {
            return res.status(401).json({
                status: false,
                error
            })
        }
    }

    async index (req: Request, res: Response) {
        return res.status(200).json({
            status : 'teste read' 
        }) 
    }

    async update (req: Request, res: Response) {
        return res.status(200).json({
            status : 'teste update' 
        })  
    }

    async remove (req: Request, res: Response) {
        return res.status(200).json({
            status : 'teste delete' 
        })
    }
}