pipeline {
agent any


environment {
    REGISTRY = "my-app"
    REGISTRY_CREDENTIALS = credentials('D_AUTH')
    EC2_HOST = 'http://ec2-13-201-28-74.ap-south-1.compute.amazonaws.com/'
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
            sshagent(credentials: [HOST_KEY]) {
                sh "ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} 'docker pull ${REGISTRY}:${IMAGE_TAG} && docker stop ${CONTAINER_NAME} || true && docker rm ${CONTAINER_NAME} || true && docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${REGISTRY}:${IMAGE_TAG}'"
            }
        }
    }
}

}
