# Docker Setup for Sentiment Recommendation System

This project includes Docker support for running the Jupyter notebook in a containerized environment.

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# Access Jupyter Lab at:
# http://localhost:8888
```

### Option 2: Using Docker directly

```bash
# Build the image
docker build -t sentiment-analysis .

# Run the container
docker run -p 8888:8888 \
  -v $(pwd)/notebooks:/app/notebooks \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/src:/app/src \
  sentiment-analysis
```

## Accessing Jupyter Lab

Once the container is running, open your browser and navigate to:
```
http://localhost:8888
```

**Note**: Authentication is disabled by default for development. For production, enable token/password authentication.

## Managing the Container

```bash
# Start the container
docker-compose up -d

# Stop the container
docker-compose down

# View logs
docker-compose logs -f

# Restart the container
docker-compose restart

# Rebuild after changes
docker-compose up -d --build
```

## What's Included

The Docker setup includes:
-  Python 3.9
-  All dependencies from `requirements.txt`
-  Jupyter Lab
-  NLTK data (punkt, stopwords, wordnet, vader_lexicon)
-  Volume mounts for live code editing
-  Resource limits (2 CPU, 4GB RAM)

## Volume Mounts

The following directories are mounted for persistence:
- `./notebooks` → Container's `/app/notebooks`
- `./data` → Container's `/app/data`
- `./src` → Container's `/app/src`

Any changes you make in Jupyter will be saved to your local filesystem.

## Customization

### Change Port

Edit `docker-compose.yml`:
```yaml
ports:
  - "9999:8888"  # Access at localhost:9999
```

### Enable Authentication

Edit `Dockerfile` and remove these flags:
```dockerfile
--NotebookApp.token=''
--NotebookApp.password=''
```

Then set a token:
```bash
docker-compose run jupyter jupyter lab password
```

### Adjust Resources

Edit `docker-compose.yml`:
```yaml
deploy:
  resources:
    limits:
      cpus: '4'      # Increase CPU
      memory: 8G     # Increase RAM
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Remove old containers
docker-compose down -v
docker-compose up -d --build
```

### Port already in use
```bash
# Find what's using port 8888
lsof -i :8888

# Or change the port in docker-compose.yml
```

### Permission issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

### Out of memory
```bash
# Increase Docker memory limit in Docker Desktop settings
# Or reduce resource limits in docker-compose.yml
```

## Production Deployment

For production use:

1. **Enable authentication**:
   ```bash
   docker-compose run jupyter jupyter lab password
   ```

2. **Use HTTPS**: Set up a reverse proxy (nginx) with SSL

3. **Restrict access**: Use firewall rules or VPN

4. **Backup data**: Regularly backup the `data/` directory

5. **Update dependencies**: Keep Python packages up to date

## Stopping and Cleanup

```bash
# Stop container
docker-compose down

# Remove all data (including volumes)
docker-compose down -v

# Remove Docker image
docker rmi sentiment-analysis
```

## Development Workflow

1. Start container: `docker-compose up -d`
2. Open browser: `http://localhost:8888`
3. Edit notebooks in Jupyter Lab
4. Changes are automatically saved to your local filesystem
5. Stop container when done: `docker-compose down`

## CI/CD Integration

You can use this Docker setup in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Build Docker image
  run: docker build -t sentiment-analysis .

- name: Run notebook
  run: docker run sentiment-analysis jupyter nbconvert --execute notebooks/complete_analysis.ipynb
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Jupyter Docker Stacks](https://jupyter-docker-stacks.readthedocs.io/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
