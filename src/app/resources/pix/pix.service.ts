import { getRepository } from 'typeorm'
import { encodeKey, decodeKey } from '../../../utils/pix'

import AppError from '../../../shared/error/AppError'
import { Pix } from '../../entity/Pix'
import { User } from '../../entity/User'

export default class PixService {
    // Solicitação de pix
    async request(value: number, user: Partial<User>) {
        const pixRepository = getRepository(Pix)
        const userRepository = getRepository(User)

        const currentUser = await userRepository.findOne({where: {id: user.id}})

        const requestData = {
            requestingUser: currentUser,
            value,
            status: 'open'
        }


        const register = await pixRepository.save(requestData)

        const key = encodeKey(user.id || '', value, register.id)

        return key
    }

    // Pagamento
    async pay(key: string, user: Partial<User>) {
        const keyDecoded = decodeKey(key)

        if(keyDecoded.userId === user.id){
            throw new AppError('Não é possível receber pix do mesmo usuário', 401)
        }

        const pixRepository = getRepository(Pix)
        const userRepository = getRepository(User)

        const requestingUser = await userRepository.findOne({where: { id: keyDecoded.userId }})
        const payingUser = await userRepository.findOne({where: { id: user.id }})
        if(!requestingUser || !payingUser){
            throw new AppError('Não encontramos os clientes da tranzação, gere uma nova chave', 401)
        }

        if(payingUser?.wallet && payingUser.wallet < Number(keyDecoded.value)){
            throw new AppError('Não há saldo suficiente para fazer o pagamento', 401)
        }

        requestingUser.wallet = Number(requestingUser?.wallet) + Number(keyDecoded.value)
        await userRepository.save(requestingUser)

        payingUser.wallet = Number(payingUser?.wallet) - Number(keyDecoded.value)
        await userRepository.save(payingUser)

        const pixTranzaction = await pixRepository.findOne({where: {id: keyDecoded.registerId, status: 'open'}})

        if(!pixTranzaction){
            throw new AppError('Chave inválida para pagamento', 401)
        }

        pixTranzaction.status = 'closed'
        pixTranzaction.payingUser = payingUser

        await pixRepository.save(pixTranzaction)

        return {msg: 'Pagamento efetuado com sucesso'}
    }

    async transactions(user: Partial<User>){
        const pixRepository = getRepository(Pix)

        const pixReceived = await pixRepository.find({where: {requestingUser: user.id, status: 'closed', relations: 'payingUser'}})

        const pixPaying = await pixRepository.find({where: {requestingUser: user.id, status: 'closed', relations: 'requestingUser'}})

        const received = pixReceived.map(transaction => ({
            value: transaction.value,
            user: {
                name: transaction.payingUser.name,
                username: transaction.payingUser.username
            },
            updatedAt: transaction.updatedAt,
            type: 'received'
        }))

        const paying = pixPaying.map(transaction => ({
            value: transaction.value,
            user: {
                name: transaction.requestingUser.name,
                username: transaction.requestingUser.username
            },
            updatedAt: transaction.updatedAt,
            type: 'paid'
        }))

        const allTranzactions = received.concat(paying)

        allTranzactions.sort((a, b) => {
            const dateA = new Date(a.updatedAt).getTime()
            const dateB = new Date(b.updatedAt).getTime()

            return dateA < dateB ? 1 : -1
        })

        return allTranzactions
    }
}