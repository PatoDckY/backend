import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './rol.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async obtenerTodos(): Promise<Rol[]> {
    return this.rolRepository.find();
  }

  async obtenerPorId(id: number): Promise<Rol | null> {
    return this.rolRepository.findOne({ where: { id } });
  }

  async crear(data: Partial<Rol>): Promise<Rol> {
    const rol = this.rolRepository.create(data);
    return this.rolRepository.save(rol);
  }
}
