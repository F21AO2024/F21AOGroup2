pipeline {
    agent any //no agents involved

    tools { //use the plugins installed and configured in the jenkins server
        nodejs 'node-20.11.1'
        dockerTool 'docker-latest'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
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
        //stage 6: OWASP dependency check, you need to install dependencies to check them
        //disable yarn cause I didn't install it, we worked with `npm install` not `yarn`, also dont use .NET
        stage('OWASP Dependency Check') {
            steps {
                script {
                    def dp_check_loc = tool 'dp-check'

                    for (dir in ["./gateway", "./services/lab-treatment-service", "./services/patient-registration-service", "./services/ward-admissions-service"]) {
                        sh "cd ${dir} && npm install"
                        sh "${dp_check_loc}/bin/dependency-check.sh --enableExperimental --project f21ao-dev --scan ${dir} --out . --format XML --disableYarnAudit --disableAssembly"
                    }
                }
                // dependencyCheckPublisher pattern: '**/dependency-check-report.html'

            }
        }

        //stage 7 build the docker images via docker compose
        //use Docker Pipeline Plugin, to point to Jenkins Global tool config `docker-latest`
        stage('Docker compose image build') {
            steps {
                script {
                    docker.withTool('docker-latest') {
                        sh 'echo "DOCKER VERSION:" && docker --version'
                        sh 'echo "DOCKER COMPOSE VERSION:" && docker compose version'
                        sh "docker compose -f docker-compose.yml build"
                    }
                }
            }
        }
        
        //stage 8: docker image scan
        stage('Docker trivy image scan') {
            steps {
                script {
                    def imageList = ['notvolk/zlf21ao-containers:ward-1.0.3', 'notvolk/zlf21ao-containers:reg-1.0.3', 'notvolk/zlf21ao-containers:lab-1.0.3', 'notvolk/zlf21ao-containers:gateway-1.0.3']
                    for (image in imageList) {
                        sh "trivy image --format table -o trivy-report-${image.replace('/', '-').replace(':', '-')}.html ${image}"
                    }
                }
            }
        }
        //stage 9: push all images to dockerhub (publiclly), you can find and pull all images searching `notvolk/zlf21ao-containers`
        stage('Docker compose push image to DockerHub') {
            steps {
                script {
                    withDockerRegistry([credentialsId: 'docker-cred', url: '']) {
                        sh 'docker compose push '
                    }     
                }
            }
        }
        // stage('Deploy to K8s') {
        //     steps {
        //         script {
        //             withKubeConfig([caCertificate: '', clusterName: 'kubernetes', credentialsId: 'k8s-cred']) {
        //                 sh 'kubectl apply -f deployment.yaml'
        //                 sh 'kubectl get pods --all-namespaces'
        //                 sh 'kubectl get svc -n webspace'

        //             }
        //         }
        //     }
        // }


        
        





    }
    post {
    always {
        emailext subject: "Build '${currentBuild.result}'",
                 body: "Project: ${env.JOB_NAME} \n" +
                       "Build Number: ${env.BUILD_NUMBER} \n" +
                       "URI: ${env.BUILD_URL} \n",
                 to: 'ekaterina.larch@gmail.com',
                 attachLog: true,
                 attachmentsPattern: '**/f21ao-dev-branch-trivy-report.html'
    }
}
}
//eyJhbGciOiJSUzI1NiIsImtpZCI6IjdzR0pFR0ZtaW5LQjkzaVJ2aHN0c0l4a3RkNTdIbHBOMGtBLVRuRFZ0aXcifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJmMjFhby1vcHMiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlY3JldC5uYW1lIjoiZjIxYW8tc2VjcmV0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImplbmtpbnMiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJmMTkzNmMzOS01NTc0LTQ2MzAtOWVlNS01NTcxN2YyYjdhZWQiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZjIxYW8tb3BzOmplbmtpbnMifQ.f62riihfTkSFf6lzmqtstWQavsdDHWMhGy1NAPQUgLNFv0qzT22KSx82Y3XEzXUMS_fDLIE00JUCz-gwSTIRyfBa8bS7LBIvTbbO3iEkG5cgJdk18a9VpeYjUtFONAjyx2yGtzq4TvNiR7O8b0Ax9GtXJiOI7OsDoucAZ4f9qsGjsBXCfzIDysDc-eeerNkOiYWWfvm8r9Vboulm1yC_wT41RfJpFnYoqnfRA3bqdnuFtBgbs59DpmlVeqnkhbPW-pMUcqwFYQ6iYB56RFEOvI76jfDcW56s-3pG7rXkaQYHmdriT3l1TatEBDu_zY6WnRnsPlJsUJrOjisjfbFDHw