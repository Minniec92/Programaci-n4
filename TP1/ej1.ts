interface Animal {
    hacerSonido(): void;
    moverse(): void;
}

class Perro implements Animal {
    constructor(private nombre: string) {}

    getNombre(): string {
        return this.nombre;
    }

    hacerSonido(): void {
        console.log("Guau!"); 
    }

    moverse(): void {
        console.log("El perro corre");
    }
}

const miPerro = new Perro("Pluto");
console.log(miPerro.getNombre());
miPerro.hacerSonido(); 
miPerro.moverse();