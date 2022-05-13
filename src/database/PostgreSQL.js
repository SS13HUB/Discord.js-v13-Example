
const { Pool, Client } = require('pg');
const {sql} = require('@databases/pg');
require('dotenv').config(); //({ path: './../../.env' });
const connectionString = process.env.DB_URL;

const base_path = './src/database/';
const db_create = base_path + 'db_create.sql';
const db_drop   = base_path + 'db_drop.sql';
const db_insert = base_path + 'db_insert.sql';
const db_select = base_path + 'db_select.sql';

const settings = {
    "db_recreate": true
}

//var sql = fs.readFileSync(db_create).toString();
console.clear();
//console.log(sql.file(db_create));

function doRequest(pool, _path) {
    return new Promise((resolve, reject) => {
        pool.query(
            sql.file(_path)._items[0].text, (err, res, fields) => {
            if (err) {console.error(err); process.exitCode = 1; return reject(error);} // throw err;
            if (res) resolve("OK?"); //console.log("OK?\n", res);
            //console.log(results[0].solution);
        });
    });
}

async function mainLoop() {
    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    if (settings["db_recreate"]) {
        console.log("db_recreate:");
        await doRequest(pool, db_drop)
            .then((val) => {console.log(val);})
            .catch((err) => {console.error(err);});
    }

    console.log("db_create:");
    await doRequest(pool, db_create)
        .then((val) => {console.log(val);})
        .catch((err) => {console.error(err);});


    /* const client = new Client({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
    })
    client.connect()
    client.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    client.end()
    }) */

    await pool.end()
    .then((val) => {console.log(val);})
    .catch((err) => {console.error(err);});
};

mainLoop();




/* 
const { Pool, Client, sql } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    password: process.env.PGPASSWORD,
    sslmode: process.env.PGSSLMODE
});

/* const client = new Client({
    connectionString: process.env.DB_URL + '/' + process.env.PGDATABASE, //process.env.DATABASE_URL,
    ssl: false //{rejectUnauthorized: false}
}); */

/* require('dotenv').config({ path: './../../.env' });
console.clear();  */

// npm i pg
// node ".\src\database\PostgreSQL.js"
// https://node-postgres.com/features/connecting
// https://devcenter.heroku.com/articles/connecting-heroku-postgres#connecting-in-node-js

/* (async () => {
    console.log('hi');
    pool.connect(async function(err, client, done) {
        if (err) throw err;
        const res = await client.query(
            /* sql.file('./PostgreSQL_create.sql')).catch(ex => {console.error(ex);process.exitCode = 1;}).then(() => db.dispose(); */
            /* `CREATE TABLE IF NOT EXISTS public."Guilds"
            (
                id integer NOT NULL,
                name character(1) COLLATE pg_catalog."default",
                invite_link character(1) COLLATE pg_catalog."default",
                was_alive_on_update boolean,
                CONSTRAINT "Discord_servers_meta_pkey" PRIMARY KEY (id)
            )
            TABLESPACE pg_default;
            
            ALTER TABLE IF EXISTS public."Guilds"
                OWNER to current_user;`
        );
        done();
    });
    console.log('bye');
})(); */








// https://stackoverflow.com/q/20813154/8175291

/* var conStringPri = process.env.DB_URL + '/postgres';
var conStringPost = process.env.DB_URL + '/' + process.env.PGDATABASE;

pool.connect(function(err, client, done) { // connect to postgres db
    if (err)
        console.log('Error while connecting: ' + err); 
    client.query('CREATE DATABASE ' + process.env.PGDATABASE, function(err) { // create user's db
        if (err) 
            console.log('ignoring the error'); // ignore if the db is there
        client.end(); // close the connection

        // create a new connection to the new db
        client.connect(conStringPost, function(err, clientOrg, done) {
            // create the table
            clientOrg.query('CREATE TABLE IF NOT EXISTS ' + process.env.DB_TABLE + ' ' +
                    '(emp_id INT, emp_name CHAR, emp_dep )');
        });
    });
}); */

/* pool.end(); */
