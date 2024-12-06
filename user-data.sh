#!/bin/bash

# Update system and install dependencies
sudo yum update -y
sudo yum install -y docker git

# Configure Docker storage options
sudo mkdir -p /etc/docker
cat << EOF | sudo tee /etc/docker/daemon.json
{
    "storage-driver": "overlay2",
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    }
}
EOF

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

# Create disk space monitoring script
cat << 'EOF' | sudo tee /usr/local/bin/monitor-disk-space.sh
#!/bin/bash

THRESHOLD=90
USAGE=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)

if [ $USAGE -gt $THRESHOLD ]; then
    echo "Disk space usage is above ${THRESHOLD}%. Cleaning up..."
    docker system prune -af
fi
EOF

sudo chmod +x /usr/local/bin/monitor-disk-space.sh

# Add disk monitoring to crontab
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-disk-space.sh") | crontab -

# Clean up yum cache
sudo yum clean all
sudo rm -rf /var/cache/yum