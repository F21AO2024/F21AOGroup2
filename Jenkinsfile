pipeline {
  agent any
  environment {
      DOCKER_COMPOSE_VERSION = '3.9'
  }
  
  stages {
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