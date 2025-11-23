import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Rol } from '../roles/rol.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellidoPaterno: string;

  @Column({ nullable: true })
  apellidoMaterno: string;

  @Column()
  edad: number;

  @Column()
  sexo: string;

  @Column()
  telefono: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  contrasena: string;

  // ⭐ Relación ManyToOne
  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
  }
}
