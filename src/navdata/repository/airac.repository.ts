import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Airac, AiracStatus } from '@/navdata/entity/airac';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AiracRepository {
  private readonly collection = firestore().collection('navigraph_cycle');

  async find(status: AiracStatus) {
    const doc = await this.collection.doc(status.toLowerCase()).get();

    if (!doc.exists) {
      return;
    }

    const data = plainToInstance(Airac, doc.data());

    return data;
  }
}
