abstract class FigurasGeo {
public nombre: string;

constructor(nombre: string) {
    this.nombre = nombre;
}

abstract calcularArea(): number;
}

class Cuadrado extends FigurasGeo {
constructor(nombre: string, private lado: number) {
    super(nombre);
}

calcularArea(): number {
    return this.lado * this.lado;
}
}

class Triangulo extends FigurasGeo {
constructor(nombre: string, private base: number, private altura: number) {
    super(nombre);
}

calcularArea(): number {
    return (this.base * this.altura) / 2;
}
}

class Circulo extends FigurasGeo {
constructor(nombre: string, private radio: number) {
    super(nombre);
}

calcularArea(): number {
    return Math.PI * this.radio * this.radio;
}
}

const miCuadrado = new Cuadrado("Cuadrado de 5x5", 5);
const miTriangulo = new Triangulo("Triángulo 10x4", 10, 4);
const miCirculo = new Circulo("Círculo de radio 7", 7);

console.log(`${miCuadrado.nombre}: Área = ${miCuadrado.calcularArea()}`);
console.log(`${miTriangulo.nombre}: Área = ${miTriangulo.calcularArea()}`);
console.log(`${miCirculo.nombre}: Área = ${miCirculo.calcularArea()}`);