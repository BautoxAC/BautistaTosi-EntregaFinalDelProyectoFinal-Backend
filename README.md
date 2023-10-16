# Explicación
Este proyecto es un API básica que sigue las consignas de la tercera preEntrega del proyecto final de CoderHouse funcionando con:
- [x] MongoDB
- [x] Handlebars
- [x] NodeJS
- [x] Css
- [x] ExpressJs
- [x] GIT
- [x] DotEnv

## Funcionalidades:
- [x] Iniciar y registrar tu sesión
- [x] Manejar tu carrito
- [x] Comprar tu carrito
- [x] Ver los productos disponibles
- [x] Ver tu perfil
- [x] Utilizar el chat
- [x] Crear productos 

## Link del deploy
```
[https://pf-backend-bautistatosi.onrender.com]
```


## Esquema del DotEnv:
- Se encuentran dos ejemplos de como son los dos nombres que utiliza la app para funcionar y sus variables necesarias

## Para iniciar el proyectocon nodeJS

### `npm i -d`
- Instala las dependencias necesarias para hacer development

### `npm i`
- Instala las dependencias necesarias para iniciar la app

### `npm start`
- Inicia el Servidor en [http://localhost:8080]
- En la colección de producción de mongoDB

### `npm run dev`
- Inicia el Servidor en [http://localhost:3000]
- En la colección de prueba de mongoDB

### `npm run testApp`
- Inicia los tests de toda la app pedida por la entrega

## Endpoints de la app

### /apidocs

`GET /` 
Documentacion mas detallada de la página

### /api/products

- `GET /` 
Lista de productos con los datos de paginacion
- `GET /:pid` 
Producto por id
- `POST /` 
Crea un producto
- `PUT /:pid` 
Actualiza un producto
- `DEL /:pid`
Elimina un producto


### /api/carts

### /api/users

### /loggerTest

### /mockingproducts

### /home

### /carts

### /auth
#
/chat

## Get list of Things

### Request

`GET /thing/`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    []

## Create a new Thing

### Request

`POST /thing/`

    curl -i -H 'Accept: application/json' -d 'name=Foo&status=new' http://localhost:7000/thing

### Response

    HTTP/1.1 201 Created
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 201 Created
    Connection: close
    Content-Type: application/json
    Location: /thing/1
    Content-Length: 36

    {"id":1,"name":"Foo","status":"new"}

## Get a specific Thing

### Request

`GET /thing/id`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/1

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 36

    {"id":1,"name":"Foo","status":"new"}

## Get a non-existent Thing

### Request

`GET /thing/id`

    curl -i -H 'Accept: application/json' http://localhost:7000/thing/9999

### Response

    HTTP/1.1 404 Not Found
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 404 Not Found
    Connection: close
    Content-Type: application/json
    Content-Length: 35

    {"status":404,"reason":"Not found"}

## Create another new Thing

### Request

`POST /thing/`

    curl -i -H 'Accept: application/json' -d 'name=Bar&junk=rubbish' http://localhost:7000/thing

### Response

    HTTP/1.1 201 Created
    Date: Thu, 24 Feb 2011 12:36:31 GMT
    Status: 201 Created
    Connection: close
    Content-Type: application/json
    Location: /thing/2
    Content-Length: 35