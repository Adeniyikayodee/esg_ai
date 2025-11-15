// src/models/Holding.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Portfolio } from './Portfolio';
import { PeerRecommendation } from './PeerRecommendation';

@Entity('holdings')
export class Holding {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    portfolio_id: string;

    @Column({ type: 'varchar', length: 10 })
    ticker: string;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    weight_pct: number;

    @Column({ type: 'text', nullable: true })
    sector: string;

    @Column({ type: 'decimal', nullable: true })
    market_cap: number;

    @Column({ type: 'decimal', nullable: true })
    co2_emission: number;

    @Column({ type: 'jsonb', nullable: true })
    data_sources: Record<string, any>;

    @ManyToOne(() => Portfolio, portfolio => portfolio.holdings)
    @JoinColumn({ name: 'portfolio_id' })
    portfolio: Portfolio;

    @OneToMany(() => PeerRecommendation, peer => peer.holding)
    peer_recommendations: PeerRecommendation[];
}