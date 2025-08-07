pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building the Docker image...'
                    // Build a new Docker image with a tag
                    def app = docker.build("shenilaaaa/nodejs-app-devops:${env.BUILD_ID}")
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    echo 'Pushing the Docker image to Docker Hub...'
                    // Use the withCredentials block to securely access your Docker Hub credentials
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                        // Push the image with the build tag
                        def app = docker.image("shenilaaaa/nodejs-app-devops:${env.BUILD_ID}")
                        app.push()

                        // Push the same image with the 'latest' tag
                        app.push('latest')
                    }
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                echo 'Deploying to EC2 instance with Ansible...'
                // Run the Ansible playbook
                ansiblePlaybook(
                    playbook: 'ansible/deploy.yml',
                    inventory: 'ansible/inventory.ini',
                    credentialsId: 'devops-case2-key'
                )
            }
        }
    }
}
