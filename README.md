== Run on your local machine

`docker run -ti -p 27017:27017 -e MONGODB_USER=flight -e MONGODB_PASSWORD=flight -e MONGODB_DATABASE=flight -e MONGODB_ADMIN_PASSWORD=flight centos/mongodb-26-centos7` and `MONGO_URL="flight:flight@localhost/flight" npm start`
