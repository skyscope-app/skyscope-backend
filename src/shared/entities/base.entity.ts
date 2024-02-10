import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 } from 'uuid';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public uid: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @DeleteDateColumn()
  public deletedAt: Date | null;

  @BeforeInsert()
  private beforeInsert() {
    this.uid = this.uid ?? v4();
  }
}
