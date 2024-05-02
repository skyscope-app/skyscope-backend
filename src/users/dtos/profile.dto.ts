import { assertNullable, Nullable } from '@/shared/utils/nullable';
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
  navigraphId: Nullable<string>;
  @ApiProperty({ nullable: true })
  simbriefId: Nullable<string>;
  @ApiProperty({ enum: ['active', 'suspended', 'created'] })
  status: 'active' | 'suspended' | 'created';

  constructor(user: User) {
    this.id = user.uid;
    this.name = user.name ?? '';
    this.email = user.email;
    this.avatarUrl = assertNullable(user.photo);
    this.ivaoId = assertNullable(
      user.integrations?.find((i) => i.provider === 'ivao')?.providerId,
    );
    this.vatsimId = assertNullable(
      user.integrations?.find((i) => i.provider === 'vatsim')?.providerId,
    );
    this.navigraphId = assertNullable(
      user.integrations?.find((i) => i.provider === 'navigraph')?.providerId,
    );
    this.simbriefId = assertNullable(user.simbriefId);
    this.status = user.accountStatus;
  }
}
