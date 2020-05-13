def lib = library identifier: 'jenkins-esp-build-library@master', retriever: modernSCM(
    [$class: 'GitSCMSource', remote: 'https://github.com/pschild/jenkins-esp-build-library.git']
)

nodeServicePipeline(repoUrl: 'https://github.com/pschild/esp-mqtt-broker.git')
