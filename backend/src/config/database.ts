import mysql from "mysql";


export const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',  
    database : 'animalslist',
    port     : 3307
  });
  
  connection.connect((err: any) => {
      if (err) {
          console.error('Error connecting to the database:', err);
          return;
      }
      console.log("Connection established successfully");
  });