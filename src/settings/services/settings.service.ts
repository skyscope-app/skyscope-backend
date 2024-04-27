import { Injectable } from '@nestjs/common';
import { User } from '@/users/domain/user.entity';
import { SaveSettingRequest } from '@/settings/dto/settings.dto';
import { firestore } from 'firebase-admin';

@Injectable()
export class SettingsService {
  private readonly collection = firestore().collection('settings');

  async save(user: User, setting: SaveSettingRequest) {
    const doc = await this.collection.doc(user.uid).get();

    if (doc.exists) {
      return doc.ref.update({ ...setting });
    }

    return await this.collection.doc(user.uid).create({ ...setting });
  }

  async list(user: User) {
    const doc = await this.collection.doc(user.uid).get();
    return doc.exists ? doc.data() : {};
  }

  delete(user: User, id: string) {
    return this.collection
      .doc(user.uid)
      .update({ [id]: firestore.FieldValue.delete() });
  }
}
