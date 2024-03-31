pipeline {
    agent any //no agents involved

    tools { //use the plugins installed and configured in the jenkins server
        nodejs 'node-20.11.1'
        dockerTool 'docker-latest'
    }
    environment {
        DOCKER_COMPOSE_VERSION = '3.9'
        SCANNER_HOME = tool 'sonar-scanner'
        DOCKER_USERNAME = credentials('docker-cred')
        DOCKER_PASSWORD = credentials('docker-cred')
    }

    stages { 
        //stage 1: clean the workspace
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        // stage 2: checkout the code from the repository
        stage('Checkout from Git') {
            steps {
                git url: 'https://github.com/F21AO2024/F21AOGroup2.git', branch: 'dev'
            }
        }

        //stage 3: scan the checked out code with trivy
        stage('Trivy Scan') {
            steps {
                    sh 'trivy fs --format table -o f21ao-dev-branch-trivy-report.html .'
            }
        }
        //stage 4: sonarqube scan
        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube Server') {
                    //for simplicity keep the project key same as project name
                    sh ''' 
                    $SCANNER_HOME/bin/sonar-scanner -X \
                    -Dsonar.projectName="f21ao-ops" \
                    -Dsonar.projectKey="f21ao-ops" \
                    -Dsonar.sources=./gateway,./services/lab-treatment-service,./services/patient-registration-service,./services/ward-admissions-service
                    '''
                }
            }
        }
        //stage 5: Sonar quality gate - it hangs here for some reason
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
                    sh 'docker compose -f docker-compose.yml build'
            }
        }
        //stage 7: docker image scan
        stage('Docker image scan') {
            steps {
                script {
                    imageList = sh(returnStdout: true, script: 'docker compose ps -q').trim().split("\n") 
                    for (image in imageList) {
                        sh "trivy fs --format table -o trivy-report-${image}.html ${image}"
                    }
                }
            }
        }

        stage('Docker pushing') {
            steps {
                script {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    sh 'docker compose push notvolk/zlf21ao-containers'
                }     
            }
        }

        // stage('Docker pushing') {
        //     steps {
        //         script {
        //             withDockerRegistry([credentialsId: 'docker-cred', url: 'https://index.docker.io/v1/']) {
        //                 sh 'docker compose push notvolk/zlf21ao-containers'
        //         }     
        //     }
        // }

        
        }
    }