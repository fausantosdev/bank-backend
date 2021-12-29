import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import authConfig from '../../config/auth'
import AppError from '../../shared/error/AppError'


interface ITokenPayload {
    name: string,
    username: string
    iat: number
    exp: number
    sub: string
}

export default (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization

    if(!authHeader)
    {
        throw new AppError('Token not Provided', 401)
    }

    const [, token] = authHeader.split(' ')

    try {
        const decoded = verify(token, authConfig.secret)

        const {sub, name, username} = decoded as ITokenPayload

        req.user = {// @types
            id: sub,
            name,
            username
        }

        next()

    } catch (error) {
        throw new AppError('Invalid Token', 401)
    }
}