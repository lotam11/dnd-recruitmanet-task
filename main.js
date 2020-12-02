import Koa from 'koa'; 
import Routing from './routing/routing.js';
import Knex from 'knex'
const app = new Koa()

var knex = Knex({
    client: 'mysql',
    version: '5.7',
    connection: {
      host : '127.0.0.1',
      user : 'your_database_user',
      password : 'your_database_password',
      database : 'myapp_test'
    }
  });

console.log(Routing);
Routing.map(route => app.use(route.routes()))

console.log('Server running in http://localhost:' + (process.env.PORT || 8181))

app.listen(8181)
