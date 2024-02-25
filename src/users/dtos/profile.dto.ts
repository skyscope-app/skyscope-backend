import { Nullable, assertNullable } from '@/shared/utils/nullable';
import { User } from '@/users/domain/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  avatarUrl: Nullable<string>;
  @ApiProperty()
  email: string;
  @ApiProperty({ nullable: true })
  ivaoId: Nullable<string>;
  @ApiProperty({ nullable: true })
  vatsimId: Nullable<string>;
  @ApiProperty({ nullable: true })
  posconId: Nullable<string>;
  @ApiProperty({ nullable: true })
  navigraphId: Nullable<string>;
  @ApiProperty({ nullable: true })
  simbriefId: Nullable<string>;

  constructor(user: User) {
    this.id = user.uid;
    this.name = user.name ?? '';
    this.email = user.email;
    this.avatarUrl = assertNullable(user.photo);
    this.ivaoId = assertNullable(user.ivaoId);
    this.vatsimId = assertNullable(user.vatsimId);
    this.posconId = assertNullable(user.posconId);
    this.navigraphId = assertNullable(user.navigraphId);
    this.simbriefId = assertNullable(user.simbriefId);
  }
}
