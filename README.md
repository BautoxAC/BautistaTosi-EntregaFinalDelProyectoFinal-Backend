# Explicación
Este proyecto es un API de un ecommerce que sigue las consignas de las del proyecto final de CoderHouse funcionando con:
- [x] MongoDB
- [x] Handlebars
- [x] NodeJS
- [x] Css
- [x] ExpressJs
- [x] GIT
- [x] ESLint
- [x] DotEnv

## Link del deploy
```
[https://pf-backend-bautistatosi.onrender.com]
```

## Esquema del DotEnv:
- Se encuentran dos ejemplos de como son los dos nombres que utiliza la app para funcionar y sus variables necesarias

## Para iniciar el proyecto con nodeJS

### `npm i -d`
- Instala las dependencias necesarias para hacer development

### `npm i`
- Instala las dependencias necesarias para iniciar la app

### `npm start`
- Inicia el Servidor para la pagina de deploy
- En la colección de producción de mongoDB

### `npm run dev`
- Inicia el Servidor en [http://localhost:8080]
- En la colección de prueba de mongoDB

### `npm run testApp`
- Inicia los tests de una parte de la app

## Endpoints de la app

### /apidocs

`GET /`

- Documentacion mas detallada de la página

### /home

`GET /` 

- Renderiza la pagina principal de la pagina

`GET /:pid`

- Renderiza los detalles de un producto

### /api/products

`GET /` 

- Lista de productos con los datos de paginacion

`GET /:pid`

- Producto por id

`POST /`

- Crea un producto

`PUT /:pid`

- Actualiza un producto

`DELETE /:pid`

- Elimina un producto


### /api/carts

`GET /` 

- Trae tu carrito por la sesion

`POST /`

- Crea un carrito

`POST /:cid/products/:pid`

- Añade un producto a un carrito

`DELETE /:cid/products/:pid`

- Elimina un producto a un carrito

`DELETE /:cid`

- Elimina todos los productos de un carrito

`PUT /:cid`

- Añade varios productos a un carrito

`POST /:cid/purchase`

- Crea un ticket de compra de lo que habia en el producto


### /api/users

`GET /`

- Renderiza lista de usuarios

`POST /premium/:uname`

- Modifica el rol de un usuario para volverlo a premium

`DELETE /`

- Elimina todos los usuarios inactivos

`DELETE /:uname`

- Elimina un usuario

### /loggerTest

`GET /`

- Prueba los logger

### /mockingproducts

`GET /` 

- Trae 100 usuarios falsos creados por FakerJS

### /carts

`GET /:cid`

- Renderiza un carrito

### /auth

`GET /login` 

- Vista de formulario de login

`POST /login`

- Login con passport local

`GET /faillogin`

- Vista de error del login

`GET /register`

- Vista de formulario de registro

`POST /register`

- Registro con passport local

`GET /failregister`

- Vista de error del register

`GET /currentView`

- Vista de información sobre el usuario actual (sesion)

`GET /github`

- Login con github

`GET /githubcallback`

- Callback de auth con github

`GET /logout`

- Cierra la sesion

`GET /administracion`

- Vista de info secreta de la pagina

`GET /passrecover`

- Vista para insertar tu mail y que te envien un link para recuperar tu contraseña, y cambiarla

`POST /sendemail`

- Envia el email con el link de recuperacion de contraseña

`POST /:uid/documents`

- Sube los documentos de un usuario necesarios para ser premium

`PUT /passrecover`

- Cambia la contraseña de un usuario

### /chat

`GET /`

- Vista de un chat que podes ves y leer mensajes de un chat con socket