import { BaseEntity } from '@/shared/entities/base.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Integration } from '@/integrations/domain/integration';

export class UserOptions {
  ivaoId?: string;
  vatsimId?: string;
  posconId?: string;
  navigraphId?: string;
  simbriefId?: string;
}

@Entity('users')
export class User extends BaseEntity {
  @Column() ivaoId?: string;

  @Column() vatsimId?: string;

  @Column() posconId?: string;

  @Column() email: string;

  @Column() authenticationId: string;

  @Column() navigraphId?: string;

  @Column() simbriefId?: string;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable({
    name: 'friends',
    joinColumn: {
      name: 'friendId',
    },
    inverseJoinColumn: {
      name: 'ownerId',
    },
  })
  friends: User[];

  @OneToMany(() => Integration, (integration) => integration.user)
  integrations: Integration[];

  photo: string;
  name: string;

  constructor(email: string, authenticationId: string, options?: UserOptions) {
    super();

    this.email = email;
    this.authenticationId = authenticationId;
    this.ivaoId = options?.ivaoId;
    this.vatsimId = options?.vatsimId;
    this.posconId = options?.posconId;
    this.navigraphId = options?.navigraphId;
    this.simbriefId = options?.simbriefId;
  }

  setOptions(options: UserOptions) {
    this.ivaoId = options?.ivaoId;
    this.vatsimId = options?.vatsimId;
    this.posconId = options?.posconId;
    this.navigraphId = options?.navigraphId;
    this.simbriefId = options?.simbriefId;
  }

  setPhoto(photo: string) {
    this.photo = photo;
  }

  setName(name: string) {
    this.name = name;
  }
}
