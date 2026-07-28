drop database if exists ayudandogtin5cm;
create database ayudandogtin5cm;
use ayudandogtin5cm;

create table usuarios (
    id_usuario int auto_increment,
    nombre_completo varchar(150) not null,
    correo_electronico varchar(100) not null unique,
    contrasena varchar(255) not null,
    telefono varchar(15),
    rol varchar(30) not null,
    constraint pk_usuarios primary key (id_usuario)
);

create table empresas_aliadas (
    id_empresa int auto_increment,
    id_usuario int not null,
    razon_social varchar(150) not null,
    tipo_relacion varchar(30) not null,
    contacto_corporativo varchar(100),
    constraint pk_empresas_aliadas primary key (id_empresa),
    constraint fk_empresas_usuarios foreign key (id_usuario) references usuarios(id_usuario) on delete cascade
);

create table beneficiarios (
    id_beneficiario int auto_increment,
    cui_dpi varchar(13) not null unique,
    nombre_completo varchar(150) not null,
    direccion_comunidad varchar(255) not null,
    departamento varchar(50) not null,
    cantidad_dependientes int default 0,
    constraint pk_beneficiarios primary key (id_beneficiario)
);

create table estudios_socioeconomicos (
    id_estudio int auto_increment,
    id_beneficiario int not null,
    id_trabajador int not null,
    ingreso_mensual_estimado decimal(10, 2) not null,
    nivel_vulnerabilidad varchar(20) not null,
    fecha_evaluacion date not null,
    constraint pk_estudios_socioeconomicos primary key (id_estudio),
    constraint fk_estudios_beneficiarios foreign key (id_beneficiario) references beneficiarios(id_beneficiario) on delete cascade,
    constraint fk_estudios_usuarios foreign key (id_trabajador) references usuarios(id_usuario) on delete cascade
);

create table centros_acopio (
    id_centro int auto_increment,
    nombre_centro varchar(100) not null,
    direccion varchar(255) not null,
    departamento varchar(50) not null,
    constraint pk_centros_acopio primary key (id_centro)
);

create table donaciones (
    id_donacion int auto_increment,
    id_usuario int,
    id_empresa int,
    id_centro int not null,
    tipo_donacion varchar(20) not null,
    fecha_donacion date not null,
    monto_monetario decimal(10, 2) default null,
    constraint pk_donaciones primary key (id_donacion),
    constraint fk_donaciones_usuarios foreign key (id_usuario) references usuarios(id_usuario) on delete set null,
    constraint fk_donaciones_empresas foreign key (id_empresa) references empresas_aliadas(id_empresa) on delete set null,
    constraint fk_donaciones_centros foreign key (id_centro) references centros_acopio(id_centro) on delete cascade
);

create table inventario_especie (
    id_articulo int auto_increment,
    id_donacion int not null,
    categoria varchar(50) not null,
    descripcion varchar(255) not null,
    cantidad_disponible int not null default 0,
    constraint pk_inventario_especie primary key (id_articulo),
    constraint fk_inventario_donaciones foreign key (id_donacion) references donaciones(id_donacion) on delete cascade
);

create table solicitudes_ayuda (
    id_solicitud int auto_increment,
    id_beneficiario int,
    id_empresa_receptora int,
    descripcion_necesidad text not null,
    estado_solicitud varchar(20) not null default 'Pendiente',
    fecha_solicitud date not null,
    constraint pk_solicitudes_ayuda primary key (id_solicitud),
    constraint fk_solicitudes_beneficiarios foreign key (id_beneficiario) references beneficiarios(id_beneficiario) on delete set null,
    constraint fk_solicitudes_empresas foreign key (id_empresa_receptora) references empresas_aliadas(id_empresa) on delete set null
);

create table asignaciones_ayuda (
    id_asignacion int auto_increment,
    id_solicitud int not null,
    fecha_asignacion date not null,
    estado_entrega varchar(20) not null default 'En Bodega',
    constraint pk_asignaciones_ayuda primary key (id_asignacion),
    constraint fk_asignaciones_solicitudes foreign key (id_solicitud) references solicitudes_ayuda(id_solicitud) on delete cascade
);

