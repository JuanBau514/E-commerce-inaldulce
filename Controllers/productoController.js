const Producto = require('../Models/modeloProducto'); // Importa el modelo Usuario
const db = require('../Models/conection'); // Importa la conexión a la base de datos
const { json } = require('express');

const productoactual = [];
exports.getProductos = async (req,res) =>{
    try {
        const productos = await Producto.getAll();
        res.status(200).json(productos)
    } catch (error) {
        res.status(500).json({error:'Error al obtener productos'})
    }

}

exports.asignarProductoEditar = async (req,res) =>{
    productoactual.pop(); 
    productoactual.push(req.body.codigo_producto);
    if(productoactual[0]){
        res.status(200).json({ message: 'codigo establecido correctamente' })
    }else{
        res.status(500).json({ message: 'No se pudo guardar el codigo' })
    }
}

exports.getProducto = async (req,res) =>{
    try{
        const producto = await Producto.findByCode( productoactual[0] );
        res.status(200).json(producto)
    }catch(error){
        res.status(500).json({error:'Error al obtener el producto'})
    }
}

exports.updateProducto = async (req,res) =>{
    
    try{
        const {codigo,nombre,descripcion,cantidad_disponible,precio,url_imagen} = req.body
        console.log('llegaron  los datos');
        console.log(`precio del producto actual ${precio}`);
        console.log(`Codigo del producto ${productoactual[0]}`)
        await Producto.update(
            productoactual[0],
            codigo,
            nombre,
            descripcion,
            precio,
            url_imagen,
            cantidad_disponible
        );
        productoactual.pop();
        res.status(200,json('Producto actualziado correctamente'))
    }catch(error){
        res.status(500,json('No se pudo actualizar el producto',error));
    }
    
}

exports.crearProducto = async (req,res) =>{
    
    try{
        const {nombre,descripcion,cantidad_disponible,precio,url_imagen} = req.body
        await Producto.create(            
            nombre,
            descripcion,
            precio,
            url_imagen,
            cantidad_disponible
        );    
        res.status(200,json('Producto creado correctamente'))
    }catch(error){
        res.status(500,json('No se pudo crear el producto',error));
    }
    
}