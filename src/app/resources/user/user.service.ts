import { getRepository } from 'typeorm'
import md5 from 'crypto-js/md5'

import { CreateUser } from './dtos/user.create.dtos'
import { User } from '../../entity/User'
import AppError from '../../../shared/error/AppError'

export default class UserService {
    
    async create(user: CreateUser) {

        const { name, username, email, password } = user

        const userRepository = getRepository(User)

        const userExists = await userRepository.findOne({ where : { username }})

        if (userExists) {
            throw new AppError('Nome de usuário já está sendo utilizado, por favor tente outro', 401)
        }
        
        const emailExists = await userRepository.findOne({ where: { email }})

        if (emailExists) {
            throw new AppError('Este email já está cadastrado em nosso sistema', 401)
        }

        const password_hash = md5(password).toString()

        const userData = {
            ...user,
            password_hash,
            wallet: 0,
            accountNumber: Math.floor(Math.random() * 999999),
            accountDigit: Math.floor(Math.random() * 99)
        } 

        const newUser = await userRepository.save(userData)

        return newUser
    }

    async me(user: Partial<User>){
        const userRepository = getRepository(User)

        const currentUser = await userRepository.findOne({ where: { id: user.id }})

        if (!currentUser) {
            throw new AppError('Usuário não encontrado', 401)
        }

        // delete currentUser.password_hash

        return currentUser
    }
}