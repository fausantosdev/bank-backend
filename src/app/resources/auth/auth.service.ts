import { getRepository } from 'typeorm'
import md5 from 'crypto-js/md5'
import { sign } from 'jsonwebtoken'

import { SignIn } from './dtos/auth.signin.dtos'
import { User } from '../../entity/User'
import AppError from '../../../shared/error/AppError'
import authConfigs from '../../../config/auth'

export default class AutnService {
    
    async create(user: SignIn) {
        const userRepository = getRepository(User)

        const { username, password } = user

        const password_hash = md5(password).toString()

        const userExists = await userRepository.findOne({ where : { username }})

        if (!userExists) {
            throw new AppError('Usuário não existe', 401)// 010325
        }

        if(userExists.password_hash !== password_hash){
            throw new AppError('Senha não confere', 401)
        }

        const { secret, expiresIn } = authConfigs

        const token = sign({ 
            id: userExists.id,
            username: userExists.username,
            email: userExists.email
        }, secret, {
            subject: userExists.id,
            expiresIn
        })

        return {
            user: {
                id: userExists.id,
                username: userExists.username,
                email: userExists.email
            },
            token
        }
    }
}