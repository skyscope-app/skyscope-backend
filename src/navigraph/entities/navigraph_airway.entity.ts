import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tbl_enroute_airways' })
export class NavigraphAirway {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'area_code', length: 3, nullable: true })
  areaCode: string;

  @Column({ name: 'route_identifier', length: 6 })
  identifier: string;

  @Column({ name: 'seqno', type: 'integer' })
  sequence: number;

  @Column({ name: 'icao_code', length: 2 })
  countryCode: string;

  @Column({ name: 'waypoint_identifier', length: 5 })
  waypointIdentifier: string;

  @Column({
    name: 'waypoint_latitude',
    type: 'double precision',
    nullable: true,
  })
  waypointLatitude: number;

  @Column({
    name: 'waypoint_longitude',
    type: 'double precision',
    nullable: true,
  })
  waypointLongitude: number;

  @Column({ name: 'waypoint_description_code', length: 4, nullable: true })
  waypointDescriptionCode: string;

  @Column({ name: 'route_type', length: 1, nullable: true })
  routeType: string;

  @Column({ name: 'flightlevel', length: 1, nullable: true })
  flightLevel: string;

  @Column({ name: 'direction_restriction', length: 1, nullable: true })
  directionRestriction: string;

  @Column({ name: 'crusing_table_identifier', length: 2, nullable: true })
  cruisingTableIdentifier: string;

  @Column({ name: 'minimum_altitude1', type: 'integer', nullable: true })
  minimumAltitude1: number;

  @Column({ name: 'minimum_altitude2', type: 'integer', nullable: true })
  minimumAltitude2: number;

  @Column({ name: 'maximum_altitude', type: 'integer', nullable: true })
  maximumAltitude: number;

  @Column({ name: 'outbound_course', type: 'double precision', nullable: true })
  outboundCourse: number;

  @Column({ name: 'inbound_course', type: 'double precision', nullable: true })
  inboundCourse: number;

  @Column({
    name: 'inbound_distance',
    type: 'double precision',
    nullable: true,
  })
  inboundDistance: number;
}
