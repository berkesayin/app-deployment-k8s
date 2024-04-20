## App Deployment - Docker & Kubernetes

This is a multi-container Sign Up Form project. `Dockerfile` and `Docker Compose` used here to run the application on 3 containers. Follow the contents for details and usage.

### Table of Contents

1. [Introduction](#intro)
2. [Technologies](#tech)
3. [Dockerizing Frontend](#dockerize-fe)
4. [Dockerizing Backend](#dockerize-be)
5. [Docker Compose Configuration](#compose)
6. [Application Running With Containers](#app-containers)
7. [Push Images To Dockerhub](#dockerhub)
8. [Setup Minikube Cluster](#minikube)
9. [About The Project](#project-k8s)
10. [External Configuration With ConfigMap and Secret](#configmap-secret)
11. [Deploy MongoDB Database](#deploy-mongo)
12. [Deploy Web App Backend](#deploy-be)
13. [Deploy Web App Frontend](#deploy-fe)
14. [Create All Components In Kubernetes](#create-components)
15. [Get Information About K8S Components](#get-info)
16. [Access Web App In Browser](#access)

### Introduction <a name="intro"></a>

This is a multi-container Sign-Up Form application running on frontend, backend and database containers built with `Dockerfile` and `Docker Compose`.

This is a multi-container Sign Up Form project. This repository contains all the necessary code and configurations to deploy a fully functional Sign Up form application, comprising frontend, backend, and database components. By containerizing each part with Docker and utilizing Docker Compose, deployment becomes seamless and efficient.

### Technologies <a name="tech"></a>

The technologies used to develop and run the project listed below:

##### Frontend

- TypeScript
- React
- React - Semantic UI

##### Backend

- TypeScript
- Express (Node.js)

##### Database

- MongoDB

##### Containerization

The application runs on 3 containers for frontend, backend and database components.

- Dockerfile (Building image)
- Docker compose (Running multi-container application)

### Dockerizing Frontend <a name="dockerizing-fe"></a>

The frontend part of the application is containerized using Docker. This ensures that the frontend environment remains consistent across different platforms and deployments. To Dockerize the frontend, follow the steps outlined in the frontend `Dockerfile`.

```dockerfile
FROM node:21-slim
WORKDIR /react-app
COPY package.json .
RUN npm install
COPY src/ .
COPY . .
RUN npm install -g live-server
RUN npm run build
EXPOSE 8080
CMD ["live-server", "dist"]
```

The `.dockerignore` file is used also here to specify files and directories that should be excluded from the context when building the Docker image.

The frontend image is built using `Docker Compose` in `docker-compose.yaml` configuration file for frontend part of the application.

### Dockerizing Backend <a name="dockerizing-be"></a>

Similar to the frontend, the backend of the application is also Dockerized. This ensures easy deployment and scalability. Refer to the backend Dockerfile for instructions on Dockerizing the backend.

```dockerfile
FROM node:21-slim
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "./dist/src/server.js"]
```

The `.dockerignore` file is used also here to specify files and directories that should be excluded from the context when building the Docker image.

The backend image is also built using `Docker Compose` in `docker-compose.yaml` configuration file for backend part of the application.

### Docker Compose Configuration <a name="compose"></a>

`Docker Compose` is a tool for defining and running `multi-container` applications. The project runs 3 containers with compose configuration.

The `docker-compose.yml` file in the root directory contains the configuration for running the entire application stack, including frontend, backend, and the MongoDB database.

```yaml
version: "3.4"
services:
  signup-backend:
    container_name: signup-be-c
    build: ./backend
    ports:
      - 3000:3000
  signup-frontend:
    container_name: signup-fe-c
    build: ./frontend
    ports:
      - 9000:8080
  mongodb:
    container_name: mongo-db
    image: mongo
    ports:
      - 27017:27017
    volumes:
      - todo-app-data:/data/db
volumes:
  todo-app-data:
```

Locate the root directory of the project at the terminal. Execute the command to run containers defined at `docker-compose.yaml` file.

Build

```bash
docker-compose build
```

Images Pulled

```bash
docker images
```

```bash
REPOSITORY                           TAG       IMAGE ID       CREATED          SIZE
app-deployment-signup-frontend       latest    0971800f6a75   8 seconds ago    775MB
app-deployment-signup-backend        latest    075811fe9231   52 seconds ago   601MB
mongo                                latest    3105b19333c4   4 weeks ago      720MB
```

The names for the images will be changed before pushing them to Docker registry (Dockerhub).

Run

```bash
docker-compose up
```

```
[+] Running 5/5
✔ Network app-deployment_default         Created 0.0s
✔ Volume "app-deployment_todo-app-data"  Created 0.0s
✔ Container mongo-db                     Created 0.1s
✔ Container signup-fe-c                  Created 0.1s
✔ Container signup-be-c                  Created 0.1s
```

### Application Running With Containers<a name="app"></a>

The 3 containers for frontend, backend and database components are up and running after executing `docker-compose up` command. List running containers with this command:

```bash
docker ps
```

```bash
CONTAINER ID   IMAGE                            COMMAND                  CREATED         STATUS         PORTS                      NAMES
47608cdfd553   mongo                            "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:27017->27017/tcp   mongo-db
4778aa45c0eb   app-deployment-signup-backend    "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:3000->3000/tcp     signup-be-c
4cede8edde35   app-deployment-signup-frontend   "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:9000->8080/tcp     signup-fe-c
```

- Frontend: `http://localhost:9000`

![img](./assets/frontend1.png)

- Backend: `http://localhost:3000`

![img](./assets/backend1.png)

- Request from Postman

![img](./assets/postman1.png)

- Database: `mongodb://localhost:27017`

![img](./assets/mongodb1.png)

### Push Images To Dockerhub <a name="dockerhub"></a>

##### Push Backend Image

Create new public repository with name `dockerhub-username/signup-form-backend` at `Dockerhub`.

![img](./assets/dockerhub1.png)

First of all, save the new image by finding the container ID (using `docker container ls`) and then committing it to a new image name.

```bash
docker container ls -a
```

```bash
CONTAINER ID   IMAGE                            COMMAND                  CREATED          STATUS          PORTS                      NAMES
4778aa45c0eb   app-deployment-signup-backend    "docker-entrypoint.s…"   21 minutes ago   Up 21 minutes   0.0.0.0:3000->3000/tcp     signup-be-c
```

A Container ID for the backend image = `4778aa45c0eb`

Now, save the new image by using this container ID and committing it to a new image name.

```bash
docker container commit 4778aa45c0eb berkesayin/signup-form-backend:1.0
```

```bash
docker images
```

```bash
REPOSITORY                           TAG       IMAGE ID       CREATED          SIZE
berkesayin/signup-form-backend       1.0       b99f2cacb4db   7 seconds ago    601MB
```

Login at terminal.

```bash
docker login
```

or

```bash
docker login -u "username" -p "password" docker.io
```

Push the image to Dockerhub registry.

```bash
docker push berkesayin/signup-form-backend:1.0
```

The push refers to repository [docker.io/berkesayin/signup-form-backend]

##### Push Frontend Image

Create new public repository with name `dockerhub-username/signup-form-frontend` at `Dockerhub`.

![img](./assets/dockerhub1.png)

First of all, save the new image by finding the container ID (using `docker container ls`) and then committing it to a new image name.

```bash
docker container ls -a
```

```bash
CONTAINER ID   IMAGE                            COMMAND                  CREATED          STATUS          PORTS                      NAMES
4cede8edde35   app-deployment-signup-frontend   "docker-entrypoint.s…"   49 minutes ago   Up 49 minutes   0.0.0.0:9000->8080/tcp     signup-fe-c
```

A Container ID for the backend image = `4cede8edde35`

Now, save the new image by using this container ID and committing it to a new image name.

```bash
docker container commit 4cede8edde35 berkesayin/signup-form-frontend:1.0
```

```bash
docker images
```

```bash
REPOSITORY                           TAG       IMAGE ID       CREATED          SIZE
berkesayin/signup-form-frontend      1.0       cf6faa928a5a   9 seconds ago    775MB
```

Login at terminal.

```bash
docker login
```

or

```bash
docker login -u "username" -p "password" docker.io
```

Push the image to Dockerhub registry.

```bash
docker push berkesayin/signup-form-frontend:1.0
```

The push refers to repository [docker.io/berkesayin/signup-form-frontend]

Images pushed to `Dockerhub`.

![img](./assets/dockerhub2.png)

### Setup Minikube Cluster <a name="minikube"></a>

A `Kubernetes cluster` can be deployed on either physical or virtual machines. To get started with Kubernetes development, `Minikube` can be used.

`Minikube` is a lightweight Kubernetes implementation that creates a `VM` on your local machine and deploys a simple cluster containing only one node. Minikube is available for `Linux`, `macOS`, and `Windows` systems.

The `Minikube CLI` provides basic bootstrapping operations for working with your cluster including start, stop, status, and delete.

##### Kubectl

`kubectl` is the Kubernetes-specific command line tool that lets you communicate and control Kubernetes clusters. Whether you’re managing, creating, updating or deleting resources on your Kubernetes platform, `kubectl` is an essential tool. It enables communications between the `Kubernetes API` and the `Control Plane`.

##### Install Minikube

`Minikube` can run either as a `container` or a `Virtual Machine`. Docker (container) is used in this example. Make sure it's installed for your system.

```bash
brew install minikube
```

##### Start Minikube Cluster

```bash
minikube start
```

or

```bash
minikube start --driver docker
```

![img](./assets/minikube1.png)

##### Check Container

```bash
docker ps
```

```bash
CONTAINER ID   IMAGE                                 COMMAND                  CREATED       STATUS         PORTS                                                                                                                                  NAMES
a5e09d3f8059   gcr.io/k8s-minikube/kicbase:v0.0.42   "/usr/local/bin/entr…"   4 weeks ago   Up 4 minutes   127.0.0.1:53230->22/tcp, 127.0.0.1:53231->2376/tcp, 127.0.0.1:53233->5000/tcp, 127.0.0.1:53229->8443/tcp, 127.0.0.1:53232->32443/tcp   minikube
```

##### Check The Status Of The Cluster

```bash
minikube status
```

```bash
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

##### Get Info About The Node In The Cluster

```bash
kubectl get node
```

```bash
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   32d   v1.28.3
```

### About The Project <a name="project-k8s"></a>

We will deploy a `MongoDB` database and a `web application` comprised of `frontend` and `backend` parts which will connect to the `MongoDB` database using external configuration data from `ConfigMap` and the `Secret`.

- `mongo-config.yaml` and `mongo secret.yaml` : Add external configuration for `DB URL` and credentials with `ConfigMap` and `Secret`
- `mongo.yaml` : Deploy `MongoDB` database
- `web-app-fe.yaml` : Deploy `web app backend`
- `web-app-be.yaml` : Deploy `web app frontend`

### External Configuration With ConfigMap and Secret <a name="configmap-secret"></a>

##### ConfigMap

`mongo-config.yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mongo-config
data:
  mongo-url: mongo-service
```

`mongo-secret.yaml`

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mongo-secret
type: Opaque
data:
  mongo-user: bW9uZ291c2Vy
  mongo-password: MTIzNDU2
```

### Deploy MongoDB Database <a name="deploy-mongo"></a>

A `Kubernetes deployment` provides a means of changing or modifying the state of a pod, which may be one or more containers that are running, or a group of duplicate pods, known as ReplicaSets. Using a deployment allows you to easily keep a group of identical pods running with a common configuration. Once you have defined and deployed your `deployment` Kubernetes will then work to make sure all pods managed by the deployment meet whatever requirements you have set.

`mongo.yaml`: `Deployment` and `Service` Configuration for `MongoDB`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo-deployment
  labels:
    app: mongo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
        - name: mongodb
          image: mongo:5.0
          ports:
            - containerPort: 27017
---
apiVersion: v1
kind: Service
metadata:
  name: mongo-service
spec:
  selector:
    app: mongo
  ports:
    - protocol: TCP
      port: 80
      targetPort: 27017
```

We added a `Service` configuration because every application needs a service in `Kubernetes` and that's either a separate `yaml unit` or `yaml section` and we're going to separate it using three dashes `---` which is basic `yaml` syntax.

### Deploy Web App Backend <a name="deploy-be"></a>

`webapp-be.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp-be-deployment
  labels:
    app: webapp-be
spec:
  replicas: 1
  selector:
    matchLabels:
      app: webapp-be
  template:
    metadata:
      labels:
        app: webapp-be
    spec:
      containers:
        - name: webapp-be
          image: berkesayin/signup-form-backend
          ports:
            - containerPort: 3000
          env:
            - name: USER_NAME
              valueFrom:
                secretKeyRef:
                  name: mongo-secret
                  key: mongo-user
            - name: USER_PWD
              valueFrom:
                secretKeyRef:
                  name: mongo-secret
                  key: mongo-password
            - name: DB_URL
              valueFrom:
                configMapKeyRef:
                  name: mongo-config
                  key: mongo-url
---
apiVersion: v1
kind: Service
metadata:
  name: webapp-be-service
spec:
  type: NodePort
  selector:
    app: webapp-be
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
      nodePort: 30100
```

The `backend deployment` includes environment variable configurations for connecting to `MongoDB`.

### Deploy Web App Frontend <a name="deploy-fe"></a>

`webapp-fe.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp-fe-deployment
  labels:
    app: webapp-fe
spec:
  replicas: 1
  selector:
    matchLabels:
      app: webapp-fe
  template:
    metadata:
      labels:
        app: webapp-fe
    spec:
      containers:
        - name: webapp-fe
          image: berkesayin/form-app-frontend
          ports:
            - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: webapp-fe-service
spec:
  type: NodePort
  selector:
    app: webapp-fe
  ports:
    - protocol: TCP
      port: 9000 # Matches the port exposed previously with Docker Compose
      targetPort: 8080 # Matches the port React app is running inside the container
      nodePort: 30101
```

### Create All Components In Kubernetes <a name="deploy-fe"></a>

```bash
kubectl apply -f <file-name.yaml>
```

Firstly we need to create the external configurations because they need to be there when we create `MongoDB` and `web application deployments`. Because they reference those configurations.

```bash
kubectl apply -f mongo-config.yaml
```

```bash
kubectl apply -f mongo-secret.yaml
```

```bash
kubectl apply -f mongo.yaml
```

```bash
kubectl apply -f webapp-be.yaml
```

```bash
kubectl apply -f webapp-fe.yaml
```

##### Check Node

```bash
kubectl get node
```

```bash
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   32d   v1.28.3
```

##### Check Pods

```bash
kubectl get pods
```

```bash
NAME                                    READY   STATUS             RESTARTS        AGE
mongo-deployment-7f85cb64d6-bw6bc       1/1     Running            2 (7m41s ago)   23m
webapp-be-deployment-5448fd9cc6-5jjzw   1/1     Running            0               5m2s
webapp-fe-deployment-7d9bbd8f59-vzppj   1/1     Running            0               4m7s
```

### Create All Components In Kubernetes <a name="get-info"></a>

##### Get All

```bash
kubectl get all
```

This command includes `deployments`, the `pods` behind the `deployment`, and all the `services`.

```bash
NAME                                        READY   STATUS             RESTARTS         AGE
pod/mongo-deployment-7f85cb64d6-bw6bc       1/1     Running            2 (10m ago)      26m
pod/webapp-be-deployment-5448fd9cc6-5jjzw   1/1     Running            0                8m7s
pod/webapp-fe-deployment-7d9bbd8f59-vzppj   1/1     Running            0                7m12s
```

```bash
NAME                        TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/kubernetes          ClusterIP   10.96.0.1       <none>        443/TCP          32d
service/mongo-service       ClusterIP   10.96.149.186   <none>        80/TCP           31d
service/webapp-be-service   NodePort    10.100.47.128   <none>        3000:30200/TCP   20m
service/webapp-fe-service   NodePort    10.97.246.146   <none>        9000:30201/TCP   20m
```

```bash
NAME                                   READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/mongo-deployment       1/1     1            1           31d
deployment.apps/webapp-be-deployment   1/1     1            1           21m
deployment.apps/webapp-fe-deployment   1/1     1            1           20m
```

##### Get Components' Info

ConfigMap

```bash
kubectl get configmap
```

```bash
NAME               DATA   AGE
kube-root-ca.crt   1      32d
mongo-config       1      31d
```

Secret

```bash
kubectl get secret
```

```bash
NAME           TYPE     DATA   AGE
mongo-secret   Opaque   2      31d
```

Deployment

```bash
kubectl get deployment
```

```bash
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
mongo-deployment       1/1     1            1           31d
webapp-be-deployment   1/1     1            1           38m
webapp-fe-deployment   1/1     1            1           37m
```

Service

```bash
kubectl get service
```

```bash
NAME                TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes          ClusterIP   10.96.0.1       <none>        443/TCP          32d
mongo-service       ClusterIP   10.96.149.186   <none>        80/TCP           31d
webapp-be-service   NodePort    10.100.47.128   <none>        3000:30200/TCP   39m
webapp-fe-service   NodePort    10.97.246.146   <none>        9000:30201/TCP   39m
```

### Logs

```bash
kubectl get pods
```

```bash
NAME                                    READY   STATUS             RESTARTS         AGE
mongo-deployment-7f85cb64d6-bw6bc       1/1     Running            2 (30m ago)      46m
webapp-be-deployment-5448fd9cc6-5jjzw   1/1     Running            0                27m
webapp-fe-deployment-7d9bbd8f59-vzppj   1/1     Running            0                27m
```

Logs

```bash
kubectl logs mongo-deployment-7f85cb64d6-bw6bc
```

```bash
kubectl logs webapp-be-deployment-5448fd9cc6-5jjzw
```

```bash
kubectl logs webapp-fe-deployment-7d9bbd8f59-vzppj
```

### Access Web App In Browser <a name="access"></a>

### Minikube IP

```bash
minikube ip
```

```bash
192.168.49.2
```

or

```bash
kubectl get node -o wide
```

We can also use `-o wide` option with any other get command or services, pods etc to get some additional info.

```bash
NAME       STATUS   ROLES           AGE   VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION    CONTAINER-RUNTIME
minikube   Ready    control-plane   32d   v1.28.3   192.168.49.2   <none>        Ubuntu 22.04.3 LTS   6.6.12-linuxkit   docker://24.0.7
```

Here, we get the `INTERNAL_IP` address of the `node`: `192.168.49.2`

So, we found the minikube IP address. `192.168.49.2`. Now, we access the application at this port. `30200`

`192.168.49.2:30200`
