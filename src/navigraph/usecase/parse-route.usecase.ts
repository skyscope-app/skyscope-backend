import { Route } from '@/navigraph/domain/route';
import { BaseService } from '@/navigraph/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { DataSource } from 'typeorm';

@Injectable()
export class NavigraphParseRouteUseCase extends BaseService {
  constructor(
    @InjectDataSource('current')
    currentDataSource: DataSource,
    @InjectDataSource('outdated')
    outdatedDataSource: DataSource,
    clsService: ClsService,
  ) {
    super(currentDataSource, outdatedDataSource, clsService);
  }

  async run(route: string): Promise<Route> {
    const splited = route.split(' ');

    const detailed = await Promise.all(splited.map((s) => this.detailOne(s)));

    throw new Error('Not implemented');
  }

  private async detailOne(identifier: string) {
    if (identifier === 'DCT') {
      return {
        type: 'DCT',
        identifier,
      };
    }

    if (/(\d{2}[NS])(\d{3}[EW])/.test(identifier)) {
      return {
        type: 'COORDINATES',
        identifier,
      };
    }

    const datasource = this.datasource();

    const query = `SELECT 
            CASE 
                WHEN ewaypoints.waypoint_identifier = $1 THEN 'ENROUTE_WAYPOINT'
                WHEN twaypoints.waypoint_identifier = $1 THEN 'TERMINAL_WAYPOINT'
                WHEN tea.route_identifier = $1 THEN 'AIRWAY'
                WHEN sids.procedure_identifier = $1 THEN 'SID'
                WHEN stars.procedure_identifier = $1 THEN 'STAR'
                WHEN vors.vor_identifier = $1 THEN 'VOR'
                WHEN endbs.ndb_identifier = $1 THEN 'ENROUTE_NDB'
                WHEN tndbs.ndb_identifier = $1 THEN 'TERMINAL_NDB'
                WHEN $1 = 'DCT' THEN 'DCT'
                ELSE 'UNKNOW'
            END AS type,
            $1 as identifier
        FROM 
            tbl_enroute_airways tea
        LEFT JOIN 
            tbl_sids sids ON sids.procedure_identifier = $1
        LEFT JOIN 
            tbl_stars stars ON stars.procedure_identifier = $1
        LEFT JOIN
            tbl_vhfnavaids vors ON vors.vor_identifier = $1
        LEFT JOIN
            tbl_terminal_ndbnavaids tndbs ON tndbs.ndb_identifier = $1
        LEFT JOIN
            tbl_enroute_waypoints ewaypoints ON ewaypoints.waypoint_identifier = $1
        LEFT JOIN
            tbl_terminal_waypoints twaypoints ON twaypoints.waypoint_identifier = $1
        LEFT JOIN
            tbl_enroute_ndbnavaids endbs ON endbs.ndb_identifier = $1
        WHERE 
            tea.route_identifier = $1
            OR sids.procedure_identifier = $1 
            OR stars.procedure_identifier = $1 
            OR vors.vor_identifier = $1 
            OR tndbs.ndb_identifier = $1
            OR ewaypoints.waypoint_identifier = $1
            OR twaypoints.waypoint_identifier = $1
            OR tndbs.ndb_identifier = $1
            OR endbs.ndb_identifier = $1
        LIMIT 1
        `;

    const result = await datasource.query(query, [identifier]);

    return result[0];
  }
}
