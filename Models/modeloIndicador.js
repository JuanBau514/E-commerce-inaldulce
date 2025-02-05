const db = require('./conection');


class Indicador{
    constructor(numeroProductos, numeroClientes, numeroAdministradores,pedidosRealizados){
        this.numeroProductos = numeroProductos;
        this.numeroClientes = numeroClientes;
        this.numeroAdministradores = numeroAdministradores;
        this.pedidosRealizados = pedidosRealizados;
    }

    static async realizarConsulta (){
       // const query = 'SELECT COUNT(*) FROM producto';
        const queries = {
            "producto": "SELECT COUNT(*) FROM producto;",
            "cliente": "SELECT COUNT(*) FROM usuario WHERE id_rol = 2;",
            "administrador": "SELECT COUNT(*) FROM usuario WHERE id_rol=1;",
            "pedido": "SELECT COUNT(*) FROM factura;"
        }
        const resultados = {}; //En este objeto, se guardaran los resultados de cada consulta.
        for (const consulta in queries) {
            console.log(`consulta: ${consulta}`)
            console.log(`Haiendo la consulta: ${queries[consulta]}`)
            
            resultados.consulta = await db.query(queries[consulta]);
            
            console.log(`Resultado de la consulta: ${resultados}`)
            
        }

        return resultados;
    }
    static async generarReporte (mes,annio){
        const queries = {
            1:"SELECT COUNT(*) FROM factura WHERE YEAR(fecha) = ? AND MONTH(fecha)=?",
            2:"SELECT FROM factura WHERE YEAR(fecha) = ? AND MONTH(fecha)=?"
        }
        
    }
}

module.exports = Indicador;
