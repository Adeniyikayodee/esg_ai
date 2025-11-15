// src/models/Portfolio.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Holding } from './Holding';
import { PeerRecommendation } from './PeerRecommendation';

@Entity('portfolios')
export class Portfolio {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    name!: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    owner_id?: string;

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany(() => Holding, holding => holding.portfolio, { cascade: true })
    holdings!: Holding[];

    @OneToMany(() => PeerRecommendation, peer => peer.portfolio)
    peer_recommendations!: PeerRecommendation[];
}