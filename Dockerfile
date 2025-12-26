# Use official Python runtime as base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Jupyter and additional tools
RUN pip install --no-cache-dir \
    jupyter \
    jupyterlab \
    notebook \
    ipywidgets

# Download NLTK data
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet'); nltk.download('vader_lexicon')"

# Copy project files
COPY . .

# Create necessary directories
RUN mkdir -p data/raw data/processed notebooks src

# Expose Jupyter port
EXPOSE 8888

# Set environment variables
ENV JUPYTER_ENABLE_LAB=yes
ENV PYTHONUNBUFFERED=1

# Create a non-root user for security
RUN useradd -m -u 1000 jupyter && \
    chown -R jupyter:jupyter /app

USER jupyter

# Start Jupyter Lab
CMD ["jupyter", "lab", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root", "--NotebookApp.token=''", "--NotebookApp.password=''"]
