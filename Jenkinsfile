pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    docker.image('docker').inside {
                        sh 'docker compose down'
                        sh 'docker compose build'
                        sh 'docker compose up -d'
                    }
                }
            }
        }
    }
}