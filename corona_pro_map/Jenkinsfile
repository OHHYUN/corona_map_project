pipeline {
    agent any
    stages {
        stage('test gradle') {
            steps {
                sh './gradlew test'
                }
            }
        stage('Build gradle') {
            steps {
                sh './gradlew build'
            }
        }
        stage('Build docker image') {
            steps {
                sh 'docker build -t map .'
            }
        }
//
//         stage('docker login'){
//             steps{
//                 sh ''
//             }
//         }
        stage('login'){
            steps{
                sh 'aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 783845918471.dkr.ecr.ap-northeast-2.amazonaws.com'
            }
        }

        stage('tag'){
            steps{
                sh 'docker tag map:latest 783845918471.dkr.ecr.ap-northeast-2.amazonaws.com/map:0.1'
            }
        }

        stage('push'){
            steps{
                sh 'docker push 783845918471.dkr.ecr.ap-northeast-2.amazonaws.com/map:0.1'
            }
        }
    }
}