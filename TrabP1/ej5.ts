interface Electrico {
cargarBateria(): void;
}

abstract class Vehiculo {
protected marca: string;
protected modelo: string;

constructor(marca: string, modelo: string) {
    this.marca = marca;
    this.modelo = modelo;
}

abstract encender(): void;
}

class Auto extends Vehiculo implements Electrico {
private color: string;

constructor(marca: string, modelo: string, color: string) {
    super(marca, modelo);
    this.color = color;
}

encender(): void {
    console.log(`El ${this.marca} ${this.modelo} se ha encendido.`);
}

cargarBateria(): void {
    console.log(`El ${this.modelo} eléctrico está cargando su batería.`);
}
}

class Moto extends Vehiculo {
private tipo: string;

constructor(marca: string, modelo: string, tipo: string) {
    super(marca, modelo);
    this.tipo = tipo;
}

encender(): void {
    console.log(`La moto ${this.marca} ${this.modelo} ha arrancado.`);
}
}

const ferrari = new Auto("Ferrari", "488 GTB", "rojo");
const audi = new Auto("Audi", "A5", "blanco");
const ninjaKawasaki = new Moto("Kawasaki", "Ninja ZX-6R", "deportiva");

console.log("--- Sistema de Vehículos ---");
ferrari.encender();
audi.encender();
ninjaKawasaki.encender();

audi.cargarBateria();