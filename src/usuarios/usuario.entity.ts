import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  /**
   * Antes de insertar el usuario en la BD, se ejecuta este método.
   * Aquí encriptamos la contraseña.
   */
  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
  }
}
