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