create table detalle_asignacion_inventario (
    id_detalle int auto_increment,
    id_asignacion int not null,
    id_articulo int not null,
    cantidad_entregada int not null default 1,
    constraint pk_detalle_asignacion primary key (id_detalle),
    constraint fk_detalle_asignaciones foreign key (id_asignacion) references asignaciones_ayuda(id_asignacion) on delete cascade,
    constraint fk_detalle_inventario foreign key (id_articulo) references inventario_especie(id_articulo) on delete cascade
);

-- INSERTS DE PRUEBA
INSERT INTO usuarios (nombre_completo, correo_electronico, contrasena, telefono, rol) VALUES 
('Carlos Gómez', 'carlos.gomez@gmail.com', 'pass123', '55112233', 'Donante'), 
('Ana Torres', 'ana.torres@gmail.com', 'pass456', '44223344', 'Donante'), 
('Luis Ruiz', 'l.ruiz@fundacion.org', 'admin2026', '50001122', 'Administrador'), 
('María Morales', 'maria.m@gmail.com', 'pass789', '33445566', 'Trabajador Social'), 
('Empresa Walmart GT', 'contacto@walmart.gt', 'corp123', '22001100', 'Empresa');

INSERT INTO empresas_aliadas (id_usuario, razon_social, tipo_relacion, contacto_corporativo) VALUES 
(5, 'Operadora de Tiendas S.A.', 'Patrocinador', 'Juan Perez - Gerente RSE'), 
(1, 'Gómez Consultores S.A.', 'Donante Recurrente', 'Carlos Gómez');

INSERT INTO beneficiarios (cui_dpi, nombre_completo, direccion_comunidad, departamento, cantidad_dependientes) VALUES 
('2530123450101', 'Juan Jose Lopez', 'Aldea El Carmen, Sector 3', 'Guatemala', 4), 
('1820987650301', 'Marta Alicia Chajón', 'Caserío Las Flores', 'Sacatepéquez', 2), 
('3010555550201', 'Pedro Pablo Ramírez', 'Barrio El Centro', 'El Progreso', 5);

INSERT INTO estudios_socioeconomicos (id_beneficiario, id_trabajador, ingreso_mensual_estimado, nivel_vulnerabilidad, fecha_evaluacion) VALUES 
(1, 4, 1500.00, 'Alta', '2026-07-10'), 
(2, 4, 2200.00, 'Media', '2026-07-12'), 
(3, 4, 800.00, 'Extrema', '2026-07-15');

INSERT INTO centros_acopio (nombre_centro, direccion, departamento) VALUES 
('Centro Central Zona 1', '9na Avenida 10-20, Zona 1', 'Guatemala'), 
('Sede Antigua', 'Calle del Arco #15', 'Sacatepéquez'), 
('Centro Progreseño', 'Km 54 Carretera al Atlántico', 'El Progreso');

INSERT INTO donaciones (id_usuario, id_empresa, id_centro, tipo_donacion, fecha_donacion, monto_monetario) VALUES 
(1, NULL, 1, 'Monetaria', '2026-07-20', 500.00), 
(2, NULL, 1, 'Especie', '2026-07-21', NULL), 
(NULL, 1, 2, 'Especie', '2026-07-22', NULL), 
(3, NULL, 3, 'Monetaria', '2026-07-23', 1200.00);

INSERT INTO inventario_especie (id_donacion, categoria, descripcion, cantidad_disponible) VALUES 
(2, 'Alimentos', 'Cajas de Arroz de 1lb', 50), 
(2, 'Ropa', 'Fardos de Abrigos', 15), 
(3, 'Medicamentos', 'Botiquines de Primeros Auxilios', 30);

INSERT INTO solicitudes_ayuda (id_beneficiario, id_empresa_receptora, descripcion_necesidad, estado_solicitud, fecha_solicitud) VALUES 
(1, NULL, 'Solicitud de viveres por perdida de cosecha', 'Aprobada', '2026-07-18'), 
(2, NULL, 'Ropa y abrigos para epoca de lluvia', 'Pendiente', '2026-07-21'), 
(NULL, 1, 'Insumos medicos para jornada de salud comunitaria', 'Aprobada', '2026-07-22');

INSERT INTO asignaciones_ayuda (id_solicitud, fecha_asignacion, estado_entrega) VALUES 
(1, '2026-07-23', 'En Bodega'), 
(3, '2026-07-24', 'Entregado');

INSERT INTO detalle_asignacion_inventario (id_asignacion, id_articulo, cantidad_entregada) VALUES 
(1, 1, 10), 
(1, 2, 2), 
(2, 3, 5);

select * from usuarios;