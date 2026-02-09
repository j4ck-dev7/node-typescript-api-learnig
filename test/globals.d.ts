declare global {
  var testRequest: import("supertest").SuperTest<import("supertest").Test>; // Se importar o supertest no topo, o typescript irá tratar este arquivo como módulo, e não um arquivo de declaração global
}

export {};
