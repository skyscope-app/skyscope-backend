import { NavigraphAirport } from '@/navigraph/entities/navigraph_airport.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tbl_gate' })
export class NavigraphAirportGate {
  @PrimaryColumn({ name: 'gate_identifier' })
  id: string;

  @Column({ name: 'area_code', type: 'text', length: 3, nullable: true })
  areaCode: string;

  @Column({
    name: 'airport_identifier',
    type: 'text',
    length: 4,
    nullable: true,
  })
  airport_icao: string;

  @Column({ name: 'icao_code', type: 'text', length: 2, nullable: true })
  countryCode: string;

  @Column({ name: 'gate_identifier', type: 'text', length: 5, nullable: true })
  gateIdentifier: string;

  @Column({
    name: 'gate_latitude',
    type: 'double',
    precision: 9,
    nullable: true,
  })
  latitude: number;

  @Column({
    name: 'gate_longitude',
    type: 'double',
    precision: 10,
    nullable: true,
  })
  longitude: number;

  @Column({ name: 'name', type: 'text', length: 25, nullable: true })
  name: string;

  @ManyToOne(() => NavigraphAirport, (airport) => airport.gates)
  @JoinColumn({
    name: 'airport_identifier',
    referencedColumnName: 'icao',
  })
  airport: NavigraphAirport;
}
