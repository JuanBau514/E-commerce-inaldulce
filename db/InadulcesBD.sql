DROP DATABASE Inadulces;
CREATE DATABASE Inadulces;

USE Inadulces;

CREATE TABLE genero (
	id_genero INT NOT NULL,
	genero VARCHAR(50),
    PRIMARY KEY(id_genero)
);

CREATE TABLE cargo (
	id_cargo INT NOT NULL,
	cargo VARCHAR(50),
    PRIMARY KEY(id_cargo)
);

CREATE TABLE persona (
    id INT AUTO_INCREMENT,
    id_genero INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_genero) REFERENCES genero(id_genero)
);

CREATE TABLE administrador (
    id INT NOT NULL,
    id_administrador INT NOT NULL,
	FOREIGN KEY (id) REFERENCES persona(id),
    
    PRIMARY KEY (id, id_administrador)
);

CREATE TABLE Producto (
    codigo_producto INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL
);

CREATE TABLE empleado (
    id INT NOT NULL,
    id_empleado INT NOT NULL,
    id_cargo INT NOT NULL,
    FOREIGN KEY (id) REFERENCES persona(id),
    FOREIGN KEY (id_cargo) REFERENCES cargo(id_cargo),
    PRIMARY KEY (id, id_empleado)
);


CREATE TABLE cliente (
    id_cliente INT NOT NULL,
    id INT NOT NULL,
    direccion VARCHAR(50),
    FOREIGN KEY (id) REFERENCES persona(id),
    PRIMARY KEY (id_cliente,id)
    
);

CREATE TABLE ciudad(
    id_ciudad INT,
    nombre VARCHAR(50),
    PRIMARY KEY(id_ciudad)
);

CREATE TABLE direccion (
    id_direccion INT NOT NULL,
    direccion VARCHAR(255) NOT NULL,  -- VARCHAR en lugar de TEXT
    id_persona INT NOT NULL,
    id_cliente INT NOT NULL,
    id_ciudad INT NOT NULL,
    
    FOREIGN KEY (id_ciudad) REFERENCES ciudad(id_ciudad),
    FOREIGN KEY (id_persona, id_cliente) REFERENCES cliente(id, id_cliente),
    PRIMARY KEY (id_direccion)  -- Clave primaria compuesta
);




CREATE TABLE Pedido (
    id_pedido INT AUTO_INCREMENT NOT NULL, 
    id_persona INT NOT NULL,
    id_cliente INT NOT NULL,
    fecha DATE NOT NULL,
    total DECIMAL(10, 2),
    FOREIGN KEY (id_persona,id_cliente) 
		REFERENCES cliente(id,id_cliente),
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
-- La redundancia se reduci, y solo salio una tabla
INSERT INTO genero (id_genero, genero) VALUES
(1,'Masculino'),
(2,'Femenino'),
(3,'Helicoptero Apache')
;

INSERT INTO cargo (id_cargo, cargo) VALUES
(1,'Vendedor'),
(2,'Cajero'),
(3,'Secretario');

-- Insertar personas
INSERT INTO persona (nombre, apellido, id_genero, correo, contraseña) VALUES
('Juan', 'Pérez', 1, 'juan.perez@adminExample.com', 'contraseña1'),
('Maria', 'Gómez', 2, 'maria.gomez@adminExample.com', 'contraseña2'),
('Carlos', 'López', 1, 'carlos.lopez@Inadulcesexample.com', 'contraseña3'),
('Ana', 'Martínez', 2, 'ana.martinez@Inadulcesexample.com', 'contraseña4'),
('Luis', 'Fernández', 1, 'luis.fernandez@example.com', 'contraseña5'),
('Sofía', 'Hernández', 2, 'sofia.hernandez@example.com', 'contraseña6');

-- Insertar administradores
INSERT INTO administrador (id, id_administrador) VALUES
(1, 1),  -- Juan Pérez como Administrador 1
(2, 2);  -- Maria Gómez como Administradora 2

-- Insertar empleados
INSERT INTO empleado (id, id_empleado, id_cargo) VALUES
(3, 1, 1),   -- Carlos López como Empleado 1
(4, 2, 2);     -- Ana Martínez como Empleado 2

-- Insertar clientes
INSERT INTO cliente (id, id_cliente,direccion) VALUES
(5, 101,'Calle Falsa 123'),   -- Luis Fernández como Cliente 1
(6, 102,'Avenida Siempre Viva'); -- Sofía Hernández como Cliente 2

INSERT INTO ciudad (id_ciudad,nombre) VALUES
(1,"Bogota"),
(2,"Soacha");

INSERT INTO direccion (id_direccion,direccion,id_persona,id_cliente,id_ciudad) VALUES
(1,"Calle 7 #34 a 22",5,101,2),
(2,"Calle 5 #12 B 27",6,102,1);

-- Insertar productos
INSERT INTO Producto (nombre, descripcion, precio) VALUES
('Masmellow A', 'Masmellow A sabor a A', 10.00),
('Masmellow B', 'Masmellow A sabor a B', 15.50),
('Masmellow C', 'Masmellow A sabor a C', 20.00),
('Masmellow D', 'Masmellow A sabor a D', 25.75);

-- Insertar pedidos
INSERT INTO Pedido (id_persona,id_cliente, fecha, total) VALUES
(5, 101, '2024-10-01', 35.50),   -- Pedido del Cliente 1
(6, 102, '2024-10-02', 45.25),   -- Pedido del Cliente 2
(5, 101, '2024-10-03', 30.00),   -- Pedido del Cliente 1
(6, 102, '2024-10-04', 55.00);   -- Pedido del Cliente 2

-- Insertar productos en pedidos
INSERT INTO Producto_Pedido (codigo_producto, id_pedido, cantidad) VALUES
(1, 1, 2),   -- Producto A en Pedido 1
(2, 1, 1),   -- Producto B en Pedido 1
(3, 2, 3),   -- Producto C en Pedido 2
(4, 2, 1);   -- Producto D en Pedido 2
