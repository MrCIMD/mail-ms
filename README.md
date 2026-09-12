# Mail Microservice (mail-ms)

## Descripción

El microservicio de correo (`mail-ms`) recibe peticiones vía RabbitMQ y envía
correos electrónicos utilizando AWS SESv2. Forma parte de la familia de
microservicios expuestos por RabbitMQ dentro de la plataforma Utils.

## Requisitos

- Node.js 24.21.0
- pnpm 11.1.1 (gestionado vía Corepack)
- Docker (opcional, para despliegue en contenedores)

## Instalación

1. Clonar el repositorio:

```bash
git clone git@github.com:ilogs-mx/mail-ms.git
cd mail-ms
```

2. Habilitar Corepack y preparar pnpm:

```bash
corepack enable
corepack prepare pnpm@11.1.1 --activate
```

3. Instalar las dependencias:

```bash
pnpm install
```

4. Crear el archivo `.env` basado en `.env.example` y configurar las variables
   de entorno necesarias.

5. Iniciar el microservicio en modo desarrollo:

```bash
pnpm run start:dev
```

## Variables de entorno

| Variable          | Descripción                                                 |
| ----------------- | ----------------------------------------------------------- |
| `AMQP_SERVERS`    | Lista separada por comas de URLs AMQP (`amqp://...`).       |
| `IAM_ACCESS_KEY`  | Access key de IAM para AWS.                                 |
| `IAM_SECRET_KEY`  | Secret key de IAM para AWS.                                 |
| `AWS_REGION`      | Región de AWS (por ejemplo, `us-east-1`).                   |
| `IDENTITY_NAME`   | Identidad verificada en SESv2 usada como remitente.        |

## Scripts

- `pnpm run build`: Compila el proyecto con Nest CLI.
- `pnpm run start:dev`: Inicia el microservicio en modo desarrollo.
- `pnpm run start:prod`: Ejecuta el bundle compilado desde `dist/`.
- `pnpm run lint`: Ejecuta ESLint con la configuración flat.
- `pnpm run test`: Ejecuta las pruebas unitarias con Jest.
- `pnpm run test:e2e`: Ejecuta las pruebas end-to-end con Jest.

## Despliegue

Para construir la imagen Docker de producción:

```bash
docker build -f dockerfile.prod -t mail-ms:name-tag .
```

El microservicio se conecta a RabbitMQ por lo que es necesario exponer la
variable `AMQP_SERVERS` y las credenciales de AWS al ejecutar el contenedor:

```bash
docker run -d --env-file .env mail-ms:name-tag
```
