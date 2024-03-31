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
        stage('Get CWD') {
            steps {
                sh 'echo "CURRENT DIRECTORY:" && pwd'
                sh 'echo "JENKINS VERSION:" && jenkins --version'
                sh 'echo "TRIVY VERSION:" && trivy --version'
                sh 'echo "DOCKER VERSION:" && docker --version'
            }
        }

        // stage 2: checkout the code from the repository
        stage('Checkout from Git') {
            steps {
                git url: 'https://github.com/F21AO2024/F21AOGroup2.git', branch: 'dev'
            }
        }

        //stage 3: scan the checked out code with trivy
        //find a way how to export it or store it somewhere -> nexus repo?
        stage('Trivy Filesystem and Checkout Repo Scan') {
            steps {
                    sh 'trivy fs --format table -o f21ao-dev-branch-trivy-report.html .'
            }
        }
        //stage 4: sonarqube scan
        stage('SAST SonarQube Source Code Scan') {
            steps {
                withSonarQubeEnv('SonarQube Server') {
                    //for simplicity keep the project key same as project name
                    sh ''' 
                    $SCANNER_HOME/bin/sonar-scanner -X \
                    -Dsonar.projectName="f21ao-ops" \
                    -Dsonar.projectKey="f21ao-ops" \
                    -Dsonar.sources=./gateway,./services/lab-treatment-service,./services/patient-registration-service,./services/ward-admissions-service
                    '''
                    //scan our source code files hence why we point to the microservices and gateway directories
                }
            }
        }
        //stage 5: Sonar quality gate - hint: comment out when you demo this, 
        //quality gate takes a pretty long time, around ~1 hour. But it passes!, code base is large
        // stage('Pass SonarQube Quality Gate') {
        //     steps {
        //         script {
        //                 waitForQualityGate abortPipeline: false, credentialsId: 'sonar-token-dev'
        //         }
        //     }
        // }
        //stage 6: OWASP dependency check
        stage('OWASP Dependency Check') {
            steps {
                script {
                    def dp_check_loc = tool 'dp-check'

                    for (dir in ["./gateway", "./services/lab-treatment-service", "./services/patient-registration-service", "./services/ward-admissions-service"]) {
                        sh "${dp_check_loc}/bin/dependency-check.sh --enableExperimental --project f21ao-dev --scan ${dir} --out . --format HTML"
                    }
                }

            }
        }

        //stage 7 build the docker images via docker compose
        //use Docker Pipeline Plugin, to point to Jenkins Global tool config `docker-latest`
        stage('Build and Tag Docker Images') {
            steps {
                script {
                    docker.withTool('docker-latest') {
                        sh 'echo "DOCKER VERSION:" && docker --version'
                        sh 'echo "DOCKER COMPOSE VERSION:" && docker compose --version'
                        sh "docker compose -f docker-compose.yml build"
                    }
                }
            }
        }
        
        //stage 7: docker image scan
        stage('Docker image scan') {
            steps {
                script {
                    def imageList = ['notvolk/zlf21ao-containers:ward-1.0.3', 'notvolk/zlf21ao-containers:reg-1.0.3', 'notvolk/zlf21ao-containers:lab-1.0.3', 'notvolk/zlf21ao-containers:gateway-1.0.3']
                    for (image in imageList) {
                        sh "trivy image --format table -o trivy-report-${image.replace('/', '-').replace(':', '-')}.html ${image}"
                    }
                }
            }
        }

        //unsafe code
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
        //                 sh 'docker compose push '
        //         }     
        //     }
        // }

        
        }
    }