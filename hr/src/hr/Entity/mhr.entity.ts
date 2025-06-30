import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('mhrTable')
export class Mhr {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

}
