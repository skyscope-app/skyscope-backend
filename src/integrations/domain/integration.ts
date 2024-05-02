import { BaseEntity } from '@/shared/entities/base.entity';
import { User } from '@/users/domain/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum IntegrationProviders {
  Navigraph = 'navigraph',
  Ivao = 'ivao',
  Vatsim = 'vatsim',
}

@Entity({ name: 'integrations' })
export class Integration extends BaseEntity {
  @Column() public provider: IntegrationProviders;

  @Column({ name: 'provider_id' }) public providerId: string;

  @ManyToOne(() => User, (user) => user.integrations)
  @JoinColumn({
    name: 'user_id',
  })
  public user: User;

  @Column({ name: 'access_token' }) accessToken: string;

  @Column({ name: 'refresh_token' }) refreshToken: string;

  @Column({ name: 'expires_at' }) expiresAt: Date;

  constructor(
    provider: IntegrationProviders,
    user: User,
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
  ) {
    super();
    this.provider = provider;
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = new Date(Date.now() + expiresIn * 900);
  }
}
