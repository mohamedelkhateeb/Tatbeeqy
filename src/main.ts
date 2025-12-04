import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DataSource } from 'typeorm'
import { createAdminUser } from './seeders/admin-seeder'
import * as cookieParser from 'cookie-parser'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: ['http://localhost:3000'],
    },
  })

  const configService = app.get(ConfigService)

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tatbeeqy API')
    .setDescription('Tatbeeqy Multi-Vendor REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document)

  // Seeder
  const dataSource = app.get(DataSource)
  await createAdminUser(dataSource)

  const port = configService.get<number>('PORT') || 3000
  await app.listen(3000, '0.0.0.0') // 👈 important

  console.log(`🚀 Server running on http://localhost:${port}/api/v1`)
  console.log(`📘 Swagger docs: http://localhost:${port}/api/docs`)
}

bootstrap()
