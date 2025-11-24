interface Volador {
volar(): void;
}

abstract class Animal {
protected nombre: string;

constructor(nombre: string) {
    this.nombre = nombre;
}

hacerSonido(): void {
    console.log("El animal hace un sonido.");
}
}

class Pajaro extends Animal implements Volador {
constructor(nombre: string) {
    super(nombre);
}

volar(): void {
    console.log(`${this.nombre} está volando.`);
}

hacerSonido(): void {
    console.log(`${this.nombre} hace un sonido como un pajaro.`);
}
}

class ZorroRojo extends Animal {
private especie: string;

constructor(nombre: string, especie: string) {
    super(nombre);
    this.especie = especie;
}

hacerSonido(): void {
    console.log(`${this.nombre} ahuya como un zorro.`);
}
}

const aguila = new Pajaro("Águila");
const zorroRojo = new ZorroRojo("ZorroRojo", "del desierto");

console.log("--- Salida del Ejercicio 4 ---");
aguila.hacerSonido();
aguila.volar();
zorroRojo.hacerSonido();