import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

interface UploadOptions {
  public?: boolean;
  bucket?: string;
}

@Injectable()
export class FilesService {
  private client = new Storage();

  async upload(
    path: string,
    file: Express.Multer.File,
    { bucket, public: _public }: UploadOptions = {
      bucket: 'static.skyscope.app',
      public: false,
    },
  ) {
    const bucketFile = this.client.bucket(bucket!).file(path);

    await bucketFile.save(file.buffer, { public: _public! });

    return {
      publicUrl: bucketFile.publicUrl(),
      key: bucketFile.id,
    };
  }
}
