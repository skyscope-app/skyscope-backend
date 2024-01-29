import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/shared/base.entity';

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
}
