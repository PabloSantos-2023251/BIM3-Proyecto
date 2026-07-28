Documentación de la API - Ayudando GT

API desarrollada para la gestión de beneficiarios, donaciones, inventario, solicitudes y asignaciones de ayuda de la organización.
🛠 Configuración General

    URL Base: http://localhost:3000

    Headers requeridos para solicitudes con Body (POST / PUT):

        Content-Type: application/json

Códigos de Estado HTTP Comunes

    200 OK: Solicitud exitosa (para GET, PUT, DELETE).

    201 Created: Recurso creado exitosamente (para POST).

    400 Bad Request: Error en los datos enviados o faltan campos obligatorios.

    404 Not Found: Recurso no encontrado.

    500 Internal Server Error: Error en el servidor o violación de restricciones en la base de datos (por ejemplo, llaves foráneas inválidas).

Endpoints de la API
1. Usuarios

Gestiona los usuarios del sistema (donantes, administradores, trabajadores sociales).

    Descripción: Permite listar, crear, actualizar y eliminar usuarios.

    Métodos y URLs:

        GET /usuarios — Obtiene todos los usuarios.

        GET /usuarios?id=1 — Obtiene un usuario por ID.

        POST /usuarios — Crea un nuevo usuario.

        PUT /usuarios?id=1 — Actualiza un usuario existente.

        DELETE /usuarios?id=1 — Elimina un usuario.

    Parámetros:

        Query Param: id (entero) para búsquedas específicas, actualizaciones y eliminaciones.

    Ejemplo de Request (POST / PUT):

JSON

{
  "nombre_completo": "Carlos Gómez",
  "correo_electronico": "carlos.gomez@gmail.com",
  "contrasena": "pass123",
  "telefono": "55112233",
  "rol": "Donante"
}

    Ejemplo de Response (201 Created / 200 OK):

JSON

{
  "id_usuario": 1,
  "nombre_completo": "Carlos Gómez",
  "correo_electronico": "carlos.gomez@gmail.com",
  "telefono": "55112233",
  "rol": "Donante"
}

2. Empresas Aliadas

Gestiona las empresas patrocinadoras o donantes vinculadas a un usuario.

    Descripción: Controla el registro de empresas aliadas.

    Métodos y URLs:

        GET /empresas

        GET /empresas?id=1

        POST /empresas

        PUT /empresas?id=1

        DELETE /empresas?id=1

    Ejemplo de Request (POST / PUT):

JSON

{
  "id_usuario": 5,
  "razon_social": "Operadora de Tiendas S.A.",
  "tipo_relacion": "Patrocinador",
  "contacto_corporativo": "Juan Perez - Gerente RSE"
}

    Ejemplo de Response (200 OK):

JSON

{
  "id_empresa": 1,
  "id_usuario": 5,
  "razon_social": "Operadora de Tiendas S.A.",
  "tipo_relacion": "Patrocinador",
  "contacto_corporativo": "Juan Perez - Gerente RSE"
}

3. Beneficiarios

Administra la información de las personas que solicitan ayuda.

    Descripción: Registro de beneficiarios basado en su CUI/DPI y ubicación.

    Métodos y URLs:

        GET /beneficiarios

        GET /beneficiarios?id=1

        POST /beneficiarios

        PUT /beneficiarios?id=1

        DELETE /beneficiarios?id=1

    Ejemplo de Request (POST / PUT):

JSON

{
  "cui_dpi": "2530123450101",
  "nombre_completo": "Juan Jose Lopez",
  "direccion_comunidad": "Aldea El Carmen, Sector 3",
  "departamento": "Guatemala",
  "cantidad_dependientes": 4
}

    Ejemplo de Response (200 OK):

JSON

{
  "id_beneficiario": 1,
  "cui_dpi": "2530123450101",
  "nombre_completo": "Juan Jose Lopez",
  "direccion_comunidad": "Aldea El Carmen, Sector 3",
  "departamento": "Guatemala",
  "cantidad_dependientes": 4
}

4. Estudios Socioeconómicos

Evalúa la situación de vulnerabilidad de un beneficiario a través de un trabajador social.

    Descripción: Registro de evaluaciones socioeconómicas.

    Métodos y URLs:

        GET /estudios-socioeconomicos

        GET /estudios-socioeconomicos?id=1

        POST /estudios-socioeconomicos

        PUT /estudios-socioeconomicos?id=1

        DELETE /estudios-socioeconomicos?id=1

    Ejemplo de Request (POST / PUT):

JSON

{
  "id_beneficiario": 1,
  "id_trabajador": 4,
  "ingreso_mensual_estimado": 1500.00,
  "nivel_vulnerabilidad": "Alta",
  "fecha_evaluacion": "2026-07-25"
}

    Ejemplo de Response (200 OK):

JSON

{
  "id_estudio": 1,
  "id_beneficiario": 1,
  "id_trabajador": 4,
  "ingreso_mensual_estimado": 1500.00,
  "nivel_vulnerabilidad": "Alta",
  "fecha_evaluacion": "2026-07-25"
}

5. Centros de Acopio

