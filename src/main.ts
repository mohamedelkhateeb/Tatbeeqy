import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

// App Module
import { AppModule } from "./app.module";

// Initialize Config
const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: [
        "http://localhost:3000",
        "http://localhost:3002",
        "https://omvb4gfyktz7dbdexkbqujutaa.srv.us",
      ],
    },
  });

  // Middlewares
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // ✅ Swagger setup
  const config = new DocumentBuilder()
    .setTitle("Multi-Vendor REST API")
    .setDescription("API documentation for the Multi-Vendor eCommerce platform")
    .setVersion("1.0")
    .addBearerAuth() // optional: adds Authorization header support
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Start server
  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📘 Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
