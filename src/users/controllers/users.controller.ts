import { BodyParserPipe } from '@/shared/pipes/body-parser.pipe';
import {
  AuthenticatedUser,
  WaitListAuthenticated,
} from '@/shared/utils/decorators';
import { ValidProfileImageMimeTypes } from '@/users/constants';
import { User } from '@/users/domain/user.entity';
import { Profile } from '@/users/dtos/profile.dto';
import { ProfileOptionsDto } from '@/users/dtos/user-update.dto';
import { UsersService } from '@/users/services/users.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
@WaitListAuthenticated()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Put('/profile/image')
  @ApiOperation({ description: 'Update user profile image' })
  @ApiNoContentResponse({ description: 'User profile image updated' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImage(
    @AuthenticatedUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!ValidProfileImageMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Only JPEG and PNG are allowed`,
      );
    }

    if (file.size > 1024 * 1024) {
      throw new BadRequestException('File size too large. Max 1MB');
    }

    await this.userService.updateProfilePhoto(user, file);
  }

  @Patch('profile')
  @ApiOperation({ description: 'Update user profile' })
  @ApiNoContentResponse({ description: 'User profile updated' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProfile(
    @Body(new BodyParserPipe(ProfileOptionsDto)) body: ProfileOptionsDto,
    @AuthenticatedUser() user: User,
  ) {
    await this.userService.updateProfile(user, body);
  }

  @Get('profile')
  @ApiOperation({ description: 'Get authenticated user profile' })
  @ApiOkResponse({ description: 'User profile', type: Profile })
  async getProfile(@AuthenticatedUser() user: User) {
    return new Profile(user);
  }
}
