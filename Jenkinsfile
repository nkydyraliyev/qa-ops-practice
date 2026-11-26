// Учебный pipeline для QA Ops KP2.
// Нужно в Jenkins: плагин NodeJS + инструмент с именем 'node22'
// (Manage Jenkins → Tools → NodeJS installations).
//
// Параметры появятся после ПЕРВОГО запуска ("Build Now"):
// Jenkins читает этот файл и только тогда узнаёт про блок parameters.

pipeline {
    agent any

    tools {
        nodejs 'node22'
    }

    parameters {
        choice(name: 'TEST_ENV', choices: ['dev', 'qa', 'stage'],
               description: 'Окружение, на которое "деплоим" сборку и против которого гоняем тесты')
        choice(name: 'SUITE', choices: ['smoke', 'regression', 'e2e', 'all'],
               description: 'Набор автотестов. e2e — медленные "UI"-тесты (~2,5 с каждый)')
        choice(name: 'WORKERS', choices: ['1', '2', '4'],
               description: 'Сколько тестовых файлов запускать параллельно (как --workers в Playwright)')
        choice(name: 'FAILURE_MODE', choices: ['none', 'failing-tests', 'broken-step', 'timeout'],
               description: 'Учебная поломка. none — всё должно быть зелёным')
    }

    options {
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '30'))
        timeout(time: 15, unit: 'MINUTES')
    }

    environment {
        APP_ENV    = "${params.TEST_ENV ?: 'dev'}"
        SUITE      = "${params.SUITE ?: 'smoke'}"
        WORKERS    = "${params.WORKERS ?: '1'}"
        INJECT_BUG = "${params.FAILURE_MODE == 'failing-tests' ? '1' : '0'}"
    }

    stages {
        stage('Info') {
            steps {
                echo "Build #${env.BUILD_NUMBER} | node: ${env.NODE_NAME} | workspace: ${env.WORKSPACE}"
                echo "TEST_ENV=${env.APP_ENV}, SUITE=${env.SUITE}, WORKERS=${env.WORKERS}, FAILURE_MODE=${params.FAILURE_MODE}"
                sh 'rm -rf reports deploy-info.json'   // убрать отчёты прошлых сборок
                sh 'node -v && npm -v'
                sh 'git log -1 --oneline'
            }
        }

        stage('Deploy to test env (simulation)') {
            steps {
                sh 'node scripts/deploy.js'
            }
        }

        stage('Broken step') {
            when { expression { params.FAILURE_MODE == 'broken-step' } }
            steps {
                sh 'npm run lint'   // такого скрипта нет в package.json → шаг упадёт
            }
        }

        stage('Slow step') {
            when { expression { params.FAILURE_MODE == 'timeout' } }
            steps {
                timeout(time: 20, unit: 'SECONDS') {
                    sh 'echo "Waiting for environment to become ready..." && sleep 120'
                }
            }
        }

        stage('Autotests') {
            steps {
                script {
                    // Код 1 = есть упавшие тесты → статус UNSTABLE выставит junit.
                    // Любой другой ненулевой код = тесты вообще не запустились → FAILURE.
                    def code = sh(script: 'node scripts/run-tests.js', returnStatus: true)
                    if (code == 1) {
                        echo 'Есть упавшие тесты — смотри Test Result'
                    } else if (code != 0) {
                        error "Тестовый раннер упал с кодом ${code}: тесты не запускались"
                    }
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'reports/junit.xml'
            archiveArtifacts artifacts: 'reports/**, deploy-info.json', allowEmptyArchive: true
        }
        success  { echo 'RESULT: SUCCESS — всё зелёное' }
        unstable { echo 'RESULT: UNSTABLE — сборка прошла, но есть упавшие тесты' }
        failure  { echo 'RESULT: FAILURE — упал шаг пайплайна (не тесты)' }
        aborted  { echo 'RESULT: ABORTED — сборку остановили вручную или по таймауту' }
    }
}
