pipeline {
    agent any //no agents involved

    tools { //use the plugins installed and configured in the jenkins server
        nodejs 'node-20.11.1'
        dockerTool 'docker-latest'
    }
    environment {
        DOCKER_COMPOSE_VERSION = '3.9'
        SCANNER_HOME = tool 'sonar-5.0.0.2966'
    }

    stages { 
        // stage 1 checkout the code from the repository
        stage('Git Checkout') {
            steps {
                git url: 'https://github.com/F21AO2024/F21AOGroup2.git', branch: 'dev'
            }
        }
        // stage 2 check if environment are present
        stage('Check NodeJS Environment') {
            steps {
                sh 'echo "Checking Environment..."'
                sh 'node -v'
                sh 'npm -v'
                sh 'docker --version'
                sh 'docker compose --version'
                sh 'trivy --version'
                sh 'sonar-scanner --version'
            }
        }
        //stage 3: file system scan with trivy
        stage('Trivy Scan') {
            steps {
                //check if trivy exists if not install it
                    sh 'trivy fs --format table -o trivy-report.html .'
                }
            }
            //stage 4: sonarqube scan
            stage('SonarQube Scan') {
                steps {
                    withSonarQubeEnv('sonar-server') {
                        //for simplicity keep the rpojct key same as project name
                        sh ''' 
                        $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName="f21ao-ops" -Dsonar.projectKey="f21ao-ops" \
                        -Dsonar.sources=./gateway ./services/*
                        '''
                    }
                }
            }
            //stage 5: Sonar quality gate
            stage('Quality Gate') {
                steps {
                    script {
                        waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token-dev'
                    }
                }
            }


        //stage 6 build the docker images via docker compose
        stage('Build All Docker Images') {
            steps {
                    sh 'docker-compose -f docker-compose.yml build'
            }
        }
        //stage 7: docker image scan
        stage('Docker image scan') {
            steps {
                script {
                    imageList = sh(returnStdout: true, script: 'docker-compose ps -q').trim().split("\n") 
                    for (image in imageList) {
                        sh "trivy image --format table -o trivy-report-${image}.html ${image}"
                    }
                }
            }
        }
        stage('Docker pushing') {
            steps {
                script {
                    sh 'docker compose push'
                }     
            }
        }

        
        }
    }