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
    constraint fk_empresas_usuarios foreign key (id_usuario) references usuarios(id_usuario)
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
    constraint fk_estudios_beneficiarios foreign key (id_beneficiario) references beneficiarios(id_beneficiario),
    constraint fk_estudios_usuarios foreign key (id_trabajador) references usuarios(id_usuario)
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
    constraint fk_donaciones_usuarios foreign key (id_usuario) references usuarios(id_usuario),
    constraint fk_donaciones_empresas foreign key (id_empresa) references empresas_aliadas(id_empresa),
    constraint fk_donaciones_centros foreign key (id_centro) references centros_acopio(id_centro)
);

create table inventario_especie (
    id_articulo int auto_increment,
    id_donacion int not null,
    categoria varchar(50) not null,
    descripcion varchar(255) not null,
    cantidad_disponible int not null default 0,
    constraint pk_inventario_especie primary key (id_articulo),
    constraint fk_inventario_donaciones foreign key (id_donacion) references donaciones(id_donacion)
);

create table solicitudes_ayuda (
    id_solicitud int auto_increment,
    id_beneficiario int,
    id_empresa_receptora int,
    descripcion_necesidad text not null,
    estado_solicitud varchar(20) not null default 'Pendiente',
    fecha_solicitud date not null,
    constraint pk_solicitudes_ayuda primary key (id_solicitud),
    constraint fk_solicitudes_beneficiarios foreign key (id_beneficiario) references beneficiarios(id_beneficiario),
    constraint fk_solicitudes_empresas foreign key (id_empresa_receptora) references empresas_aliadas(id_empresa)
);

create table asignaciones_ayuda (
    id_asignacion int auto_increment,
    id_solicitud int not null,
    fecha_asignacion date not null,
    estado_entrega varchar(20) not null default 'En Bodega',
    constraint pk_asignaciones_ayuda primary key (id_asignacion),
    constraint fk_asignaciones_solicitudes foreign key (id_solicitud) references solicitudes_ayuda(id_solicitud)
);

create table detalle_asignacion_inventario (
    id_detalle int auto_increment,
    id_asignacion int not null,
    id_articulo int not null,
    cantidad_entregada int not null default 1,
    constraint pk_detalle_asignacion primary key (id_detalle),
    constraint fk_detalle_asignaciones foreign key (id_asignacion) references asignaciones_ayuda(id_asignacion),
    constraint fk_detalle_inventario foreign key (id_articulo) references inventario_especie(id_articulo)
);