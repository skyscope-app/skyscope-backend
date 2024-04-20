import * as crypto from 'crypto';
import { v5 } from 'uuid';

export class Airline {
  public readonly id: string;
  public readonly name: string;
  public readonly icao: string;
  public readonly image: string;
  public readonly callsign: string;

  constructor(data: Omit<Airline, 'id' | 'image'>) {
    this.id = v5(
      crypto
        .createHash('md5')
        .update(`${data.name}${data.icao}${data.callsign}`)
        .digest('hex'),
      '820aabf8-e662-4075-8e9f-8a94dc1f5148',
    );

    this.name = data.name;
    this.icao = data.icao;
    this.image = `https://static.skyscope.app/tails/${data.icao}.png`;
  }
}
