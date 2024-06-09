# frontend

docker build -t devopszms2024/zms-devops-angular-app .
docker push devopszms2024/zms-devops-angular-app
kubectl -n backend replace --force -f ../k8s