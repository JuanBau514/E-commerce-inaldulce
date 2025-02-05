const panel_cantidad_inventarios = document.querySelector('.valor__inventarios')
const panel_cantidad_clientes = document.querySelector('.valor__clientes')
const panel_cantidad_administradores = document.querySelector('.valor__administradores')
const panel_cantidad_pedidos = document.querySelector('.valor__pedidos')

const boton_generar_reporte = document.querySelector('.boton_generarReporte');
const exportar_reporte = document.querySelector('.exportarReporte');


panel_cantidad_administradores.textContent = '';
panel_cantidad_clientes.textContent = '';
panel_cantidad_inventarios.textContent = '';
panel_cantidad_pedidos.textContent = '';


boton_generar_reporte.addEventListener('click',(e)=>{
        const month = document.getElementById('monthSelector').value;
    const year = document.getElementById('yearSelector').value;
    const reportOutput = document.getElementById('reportOutput');

    if (month && year) {
        const monthNames = {
            "01": "Enero",
            "02": "Febrero",
            "03": "Marzo",
            "04": "Abril",
            "05": "Mayo",
            "06": "Junio",
            "07": "Julio",
            "08": "Agosto",
            "09": "Septiembre",
            "10": "Octubre",
            "11": "Noviembre",
            "12": "Diciembre"
        };
        reportOutput.textContent = `Generando reporte para: ${monthNames[month]} de ${year}`;
    } else {
        reportOutput.textContent = "Por favor selecciona mes y año.";
    }
    
    alert(`Año : ${year} , ${month}`)
})
