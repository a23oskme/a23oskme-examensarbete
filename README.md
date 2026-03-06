## Set up database

Start dabase (-d = detached mode, runs in background):
```
docker compose up -d
```

Stop the database: 
```
docker compose down
```
Reset the database (removes the volumes and all data):
```
docker compose down -v
```

Check status (of ***all*** containers):
```
docker ps
```

Open a psql session inside the running Postgres container:
(psql is PostgreSQL's command line client, which lets you run SQL commands) 
```
docker exec -it thesis_db psql -U thesis_user -d thesis_db
```
Exit psql: 
```
\q
```


## To start server

Run in /server terminal
```
npm start
```

# Test database connection through the terminal

```
curl http://localhost:3000/api/test-table
```
