pipeline {
agent any


environment {
    REGISTRY = "my-app"
    REGISTRY_CREDENTIALS = credentials('D_AUTH')
    EC2_HOST = 'ec2-13-201-28-74.ap-south-1.compute.amazonaws.com'
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
               docker.build("${REGISTRY_CREDENTIALS_USR}/${REGISTRY}:${IMAGE_TAG}")
            }
        }
    }

    stage('Push to Registry') {
        steps {
            script {
                docker.withRegistry('https://index.docker.io/v1/', 'D_AUTH'){
                    sh "docker push ${REGISTRY_CREDENTIALS_USR}/${REGISTRY}:${IMAGE_TAG}"
                }
            }
        }
    }

    stage('Debug') {
    steps {
        sh """
        echo USER: $REGISTRY_CREDENTIALS_USR
        echo IMAGE: $REGISTRY
        echo TAG: $IMAGE_TAG
        echo HOST: $EC2_HOST
        """
        }
    }

    stage('Deploy to EC2') {
    steps {
        withCredentials([sshUserPrivateKey(
            credentialsId: 'HOST_KEY',
            keyFileVariable: 'SSH_KEY'
        )]) {
            sh """
            ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} "
            docker pull ${REGISTRY_CREDENTIALS_USR}/${REGISTRY}:${IMAGE_TAG} &&
            docker rm -f  ${CONTAINER_NAME} || true &&
            docker run -d --name ${CONTAINER_NAME} -p 3000:3000 ${REGISTRY_CREDENTIALS_USR}/${REGISTRY}:${IMAGE_TAG}
            "
            """
        }
        }
    }
}

}
