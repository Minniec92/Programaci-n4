abstract class Empleado {
public nombre: string;
public salarioBase: number;

constructor(nombre: string, salarioBase: number) {
    this.nombre = nombre;
    this.salarioBase = salarioBase;
}

abstract calcularSalario(): number;
}

class EmpleadoTiempoCompleto extends Empleado {
constructor(nombre: string, salarioBase: number) {
    super(nombre, salarioBase);
}

calcularSalario(): number {
    const bonoFijo = 20000;
    return this.salarioBase + bonoFijo;
}
}

class EmpleadoMedioTiempo extends Empleado {
constructor(nombre: string, salarioBase: number) {
    super(nombre, salarioBase);
}

calcularSalario(): number {
    return this.salarioBase * 0.50;
}
}

const empleados: Empleado[] = [
new EmpleadoTiempoCompleto("Sergio Antozzi", 1150000),
new EmpleadoMedioTiempo("Gustavo Ramoscelli", 9850000),
new EmpleadoTiempoCompleto("Pablo Juarez", 3460000),
];

console.log("--- Salarios de Empleados ---");
empleados.forEach(empleado => {
console.log(`${empleado.nombre}: Salario calculado = $${empleado.calcularSalario()}`);
});
