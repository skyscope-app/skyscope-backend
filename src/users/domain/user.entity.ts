import { BaseEntity } from '@/shared/base.entity';
import { Column, Entity } from 'typeorm';

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
