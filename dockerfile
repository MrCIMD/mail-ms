# Esta es una imagen de node.js
FROM node:alpine3.20

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia package.json y package-lock.json al directorio de trabajo
COPY package*.json .

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación al directorio de trabajo
COPY . .

# Establece la variable de entorno NODE_ENV a development
ENV NODE_ENV=development

# Expone el puerto de la aplicación
# EXPOSE 4500

# Comando para iniciar la aplicación
# CMD ["npm", "run", "start:dev"]