DROP DATABASE inaldulces;
CREATE DATABASE inaldulces;

USE inaldulces;

CREATE TABLE genero (
	id_genero INT NOT NULL,
	genero VARCHAR(50),
    PRIMARY KEY(id_genero)
);

CREATE TABLE rol (
	id_rol INT NOT NULL,
	rol VARCHAR(50),
    PRIMARY KEY(id_rol)
);

CREATE TABLE usuario (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    id_genero INT NOT NULL,
    id_rol INT NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (id_genero) REFERENCES genero(id_genero),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);


CREATE TABLE Producto (
    codigo_producto INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    url_imagen VARCHAR(2083),
    cantidad_disponible INT
);

CREATE TABLE ciudad(
    id_ciudad INT,
    nombre VARCHAR(50),
    PRIMARY KEY(id_ciudad)
);

CREATE TABLE direccion (
    id_direccion INT NOT NULL,
    direccion VARCHAR(255) NOT NULL,  -- VARCHAR en lugar de TEXT
    id_ciudad INT NOT NULL,
    id_usuario INT NOT NULL,
    
    FOREIGN KEY (id_ciudad) REFERENCES ciudad(id_ciudad),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    PRIMARY KEY (id_direccion)  -- Clave primaria compuesta
);

CREATE TABLE Pedido (
    id_pedido INT AUTO_INCREMENT NOT NULL, 
    fecha DATE NOT NULL,
    total DECIMAL(10, 2),
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
	PRIMARY KEY (id_pedido)
);

CREATE TABLE Producto_Pedido (
    codigo_producto INT NOT NULL,
    id_pedido INT NOT NULL,
    cantidad INT NOT NULL,
    PRIMARY KEY (codigo_producto, id_pedido),
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido),
    FOREIGN KEY (codigo_producto) REFERENCES Producto(codigo_producto)
);

CREATE TABLE carrito (
    id_usuario INT NOT NULL,
    codigo_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_total_por_producto INT NOT NULL,

    PRIMARY KEY (id_usuario, codigo_producto),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (codigo_producto) REFERENCES producto(codigo_producto)
);


INSERT INTO genero (id_genero, genero) VALUES
(1,'Masculino'),
(2,'Femenino')
;

INSERT INTO rol (id_rol, rol) VALUES
(1,'Administrador'),
(2,'Cliente');



INSERT INTO usuario (nombre, apellido, id_genero, correo, contraseña, id_rol) VALUES
('Juan', 'Pérez', 1, 'juan.perez@adminExample.com', 'contraseña1',1),
('Maria', 'Gómez', 2, 'maria.gomez@adminExample.com', 'contraseña2',1),
('Carlos', 'López', 1, 'carlos.lopez@dminExample.com', 'contraseña3',1),
('Ana', 'Martínez', 2, 'ana.martinez@dminExample.com', 'contraseña4',1),
('Luis', 'Fernández', 1, 'luis.fernandez@example.com', 'contraseña5',2),
('Sofía', 'Hernández', 2, 'sofia.hernandez@example.com', 'contraseña6',2);


INSERT INTO ciudad (id_ciudad,nombre) VALUES
(1,"Bogota"),
(2,"Soacha");

INSERT INTO direccion (id_direccion, direccion,id_ciudad,id_usuario) VALUES
(1,'Calle Falsa 123',1,1),
(2,'Calle Falsa 456',1,2),
(3,'Calle Falsa 789',1,3),
(4,'Calle septima A #23-43',1,4),
(5,'Calle novena # 12-15',2,5),
(6,'Calle 4 norte #21-10',1,6);


INSERT INTO producto (nombre, descripcion, precio,url_imagen,cantidad_disponible) VALUES
('Masmellow A', 'Masmellow A sabor a AA', 3200,'',20),
('Masmellow B', 'Masmellow A sabor a BB', 6400,'',50),
('Masmellow C', 'Masmellow A sabor a CC', 7600,'',30),
('Masmellow D', 'Masmellow A sabor a DD', 8500,'',10);


INSERT INTO Pedido (id_usuario, fecha, total) VALUES
(5,'2024-10-01', 16000),   -- Pedido del usuario 1
(6,'2024-10-02', 34000),   -- Pedido del usuario 2
(5,'2024-10-03', 12800),   -- Pedido del usuario 1
(6,'2024-10-04', 76000);   -- Pedido del usuario 2


INSERT INTO Producto_Pedido (codigo_producto, id_pedido, cantidad) VALUES
(1, 1, 5),   -- Producto A en Pedido 1
(4, 1, 3),   -- Producto B en Pedido 1
(2, 1, 2),   -- Producto B en Pedido 1
(3, 2, 3),   -- Producto C en Pedido 2
(4, 2, 1);   -- Producto D en Pedido 2

