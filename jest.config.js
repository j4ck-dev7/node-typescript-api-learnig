export default {
    rootDir: './', // Define o diretório raiz dos testes
    displayName: 'root-tests', // Define um nome para os testes
    testEnvironment: 'node', // Define o ambiente de execução dos testes
    testMatch: ["<rootDir>/test/**/*.test.ts", "<rootDir>/src/clients/__test__/*.test.ts"],
    clearMocks: true, // Limpa automicamente todos os mocks entre os testes, evitando interferência entre eles
    preset: 'ts-jest', // Permite que o jest processe e execute arquivos typescript 
    moduleNameMapper: { // Alias para os caminhos dos arquivos
        '@src/(.*)': '<rootDir>/src/$1',
        '@test/(.*)': '<rootDir>/test/$1'
    },
    moduleFileExtensions: ['ts', 'js', 'tsx', 'jsx'],
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: true
        }]
    }
}