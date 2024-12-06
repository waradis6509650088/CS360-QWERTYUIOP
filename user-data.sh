#!/bin/bash

# Update system and install dependencies
sudo yum update -y
sudo yum install -y docker git

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add ec2-user to docker group
sudo usermod -aG docker ec2-user
sudo chmod 666 /var/run/docker.sock

# Create application directories with correct permissions
sudo mkdir -p /app/public/uploads
sudo chown -R ec2-user:docker /app
sudo chmod -R 775 /app

# Create a script to set up docker permissions on boot
cat << 'EOF' | sudo tee /usr/local/bin/docker-permissions.sh
#!/bin/bash
chmod 666 /var/run/docker.sock
chown -R ec2-user:docker /app
EOF

sudo chmod +x /usr/local/bin/docker-permissions.sh

# Add script to startup
echo "@reboot root /usr/local/bin/docker-permissions.sh" | sudo tee -a /etc/crontab

# Restart Docker to apply changes
sudo systemctl restart docker

# Create deployment directory
sudo mkdir -p /home/ec2-user/deployment
sudo chown -R ec2-user:ec2-user /home/ec2-user/deployment