import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { UsersService } from './src/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = 'admin@pizzaexpert.com';
  const existingAdmin = await usersService.findByEmail(adminEmail);

  if (!existingAdmin) {
    await usersService.create({
      name: 'Admin Expert',
      email: adminEmail,
      password: 'adminpassword123',
      role: 'admin',
    });
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }

  await app.close();
}

bootstrap();
