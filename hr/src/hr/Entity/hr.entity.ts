/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PasswordReset } from './passwordreset.entity';


@Entity('hrTable')
export class Hr {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ unique: true, length: 50 })
  phone: string;

  @Column({ length: 100 })
  address: string;

  @Column({ select: false, length: 255 })
  password: string;
 @OneToMany(() => PasswordReset, reset => reset.hr)
 passwordResets: PasswordReset[];
}
