pipeline {
    agent any

    environment {
        ACR_NAME = "myacrsonali"
        RESOURCE_GROUP = "devopsRG"
        AKS_CLUSTER = "aksclustersonali"
    }

    stages {

        stage('Clone') {
            steps {
                git 'https://github.com/SonaliMB/azureFullstackDemo.git'
            }
        }

        stage('Build Backend') {
            steps {
                sh 'docker build -t $ACR_NAME.azurecr.io/backend:latest ./backend'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker build -t $ACR_NAME.azurecr.io/frontend:latest ./frontend'
            }
        }

        stage('Azure Login') {
            steps {
                withCredentials([string(credentialsId: 'azure-sp', variable: 'AZURE_CREDENTIALS')]) {
                    sh '''
                    echo $AZURE_CREDENTIALS > azure.json
                    az login --service-principal \
                      --username $(jq -r .clientId azure.json) \
                      --password $(jq -r .clientSecret azure.json) \
                      --tenant $(jq -r .tenantId azure.json)
                    '''
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
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
                  --name $AKS_CLUSTER --overwrite-existing

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
