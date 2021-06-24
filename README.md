# Discover weekly
Medium: https://nzorn.medium.com/a-practical-introduction-to-kubernetes-persistent-volumes-and-init-containers-209d9ef81d1d

A simple application which makes use of a MySQL database. This solution implements:
- persistent storage (no cloud services are used)
- liveness probes
- init containers

![Solution diagram](https://github.com/nino-a2/discover-weekly/blob/master/solution.png)

## 1. Used technologies:
- AWS ECR
- Kubernetes
- Docker
- Node.js
- Express.js

## 2. Prerequisites:
- You must have the discover-weekly container in a registry

## 3. Steps to deploy:
1. kubectl apply -f manifests/general/
2. kubectl create secret docker-registry registrycredentials \
  --docker-server=account_id.dkr.ecr.region.amazonaws.com \
  --docker-username=AWS \
  --docker-password=$(aws ecr get-login-password) \
  -n discover-weekly
3. kubectl apply -f manifests/database/
4. kubectl apply -f manifests/application/

You can test the solution with the command:
curl localhost:30000

## 4. Generating base64 encoded strings
You can generate base64 strings with the command:
echo -n "stringtoencode" | base64
