import * as pawnote from "../pawnote_r0_rewrite/src/index";

const instance = pawnote.Instance.fromURL("https://demo.index-education.net/pronote/eleve.html");
console.log(instance.base);

// const info = await instance.getInformation();
// console.log(info);

const login = new pawnote.Login(instance);
await login.initializeWithStudentCredentials("demonstration", "pronotevs");

// const student = login.finalize().toStudent();