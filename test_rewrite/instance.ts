import Xanovi from "../src";

const instance = Xanovi.pronote.Instance.fromURL("https://demo.index-education.net/pronote/eleve.html");
console.log(instance.base);

const info = await instance.getInformation();
console.log(info);

const login = new Xanovi.pronote.Login(instance);
login.initializeWithStudentCredentials("demonstration", "pronotevs");