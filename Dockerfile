# Use a imagem oficial do Node.js para buildar a aplicação
FROM node:16.13.2-bullseye-slim as build-stage

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todo o código fonte
COPY . .

# Build a aplicação
RUN npm run build

# Use uma imagem mínima do Nginx para servir os arquivos estáticos
FROM nginx:alpine-slim

# Copie os arquivos compilados para o diretório de arquivos estáticos do Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exponha a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]