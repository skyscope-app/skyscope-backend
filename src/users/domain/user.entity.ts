import { Integration } from '@/integrations/domain/integration';
import { BaseEntity } from '@/shared/entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

export class UserOptions {
  ivaoId?: string;
  vatsimId?: string;
  posconId?: string;
  navigraphId?: string;
  simbriefId?: string;
}

export enum AccountStatus {
  Created = 'created',
  Active = 'active',
  Suspended = 'suspended',
}

@Entity('users')
export class User extends BaseEntity {
  @Column() email: string;

  @Column({ name: 'authentication_id' }) authenticationId: string;

  @Column({ name: 'simbrief_id' }) simbriefId?: string;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable({
    name: 'friends',
    joinColumn: {
      name: 'friend_id',
    },
    inverseJoinColumn: {
      name: 'owner_id',
    },
  })
  friends: User[];

  @OneToMany(() => Integration, (integration) => integration.user)
  integrations?: Integration[];

  @Column({ name: 'account_status' })
  accountStatus: AccountStatus;

  photo: string;
  name: string;

  constructor(email: string, authenticationId: string, options?: UserOptions) {
    super();

    this.email = email;
    this.authenticationId = authenticationId;
    this.simbriefId = options?.simbriefId;
  }

  setPhoto(photo: string) {
    this.photo = photo;
  }

  setName(name: string) {
    this.name = name;
  }
}
