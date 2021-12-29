import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')// Vazio, ele gera sequencial
    id: string

    @Column()
    name: string

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    password_hash: string

    @Column()
    accountNumber: number

    @Column()
    accountDigit: number

    @Column()
    wallet: number

    @CreateDateColumn()
    createdAt: Date

    @CreateDateColumn()
    updatedAt: Date
}