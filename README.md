[![node.js version](https://badgen.net/npm/node/express)](https://npmjs.com/package/express)

## Property Market
> Platform for buying and selling of property, it is aims for make it easy customer and seller in transaction. 

<br>

## 🐳Installation project with docker

clone project
``` bson
git clone https://github.com/bimaagung/property-market-adonisjs
```

run docker compose in folder project
``` bson
docker-compose up -t
```

enter terminal application container 
```bson
npm run dockerAttach
```

migrate table 
```bson
node ace migration:run
```

open app in browser
```bson
localhost:9229
```

<br>

## 🚀 Demo On Local

test each endpoint in swagger

open swagger in browser 
```bson
localhost:9229/docs
```

<br>

<br>

## 📁 Project Structure

```
   ├───app
   ├───Controllers
   │   └───Http
   ├───Exceptions
   ├───Middleware
   └───Models
   ├───docs
   ├───controllers
   ├───models
   └───swagger
   └───tests
    └───functional
```

<br>


## 💻 Built with

- Node JS
- AdonisJS
- Postgres
- Lucid ORM
- JWT Auth
- Swagger



