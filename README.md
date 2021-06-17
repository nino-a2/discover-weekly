Prerequisites:
- You must have the discover-weekly container in a registry

Steps to deploy:
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

You can generate base64 strings with the command:

echo -n "stringtoencode" | base64