import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async crear(usuarioData: Partial<Usuario>): Promise<Usuario> {
    const usuario = this.usuarioRepository.create(usuarioData);
    return this.usuarioRepository.save(usuario);
  }

  async obtenerTodos(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async obtenerPorId(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ id });
  }

  // ✅ Método opcional: buscar por correo (útil para login)
  async obtenerPorCorreo(correo: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { correo } });
  }

  // ✅ Método opcional: verificar contraseña
  async verificarContrasena(contrasena: string, hash: string): Promise<boolean> {
    return bcrypt.compare(contrasena, hash);
  }
}
