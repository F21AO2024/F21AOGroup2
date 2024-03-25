pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_VERSION = '3.9'
    }

    stages {
        stage('Install Docker Compose') {
            steps {
                sh '''
                    curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o docker-compose
                    chmod +x docker-compose
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'docker-compose -f docker-compose.yml build'
            }
        }

        stage('Run') {
            steps {
                sh 'docker-compose -f docker-compose.yml up -d'
            }
        }
    }

    post {
        always {
            sh 'docker-compose -f docker-compose.yml down'
        }
    }
}