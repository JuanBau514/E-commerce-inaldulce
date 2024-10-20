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
    id INT AUTO_INCREMENT NOT NULL,
    cedula INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    id_genero INT NOT NULL,
    id_rol INT NOT NULL,

    PRIMARY KEY (id,cedula),
    FOREIGN KEY (id_genero) REFERENCES genero(id_genero),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

CREATE TABLE empresa (
	nit INT NOT NULL,
    razon_social VARCHAR(100),
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    rubro VARCHAR(100),
    id_representante_legal INT,
    cedula_representante_legal INT,
    
    PRIMARY KEY (nit),
    FOREIGN KEY(id_representante_legal,cedula_representante_legal) REFERENCES usuario(id,cedula)
);

ALTER TABLE usuario
ADD COLUMN nit_empresa INT;

ALTER TABLE usuario
ADD CONSTRAINT fk_empresa_usuario
FOREIGN KEY (nit_empresa) REFERENCES empresa(nit);


CREATE TABLE Producto (
    codigo_producto INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    url_imagen VARCHAR(2083),
    cantidad_disponible INT
);

CREATE TABLE ciudad(
    id_ciudad INT NOT NULL,
    nombre VARCHAR(50),
    PRIMARY KEY(id_ciudad)
);

CREATE TABLE direccion (
    id_direccion INT NOT NULL,
    direccion VARCHAR(255) NOT NULL,  -- VARCHAR en lugar de TEXT
    codigo_postal VARCHAR(10),  -- VARCHAR en lugar de TEXT
    id_ciudad INT NOT NULL,
    id_usuario INT NOT NULL,
    cedula_usuario INT NOT NULL,
    
    FOREIGN KEY (id_ciudad) REFERENCES ciudad(id_ciudad),
    FOREIGN KEY (id_usuario,cedula_usuario) REFERENCES usuario(id,cedula),
    PRIMARY KEY (id_direccion)  -- Clave primaria compuesta
);

CREATE TABLE pedido (
    id_pedido INT AUTO_INCREMENT NOT NULL, 
    id_usuario INT NOT NULL,
    cedula_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario,cedula_usuario) REFERENCES usuario(id,cedula),
	PRIMARY KEY (id_pedido)
);

CREATE TABLE pedido_producto (
    id_pedido INT NOT NULL,
	codigo_producto INT NOT NULL,
    cantidad INT,
    precio_total_por_producto INT,
    PRIMARY KEY (codigo_producto, id_pedido),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (codigo_producto) REFERENCES Producto(codigo_producto)
);


CREATE TABLE factura (
    id_factura INT AUTO_INCREMENT NOT NULL, 
    fecha DATE NOT NULL,
    iva DECIMAL(5, 2),
    total DECIMAL(10, 2),
    id_pedido INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
	PRIMARY KEY (id_factura)
);



INSERT INTO genero (id_genero, genero) VALUES
(1,'Masculino'),
(2,'Femenino')
;

INSERT INTO rol (id_rol, rol) VALUES
(1,'Administrador'),
(2,'Cliente');


INSERT INTO usuario (cedula,nombre, apellido, id_genero, correo, contraseña, id_rol) VALUES
(11111,'Juan', 'Pérez', 1, 'juan.perez@adminExample.com', 'contraseña1',1),
(11112,'Maria', 'Gómez', 2, 'maria.gomez@adminExample.com', 'contraseña2',1),
(11113,'Carlos', 'López', 1, 'carlos.lopez@dminExample.com', 'contraseña3',1),
(11114,'Ana', 'Martínez', 2, 'ana.martinez@dminExample.com', 'contraseña4',1),
(11115,'Luis', 'Fernández', 1, 'luis.fernandez@example.com', 'contraseña5',2),
(11116,'Sofía', 'Hernández', 2, 'sofia.hernandez@example.com', 'contraseña6',2),
(11117,'Pancracia', 'Fernández', 1, 'pancri@example.com', 'contraseña5',2),
(11118,'Anacleta', 'Hernández', 2, 'anacleta@example.com', 'contraseña6',2)
;

INSERT INTO producto (nombre, descripcion, precio,url_imagen,cantidad_disponible) VALUES
('Masmellow A', 'Masmellow A sabor a AA', 3200,'',20),
('Masmellow B', 'Masmellow A sabor a BB', 6400,'',50),
('Masmellow C', 'Masmellow A sabor a CC', 7600,'',30),
('Masmellow D', 'Masmellow A sabor a DD', 8500,'',10);

INSERT INTO ciudad (id_ciudad,nombre) VALUES
(1,"Bogota"),
(2,"Soacha");

INSERT INTO empresa (nit, razon_social, correo, telefono, rubro, id_representante_legal, cedula_representante_legal) VALUES
(1001, 'Dulces SAS', 'contacto@dulcessas.com', '3001234567', 'Alimentos', 1, 11111),
(1002, 'Chocolates XYZ', 'info@chocolatesxyz.com', '3017654321', 'Confitería', 2, 11112);

INSERT INTO direccion (id_direccion, direccion, codigo_postal, id_ciudad, id_usuario, cedula_usuario) VALUES
(1, 'Calle 123 #45-67', '110111', 1, 1, 11111),  -- Juan Pérez (Bogotá)
(2, 'Carrera 50 #30-45', '110221', 1, 2, 11112), -- María Gómez (Bogotá)
(3, 'Calle 89 #12-34', '110311', 1, 3, 11113),  -- Carlos López (Bogotá)
(4, 'Diagonal 45A #67-89', '250051', 2, 5, 11115); -- Luis Fernández (Soacha)

INSERT INTO pedido (id_pedido, id_usuario, cedula_usuario) VALUES
(1, 5, 11115), -- Pedido de Luis Fernández
(2, 6, 11116), -- Pedido de Sofía Hernández
(3, 7, 11117), -- Pedido de Pancracia Fernández
(4, 8, 11118); -- Pedido de Anacleta Hernández

INSERT INTO pedido_producto (id_pedido, codigo_producto, cantidad, precio_total_por_producto) VALUES
(1, 1, 2, 6400),  -- Luis Fernández compró 2 unidades del producto "Masmellow A"
(1, 2, 1, 6400),  -- Luis Fernández compró 1 unidad del producto "Masmellow B"
(2, 3, 3, 22800), -- Sofía Hernández compró 3 unidades del producto "Masmellow C"
(3, 4, 1, 8500);  -- Pancracia Fernández compró 1 unidad del producto "Masmellow D"

INSERT INTO factura (id_factura, fecha, iva, total, id_pedido) VALUES
(1, '2024-10-01', 19.00, 12800.00, 1),  -- Factura para el pedido de Luis Fernández
(2, '2024-10-02', 19.00, 22800.00, 2),  -- Factura para el pedido de Sofía Hernández
(3, '2024-10-03', 19.00, 8500.00, 3);   -- Factura para el pedido de Pancracia Fernández


UPDATE usuario
SET nit_empresa = 1001 
WHERE id_rol = 2 and cedula = 11115;

UPDATE usuario
SET nit_empresa = 1001 
WHERE id_rol = 2 and cedula = 11116;

UPDATE usuario
SET nit_empresa = 1002
WHERE id_rol = 2 and cedula = 11117;

UPDATE usuario
SET nit_empresa = 1002
WHERE id_rol = 2 and cedula = 11118;


