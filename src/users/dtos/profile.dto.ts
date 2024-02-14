import { User } from '@/users/domain/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class Profile {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  avatarUrl: string;
  @ApiProperty()
  email: string;
  @ApiProperty({ nullable: true })
  ivaoId?: string;
  @ApiProperty({ nullable: true })
  vatsimId?: string;
  @ApiProperty({ nullable: true })
  posconId?: string;
  @ApiProperty({ nullable: true })
  navigraphId?: string;
  @ApiProperty({ nullable: true })
  simbriefId?: string;

  constructor(user: User) {
    this.id = user.uid;
    this.name = user.name ?? '';
    this.email = user.email;
    this.avatarUrl = user.photo ?? '';
    this.ivaoId = user.ivaoId;
    this.vatsimId = user.vatsimId;
    this.posconId = user.posconId;
    this.navigraphId = user.navigraphId;
    this.simbriefId = user.simbriefId;
  }
}
