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

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  public deletedAt: Date | null;

  @BeforeInsert()
  private beforeInsert() {
    this.uid = this.uid ?? v4();
  }
}
