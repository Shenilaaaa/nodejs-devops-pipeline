pipeline {
    agent any

    environment {
        // Define your environment variables here
        AWS_REGION = 'ap-south-1' // Use your AWS region
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning the Git repository...'
                git branch: 'develop', url: 'https://github.com/Shenilaaaa/nodejs-devops-pipeline.git'
                script {
                    // Store the Git commit hash
                    env.GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Terraform Init & Apply') {
            steps {
                echo 'Initializing and applying Terraform to provision infrastructure...'
                withCredentials([
                    // Ensure you have an 'aws-cred' credential in Jenkins with your AWS access keys
                    [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-cred', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
                ]) {
                    dir('infra') {
                        sh 'terraform init -input=false'
                        sh 'terraform validate'
                        sh 'terraform apply -auto-approve -input=false'
                    }
                }
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                echo 'Building and pushing the Docker image...'
                script {
                    sh 'docker buildx install || true'
                    withCredentials([
                        // Ensure you have a 'dockerhub-credentials' credential in Jenkins
                        usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')
                    ]) {
                        sh """
                            docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
                            docker build -t shenilaaaa/nodejs-app-devops:${env.GIT_COMMIT} .
                            docker push shenilaaaa/nodejs-app-devops:${env.GIT_COMMIT}
                            docker tag shenilaaaa/nodejs-app-devops:${env.GIT_COMMIT} shenilaaaa/nodejs-app-devops:latest
                            docker push shenilaaaa/nodejs-app-devops:latest
                        """
                    }
                }
            }
        }

        stage('Prepare Ansible') {
            steps {
                echo 'Preparing Ansible inventory file...'
                script {
                    // Get EC2 public IP from Terraform's output
                    env.EC2_IP = sh(
                        script: "cd infra && terraform output -raw public_ip",
                        returnStdout: true
                    ).trim()

                    // Create the ansible directory and hosts.ini file
                    sh 'mkdir -p ansible'
                    writeFile file: 'ansible/hosts.ini', text: """
[ec2]
${env.EC2_IP} ansible_user=ubuntu

[ec2:vars]
ansible_python_interpreter=/usr/bin/python3
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
"""
                }
            }
        }

        stage('Run Ansible Playbook') {
            steps {
                echo 'Running Ansible playbook to deploy...'
                withCredentials([
                    // Ensure you have an 'aws-ec2-ssh-key' credential in Jenkins with your private key
                    sshUserPrivateKey(credentialsId: 'aws-ec2-ssh-key', keyFileVariable: 'SSH_KEY_PATH')
                ]) {
                    script {
                        try {
                            sh """
                                chmod 600 $SSH_KEY_PATH
                                ansible-playbook -i ansible/hosts.ini ansible/deploy.yml \
                                    --private-key=$SSH_KEY_PATH \
                                    -u ubuntu \
                                    -e "GIT_COMMIT=${env.GIT_COMMIT}"
                            """
                        } catch (Exception e) {
                            error "Ansible deployment failed: ${e.getMessage()}"
                        }
                    }
                }
            }
        }
    }
}
