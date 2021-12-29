import {Request, Response} from 'express'
import PixService from './pix.service'

export class PixController {
    async request (req: Request, res: Response) {
        const pixService = new PixService()

        const { value } = req.body
        const user = req.user

        try {
            const requestKey = await pixService.request(value, user)
            
            return res.status(201).json({
                status: true,
                data: requestKey
            })
        } catch (error) {
            return res.status(401).json({
                status: false,
                error
            })
        }
    }

    async pay (req: Request, res: Response) {
        const pixService = new PixService()

        const { key } = req.params

        try {
            const payment = await pixService.pay(key, req.user)
            
            return res.status(201).json({
                status: true,
                data: payment
            })
        } catch (error) {
            return res.status(401).json({
                status: false,
                error
            })
        }
    }

    async transactions (req: Request, res: Response) {
        const pixService = new PixService()

        try {
            const transactions = await pixService.transactions(req.user)
            
            return res.status(201).json({
                status: true,
                data: transactions
            })
        } catch (error) {
            return res.status(401).json({
                status: false,
                error
            })
        } 
    }
}