import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, UpdateDateColumn, Column, CreateDateColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Pix {
    @PrimaryGeneratedColumn('uuid')// Vazio, ele gera sequencial
    id: string

    @Column()
    status: string

    @Column()
    value: number

    @ManyToOne(() => User, user => user.id)// n ... 1
    @JoinColumn()
    requestingUser: User

    @ManyToOne(() => User, user => user.id, { nullable: true })
    @JoinColumn()
    payingUser: User
    // OBS: Quando se cria uma solicitação de pix, não tem um pagador, até que a tranzação seja efetivada. Quando o pagamento é feito, o id do pagador é registrado.

    @CreateDateColumn()
    createdAt: Date

    @CreateDateColumn()
    updatedAt: Date
}