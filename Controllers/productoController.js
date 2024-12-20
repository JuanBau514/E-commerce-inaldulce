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
        const {nombre,descripcion,cantidad_disponible,precio,url_imagen,id_estado} = req.body
        await Producto.update(
            productoactual[0],
            nombre,
            descripcion,
            precio,
            url_imagen,
            cantidad_disponible,
            id_estado
        );
        productoactual.pop();
        res.status(200,json('Producto actualziado correctamente'))
    }catch(error){
        res.status(500,json('No se pudo actualizar el producto',error));
    }
    
}

exports.deleteProducto = async (req,res) => {
    const {codigo_producto} = req.body;
    try {
        await Producto.delete(codigo_producto)
        res.status(200).json('Producto eliminado')
    } catch (error) {
        res.status(500).json('No se pudo eliminar el producto',error)
    }
    
}

exports.crearProducto = async (req,res) =>{
    
    try{
        const {codigo_producto,nombre,descripcion,cantidad_disponible,precio,url_imagen,estado} = req.body    
        await Producto.create(            
            codigo_producto,
            nombre,
            descripcion,
            precio,
            url_imagen,
            cantidad_disponible,
            estado
        );    
        res.status(200,json('Producto creado correctamente'))
    }catch(error){
        res.status(500,json('No se pudo crear el producto',error));
    }
    
}