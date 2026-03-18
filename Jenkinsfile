pipeline {
agent any

```
environment {
    REGISTRY = "D_USER/my-app0"
    REGISTRY_CREDENTIALS = 'D_PASS'
    EC2_HOST = 'portfolio.outcasted.site'
    CONTAINER_NAME = 'my-app0'
    IMAGE_TAG = "${BUILD_NUMBER}"
    SSH_CREDENTIALS_ID = 'HOST_KEY'
}

stages {
    stage('Pull Code from GitHub') {
        steps {
            git branch: 'main',
                url: 'https://github.com/shivanshsharma10/my-app-CI-CD-.git'
        }
    }

    stage('Build/Test') {
        steps {
            sh 'npm install'
            sh 'npm test'
        }
    }

    stage('Build Docker Image') {
        steps {
            script {
                docker.build("${REGISTRY}:${IMAGE_TAG}")
            }
        }
    }

    stage('Push to Registry') {
        steps {
            script {
                docker.withRegistry('https://index.docker.io/v1/', REGISTRY_CREDENTIALS) {
                    sh "docker push ${REGISTRY}:${IMAGE_TAG}"
                }
            }
        }
    }

    stage('Deploy to EC2') {
        steps {
            sshagent(credentials: [SSH_CREDENTIALS_ID]) {
                sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} <<EOF

                    echo "Pulling latest image"
                    sudo docker pull ${REGISTRY}:${IMAGE_TAG}

                    echo "Stopping old container"
                    if sudo docker ps -a | grep -q "${CONTAINER_NAME}"; then
                        sudo docker stop ${CONTAINER_NAME}
                        sudo docker rm ${CONTAINER_NAME}
                    fi

                    echo "Starting new container"
                    sudo docker run -d --name ${CONTAINER_NAME} -p 8080:80 ${REGISTRY}:${IMAGE_TAG}

                    echo "Deployment complete"
                    EOF
                """
            }
        }
    }
}
```

}
