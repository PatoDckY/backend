import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuariosModule } from './usuarios/usuarios.module';
import { Usuario } from './usuarios/usuario.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Carga variables de entorno (.env)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Usuario],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false, // ✅ Necesario para Render
      },
    }),
    UsuariosModule,
    AuthModule,
  ],
})
export class AppModule {}
