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
                // dependencyCheckPublisher pattern: '**/dependency-check-report.html' //-> this causes an unstable build for some reason

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
        stage('Deploy to k8s') {
            steps {
                withKubeConfig(caCertificate: '', clusterName: 'kubernetes', contextName: '', credentialsId: 'k8s-service-token', namespace: 'f21ao-ops', restrictKubeConfigAccess: false, serverUrl: 'https://172.31.5.101:6443') {
                    sh 'kubectl apply -f deploy2k8s.yaml'
                }
            }
        }
        stage('Check K8s') {
            steps {
                withKubeConfig(caCertificate: '', clusterName: 'kubernetes', contextName: '', credentialsId: 'k8s-service-token', namespace: 'f21ao-ops', restrictKubeConfigAccess: false, serverUrl: 'https://172.31.5.101:6443') {
                    sh 'kubectl get pods -n f21ao-ops -o wide'
                    // sh 'kubectl get svc -n f21ao-ops'
                }
            }
        }


        
        





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
/*
//check existing namespaces
kubectl get namespaces

//creation of namespace, service acc, token credential, and role binding for jenkins to talk to k8s
kubectl create ns f21ao-ops
kubectl apply -f service-acc.yaml
kubectl apply -f role.yaml
kubectl apply -f bind_roles.yaml
kubectl apply -f token-service.yaml -n f21ao-ops
kubectl describe secret f21ao-secret -n f21ao-ops

//to stop or scale down
kubectl scale deployment --all --replicas=0 -n f21ao-ops
kubectl delete pods --all -n f21ao-ops

eyJhbGciOiJSUzI1NiIsImtpZCI6IjdzR0pFR0ZtaW5LQjkzaVJ2aHN0c0l4a3RkNTdIbHBOMGtBLVRuRFZ0aXcifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJmMjFhby1vcHMiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlY3JldC5uYW1lIjoiZjIxYW8tc2VjcmV0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImplbmtpbnMiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJjMTE1ODRhOC1mNmJhLTRiNDMtODUxOC1iMDRlNDNmMDMwNGEiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZjIxYW8tb3BzOmplbmtpbnMifQ.oCs-h12_t5qEwEqn6yG-blQJXYovjbHuvIMyQR1f1psdZB3i6q5Y7e1QIy6pyILUfNOT_Za3g2xuivZebNuIsDjsqI7vosdIARG1Lb9F28i08gz8kdPGClOYHlV4yA9fNEGVX_TwFPrYaTs-8obnmfATQuBsMs9XncK3UlEZzJBKqUnM6F94uyVMAD1BwK9aa9AlS9BYPMIsFLhUePjTU9tj5J7x7XIuWmMX6V3EcDulrOH5jezaSu_G6DMex-D2f0Mq1_f0r6bQPI7TdJxTnjg4BkNGPwejeEYFuwGMM5Cqw3cTCIcjBAhcK3uf-nEbyVoewALsxxxsMiT8bJSWrQ
*/