Administra las sedes físicas donde se reciben y almacenan las donaciones.

    Descripción: Gestión de ubicaciones de centros de acopio.

    Métodos y URLs:

        GET /centros-acopio

        GET /centros-acopio?id=1

        POST /centros-acopio

        PUT /centros-acopio?id=1

        DELETE /centros-acopio?id=1

    Ejemplo de Request (POST / PUT):

JSON

{
  "nombre_centro": "Centro Central Zona 1",
  "direccion": "9na Avenida 10-20, Zona 1",
  "departamento": "Guatemala"
}

    Ejemplo de Response (200 OK):

JSON

{
  "id_centro": 1,
  "nombre_centro": "Centro Central Zona 1",
  "direccion": "9na Avenida 10-20, Zona 1",
  "departamento": "Guatemala"
}

6. Donaciones

Registra las aportaciones monetarias o en especie realizadas por usuarios o empresas.

    Descripción: Control de entradas de donaciones hacia los centros de acopio.

    Métodos y URLs:

        GET /donaciones

        GET /donaciones?id=1

        POST /donaciones

        PUT /donaciones?id=1

        DELETE /donaciones?id=1

    Ejemplo de Request (POST / PUT):

JSON

{
  "id_usuario": 1,
  "id_empresa": null,
  "id_centro": 1,
  "tipo_donacion": "Monetaria",
  "fecha_donacion": "2026-07-25",
  "monto_monetario": 500.00
}

    Ejemplo de Response (200 OK):

JSON

{
  "id_donacion": 1,
  "id_usuario": 1,
  "id_empresa": null,
  "id_centro": 1,
  "tipo_donacion": "Monetaria",
  "fecha_donacion": "2026-07-25",
  "monto_monetario": 500.00
}

7. Inventario Especie

Gestiona los artículos físicos (alimentos, ropa, medicamentos) derivados de las donaciones.

    Descripción: Control de stock de artículos disponibles en centros de acopio.

    Métodos y URLs:

        GET /inventarios-especie

        GET /inventarios-especie?id=1

        POST /inventarios-especie

        PUT /inventarios-especie?id=1

        DELETE /inventarios-especie?id=1

    Ejemplo de Request (POST / PUT):

JSON

{
  "id_donacion": 2,
  "categoria": "Alimentos",
  "descripcion": "Cajas de Arroz de 1lb",
  "cantidad_disponible": 50
}

    Ejemplo de Response (200 OK):

JSON

{
  "id_articulo": 1,
  "id_donacion": 2,
  "categoria": "Alimentos",
  "descripcion": "Cajas de Arroz de 1lb",
  "cantidad_disponible": 50
}

8. Solicitudes de Ayuda

Registra las peticiones de asistencia hechas por beneficiarios o empresas receptoras.

    Descripción: Gestión y estados de solicitudes de ayuda.

    Métodos y URLs:

        GET /solicitudes-ayuda

        GET /solicitudes-ayuda?id=1

        POST /solicitudes-ayuda

        PUT /solicitudes-ayuda?id=1

        DELETE /solicitudes-ayuda?id=1

    Ejemplo de Request (POST / PUT):

JSON

{
  "id_beneficiario": 1,
  "id_empresa_receptora": null,
  "descripcion_necesidad": "Solicitud de víveres por pérdida de cosecha",
  "estado_solicitud": "Pendiente",
  "fecha_solicitud": "2026-07-25"
}

    Ejemplo de Response (200 OK):

JSON

{
  "id_solicitud": 1,
  "id_beneficiario": 1,
  "id_empresa_receptora": null,
  "descripcion_necesidad": "Solicitud de víveres por pérdida de cosecha",
  "estado_solicitud": "Pendiente",
  "fecha_solicitud": "2026-07-25"
}

9. Asignaciones de Ayuda

Relaciona una solicitud aprobada con su proceso de entrega logística.

    Descripción: Control de asignaciones y estados de entrega.

    Métodos y URLs:

        GET /asignaciones-ayuda

        GET /asignaciones-ayuda?id=1

        POST /asignaciones-ayuda

        PUT /asignaciones-ayuda?id=1

        DELETE /asignaciones-ayuda?id=1

    Ejemplo de Request (POST / PUT):

JSON

{
  "id_solicitud": 1,
  "fecha_asignacion": "2026-07-25",
  "estado_entrega": "En Bodega"
}

    Ejemplo de Response (200 OK):

JSON

{
  "id_asignacion": 1,
  "id_solicitud": 1,
  "fecha_asignacion": "2026-07-25",
  "estado_entrega": "En Bodega"
}

10. Detalles de Asignación (Inventario)

Especifica qué artículos y cantidades del inventario se entregan en cada asignación.

    Descripción: Detalle de productos despachados por asignación.

    Métodos y URLs:

        GET /detalles-asignacion

        GET /detalles-asignacion?id=1

        POST /detalles-asignacion

        PUT /detalles-asignacion?id=1

        DELETE /detalles-asignacion?id=1

Ejemplo de Request (POST / PUT):

JSON

{
  "id_asignacion": 1,
  "id_articulo": 1,
  "cantidad_entregada": 10
}

Ejemplo de Response (200 OK):

JSON

{
  "id_detalle": 1,
  "id_asignacion": 1,
  "id_articulo": 1,
  "cantidad_entregada": 10
}