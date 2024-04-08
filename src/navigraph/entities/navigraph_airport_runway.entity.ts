import { NavigraphAirport } from '@/navigraph/entities/navigraph_airport.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tbl_runways' })
export class NavigraphAirportRunway {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'area_code', length: 3, nullable: true })
  areaCode: string;

  @Column({ name: 'icao_code', length: 2, nullable: true })
  countryCode: string;

  @Column({ name: 'airport_identifier', length: 4 })
  airportICAO: string;

  @Column({ name: 'runway_identifier', length: 3 })
  identifier: string;

  @Column({ name: 'runway_latitude', type: 'double precision', nullable: true })
  latitude: number;

  @Column({
    name: 'runway_longitude',
    type: 'double precision',
    nullable: true,
  })
  longitude: number;

  @Column({ name: 'runway_gradient', type: 'double precision', nullable: true })
  gradient: number;

  @Column({
    name: 'runway_magnetic_bearing',
    type: 'double precision',
    nullable: true,
  })
  magneticBearing: number;

  @Column({
    name: 'runway_true_bearing',
    type: 'double precision',
    nullable: true,
  })
  trueBearing: number;

  @Column({
    name: 'landing_threshold_elevation',
    type: 'integer',
    nullable: true,
  })
  elevation: number;

  @Column({
    name: 'displaced_threshold_distance',
    type: 'integer',
    nullable: true,
  })
  displacedThresholdDistance: number;

  @Column({
    name: 'threshold_crossing_height',
    type: 'smallint',
    nullable: true,
  })
  thresholdCrossingHeight: number;

  @Column({ name: 'runway_length', type: 'integer', nullable: true })
  length: number;

  @Column({ name: 'runway_width', type: 'smallint', nullable: true })
  width: number;

  @Column({ name: 'llz_identifier', length: 4, nullable: true })
  llzIdentifier: string;

  @Column({ name: 'llz_mls_gls_category', length: 1, nullable: true })
  llzMlsGlsCategory?: string;

  @Column({ name: 'surface_code', type: 'smallint', nullable: true })
  surfaceCode: number;

  @ManyToOne(() => NavigraphAirport, (airport) => airport.gates)
  @JoinColumn({
    name: 'airport_identifier',
    referencedColumnName: 'icao',
  })
  airport: NavigraphAirport;
}
