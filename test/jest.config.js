export default {
    rootDir: '../', // Define o diretório raiz dos testes (raiz do projeto)
    displayName: 'end2end-tests', // Define um nome para os testes
    testEnvironment: 'node', // Define o ambiente de execução dos testes
    preset: 'ts-jest', // Permite que o jest processe e execute arquivos typescript
    moduleNameMapper: { // Alias para os caminhos dos arquivos
        '@src/(.*)': '<rootDir>/src/$1',
        '@test/(.*)': '<rootDir>/test/$1'
    },
    moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
    extensionsToTreatAsEsm: ['.ts'],
    setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"], // Arquivo de configuração que será executado antes dos testes
    testMatch: ["<rootDir>/test/**/*.test.ts"] // Diz ao jest onde encontrar os arquivos de testes
}