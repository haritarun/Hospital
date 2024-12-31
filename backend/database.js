// const { Client } = require('pg');

// const client = new Client({
//   user: 'postgres',
//   password: 'udaysai',
//   host: 'localhost',
//   port: 5432,
// });

// async function createDatabase() {
//   try {
//     await client.connect();
//     console.log('Connected to PostgreSQL server.');

//     const dbName = 'hospital';  
//     const query = `CREATE DATABASE ${dbName}`;

//     await client.query(query);
//     console.log(`Database ${dbName} created successfully.`);
//   } catch (error) {
//     console.error('Error creating database:', error);
//   } finally {
//     await client.end();
//     console.log('Disconnected from PostgreSQL server.');
//   }
// }

// createDatabase();
