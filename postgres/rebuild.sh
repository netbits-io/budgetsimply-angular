(docker ps -a | grep 'postgres-bills' | awk '{print $1}' | xargs --no-run-if-empty docker rm -f)
(docker build --rm=false -t postgres-bills .)
docker run --name postgresBills --restart='always' -d -p 5422:5432 postgres-bills