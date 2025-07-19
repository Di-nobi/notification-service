# Notification Service

The **Notification Service** listens for `order.created` and `payment.confirmed` events from RabbitMQ and logs notifications in Redis.

---

## 🧰 Prerequisites

- Node.js 18.x  
- Docker and Docker Compose V2  
- Git

---
## Prerequisites

- A fresh Ubuntu 22.04 or Linux Mint 22 system  
- Sudo privileges  
- Internet access for downloading packages  

---

## Installation Steps

### Step 1: Update the Package Index

Update the system's package index to ensure you have the latest package information.

```bash
sudo apt-get update
curl -s https://dl.cloudsmith.io/public/caddy/stable/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg

Edit the caddy file:
sudo nano /etc/apt/sources.list.d/caddy-stable.list

Ensure this file reside within if not paste it:
deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/debian any-version main

sudo rm /etc/apt/sources.list.d/docker.list

sudo rm /etc/apt/sources.list.d/stripe-cli-deb.list
sudo apt-get update

sudo apt-get install -y ca-certificates curl gnupg lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu jammy stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
sudo apt-get install -y docker-compose-plugin
docker compose version

git clone https://github.com/Di-nobi/notification-service.git
cd notification-service
npm install

###env
REDIS_HOST=redis
REDIS_PORT=6379
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
API_KEY=1234567812
SWAGGER_API_NAME=Notification Service
SWAGGER_API_DESCRIPTION=Notification processing service
SWAGGER_API_CURRENT_VERSION=1.0
SWAGGER_API_ROOT=api

docker compose  up --build -d

services:
  notification-service:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3005:3000'
    env_file:
      - .env
    depends_on:
      redis:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    networks:
      - shared-network

  redis:
    image: redis:6
    ports:
      - '6383:6379'
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - shared-network

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - '5674:5672'
      - '15674:15672'
    environment:
      - RABBITMQ_DEFAULT_USER=guest
      - RABBITMQ_DEFAULT_PASS=guest
    healthcheck:
      test: ["CMD", "rabbitmqctl", "status"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - shared-network

networks:
  shared-network:
    name: shared-network
    external: true



| Method | Endpoint            | Description              | Request Body | Response Body                                                                                                                                        |
| ------ | ------------------- | ------------------------ | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | /notifications/\:id | Get a notification by ID | None         | `{ "success": true, "message": "Notification retrieved", "data": { "id": "string", "type": "string", "message": "string", "createdAt": "string" } }` |

</details>