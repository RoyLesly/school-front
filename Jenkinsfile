pipeline{
    agent any
    tools {nodejs "Nodejs"}
    stages{
        stage("Build"){
            steps{
                nodejs("Nodejs") {
                    echo "Installation started successfully"
                    sh 'npm install'
                    sh 'npm build'
                }
            }
        }
        stage("Start"){
            steps{
                nodejs("Nodejs") {
                    sh 'pm2 start npm --name "main-school" -- start -- port 4000'
                }
                echo "App started successfully"
            }
        }
    }
}