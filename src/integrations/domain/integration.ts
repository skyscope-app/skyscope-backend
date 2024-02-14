import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@/shared/entities/base.entity';
import { User } from '@/users/domain/user.entity';

export enum IntegrationProviders {
  Navigraph = 'navigraph',
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

  constructor(
    provider: IntegrationProviders,
    providerId: string,
    user: User,
    accessToken: string,
    refreshToken: string,
  ) {
    super();
    this.provider = provider;
    this.providerId = providerId;
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
