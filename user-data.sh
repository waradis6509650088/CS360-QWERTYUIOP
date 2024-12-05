#!/bin/bash
# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create directory for uploads
sudo mkdir -p /app/public/uploads
sudo chmod -R 775 /app/public/uploads
sudo chown -R ec2-user:ec2-user /app

# Restart Docker
sudo systemctl restart docker