// src/models/PeerRecommendation.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Portfolio } from './Portfolio';
import { Holding } from './Holding';

@Entity('peer_recommendations')
export class PeerRecommendation {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('uuid')
    portfolio_id!: string;

    @Column('uuid')
    holding_id!: string;

    @Column({ type: 'varchar', length: 10 })
    peer_ticker!: string;

    @Column({ type: 'text', nullable: true })
    peer_sector?: string;

    @Column({ type: 'decimal', nullable: true })
    peer_market_cap?: number;

    @Column({ type: 'decimal', nullable: true })
    peer_co2_emission?: number;

    @Column({ type: 'int' })
    rank!: number;

    @Column({ type: 'jsonb', nullable: true })
    sources?: Record<string, any>[];

    @ManyToOne(() => Portfolio, portfolio => portfolio.peer_recommendations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'portfolio_id' })
    portfolio!: Portfolio;

    @ManyToOne(() => Holding, holding => holding.peer_recommendations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'holding_id' })
    holding!: Holding;
}