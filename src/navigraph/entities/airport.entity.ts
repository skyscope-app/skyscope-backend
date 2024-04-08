import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tbl_airports' })
export class NavigraphAirport {
  @Column()
  @PrimaryColumn()
  id: string;

  @Column({ name: 'area_code', type: 'text', length: 3, nullable: true })
  areaCode: string;

  @Column({ name: 'icao_code', type: 'text', length: 2, nullable: false })
  countryCode: string;

  @Column({
    name: 'airport_identifier',
    type: 'text',
    length: 4,
    nullable: false,
  })
  icao: string;

  @Column({
    name: 'airport_identifier_3letter',
    type: 'text',
    length: 3,
    nullable: true,
  })
  airportIdentitifier3Letter: string;

  @Column({ name: 'airport_name', type: 'text', length: 3, nullable: true })
  name: string;

  @Column({
    name: 'airport_ref_latitude',
    type: 'double',
    precision: 9,
    nullable: true,
  })
  latitude: number;

  @Column({
    name: 'airport_ref_longitude',
    type: 'double',
    precision: 10,
    nullable: true,
  })
  longitude: number;

  @Column({ name: 'ifr_capability', type: 'text', length: 1, nullable: true })
  ifr: string;

  @Column({
    name: 'longest_runway_surface_code',
    type: 'text',
    length: 1,
    nullable: true,
  })
  longestRunwaySurfaceCode: string;

  @Column({ name: 'elevation', type: 'integer', width: 5, nullable: true })
  elevation: number;

  @Column({
    name: 'transition_altitude',
    type: 'integer',
    width: 5,
    nullable: true,
  })
  transitionAltitude: number;

  @Column({
    name: 'transition_level',
    type: 'integer',
    width: 5,
    nullable: true,
  })
  transitionLevel: number;

  @Column({ name: 'speed_limit', type: 'integer', width: 3, nullable: true })
  speedLimit: number;

  @Column({
    name: 'speed_limit_altitude',
    type: 'integer',
    width: 5,
    nullable: true,
  })
  speedLimitAltitude: number;

  @Column({
    name: 'iata_ata_designator',
    type: 'text',
    length: 3,
    nullable: true,
  })
  iata: string;
}
