pipeline {
    agent any

    environment {
        ACR_NAME = "myacrsonali"
        RESOURCE_GROUP = "devopsRG"
        AKS_CLUSTER = "aksclustersonali"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/SonaliMB/azureFullstackDemo.git'
            }
        }

        stage('Build Backend') {
            steps {
                sh '''
                docker build -t $ACR_NAME.azurecr.io/backend:latest ./backend
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                docker build -t $ACR_NAME.azurecr.io/frontend:latest ./frontend
                '''
            }
        }

        stage('Azure Login') {
            steps {
                withCredentials([
                    string(credentialsId: 'azure-client-id', variable: 'CLIENT_ID'),
                    string(credentialsId: 'azure-client-secret', variable: 'CLIENT_SECRET'),
                    string(credentialsId: 'azure-tenant-id', variable: 'TENANT_ID')
                ]) {
                    sh '''
                    echo "Logging into Azure..."

                    az login --service-principal \
                      --username $CLIENT_ID \
                      --password $CLIENT_SECRET \
                      --tenant $TENANT_ID
                    '''
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                echo "Checking images..."
                docker images

                az acr login --name $ACR_NAME

                docker push $ACR_NAME.azurecr.io/backend:latest
                docker push $ACR_NAME.azurecr.io/frontend:latest
                '''
            }
        }

        stage('Deploy to AKS') {
            steps {
                sh '''
                az aks get-credentials \
                  --resource-group $RESOURCE_GROUP \
                  --name $AKS_CLUSTER \
                  --overwrite-existing

                kubectl apply -f k8s/namespace.yaml
                kubectl apply -f k8s/secret.yaml
                kubectl apply -f k8s/mongo.yaml
                kubectl apply -f k8s/backend.yaml
                kubectl apply -f k8s/frontend.yaml
                '''
            }
        }
    }
}
