import { rl } from "../utils/readline";
import { usuarios, beneficiarios, empresas } from "../data/db";
import { DepartamentoGT } from "../models/Departamentos";

// Importación de tus servicios directos
import { 
    listarUsuarios, buscarUsuario, crearUsuario, editarUsuario, borrarUsuario 
} from "../service/UsuarioService";
import { 
    listarBeneficiarios, buscarBeneficiario, crearBeneficiario, editarBeneficiario, borrarBeneficiario 
} from "../service/BeneficiarioService";
import { 
    listarEmpresas, buscarEmpresa, crearEmpresa, editarEmpresa, borrarEmpresa 
} from "../service/EmpresaService";

export function menu(): void {
    console.log("\n====== AYUDANDOGT - CONTROL CENTRAL ======");
    console.log("1. Listar Usuarios");
    console.log("2. Buscar Usuario por ID");
    console.log("3. Agregar Usuario");
    console.log("4. Eliminar Usuario");
    console.log("5. Editar Usuario");
    console.log("-----------------------------------------");
    console.log("6. Listar Beneficiarios");
    console.log("7. Buscar Beneficiario por ID");
    console.log("8. Agregar Beneficiario");
    console.log("9. Eliminar Beneficiario");
    console.log("10. Editar Beneficiario");
    console.log("-----------------------------------------");
    console.log("11. Listar Empresas Aliadas");
    console.log("12. Buscar Empresa por ID");
    console.log("13. Agregar Empresa Aliada");
    console.log("14. Eliminar Empresa Aliada");
    console.log("15. Editar Empresa Aliada");
    console.log("-----------------------------------------");
    console.log("16. Salir");

    rl.question("\nSeleccione una opción: ", (opcion: string) => {
        switch (opcion) {
            
            // ==========================================
            // CRUD USUARIOS
            // ==========================================
            case "1":
                console.log(JSON.stringify(listarUsuarios(), null, 2));
                menu();
                break;

            case "2":
                rl.question("Ingrese el ID del usuario: ", (id: string) => {
                    console.log(buscarUsuario(Number(id)));
                    menu();
                });
                break;

            case "3":
                rl.question("Nombre completo: ", (nombre: string) => {
                    rl.question("Correo electrónico: ", (correo: string) => {
                        rl.question("Contraseña: ", (pass: string) => {
                            rl.question("Rol (ADMIN, TRABAJADOR SOCIAL, VOLUNTARIO, DONANTE): ", (rol: string) => {
                                rl.question("Teléfono (Opcional - Enter para omitir): ", (tel: string) => {
                                    const u = crearUsuario(nombre, correo, pass, rol, tel || undefined);
                                    if (u) console.log("Usuario agregado con éxito:", u);
                                    menu();
                                });
                            });
                        });
                    });
                });
                break;

            case "4":
                rl.question("Ingrese el ID del usuario a eliminar: ", (id: string) => {
                    const borrado = borrarUsuario(Number(id));
                    if (borrado) console.log("Usuario eliminado:", borrado);
                    menu();
                });
                break;

            case "5":
                rl.question("Ingrese el ID del usuario a editar: ", (id: string) => {
                    rl.question("Nuevo nombre (Vacio para omitir): ", (nombre: string) => {
                        rl.question("Nuevo correo (Vacio para omitir): ", (correo: string) => {
                            rl.question("Nueva contraseña (Vacio para omitir): ", (pass: string) => {
                                rl.question("Nuevo rol (Vacio para omitir): ", (rol: string) => {
                                    rl.question("Nuevo teléfono (Vacio para omitir): ", (tel: string) => {
                                        const datos: any = {};
                                        if (nombre.trim() !== "") datos.nombre_completo = nombre;
                                        if (correo.trim() !== "") datos.correo_electronico = correo;
                                        if (pass.trim() !== "") datos.contrasena = pass;
                                        if (rol.trim() !== "") datos.rolInput = rol;
                                        if (tel.trim() !== "") datos.telefono = tel;

                                        const editado = editarUsuario(Number(id), datos);
                                        if (editado) console.log("Usuario actualizado con éxito:", editado);
                                        menu();
                                    });
                                });
                            });
                        });
                    });
                });
                break;

            // ==========================================
            // CRUD BENEFICIARIOS
            // ==========================================
            case "6":
                console.log(JSON.stringify(listarBeneficiarios(), null, 2));
                menu();
                break;

            case "7":
                rl.question("Ingrese el ID del beneficiario: ", (id: string) => {
                    console.log(buscarBeneficiario(Number(id)));
                    menu();
                });
                break;

            case "8":
                rl.question("CUI / DPI: ", (cui: string) => {
                    rl.question("Nombre completo: ", (nombre: string) => {
                        rl.question("Dirección de la comunidad: ", (dir: string) => {
                            rl.question("Departamento de Guatemala: ", (depto: string) => {
                                rl.question("Cantidad de dependientes económicos: ", (deps: string) => {
                                    const b = crearBeneficiario(cui, nombre, dir, depto as DepartamentoGT, Number(deps));
                                    if (b) console.log("Beneficiario registrado:", b);
                                    menu();
                                });
                            });
                        });
                    });
                });
                break;

            case "9":
                rl.question("Ingrese el ID del beneficiario a eliminar: ", (id: string) => {
                    const borrado = borrarBeneficiario(Number(id));
                    if (borrado) console.log("Beneficiario eliminado del sistema:", borrado);
                    menu();
                });
                break;

            case "10":
                rl.question("Ingrese el ID del beneficiario a editar: ", (id: string) => {
                    rl.question("Nuevo nombre (Vacio para omitir): ", (nombre: string) => {
                        rl.question("Nueva dirección (Vacio para omitir): ", (dir: string) => {
                            rl.question("Nuevo departamento (Vacio para omitir): ", (depto: string) => {
                                rl.question("Nueva cantidad dependientes (Vacio para omitir): ", (deps: string) => {
                                    const datos: any = {};
                                    if (nombre.trim() !== "") datos.nombre_completo = nombre;
                                    if (dir.trim() !== "") datos.direccion_comunidad = dir;
                                    if (depto.trim() !== "") datos.departamento = depto as DepartamentoGT;
                                    if (deps.trim() !== "") datos.cantidad_dependientes = Number(deps);

                                    const editado = editarBeneficiario(Number(id), datos);
                                    if (editado) console.log("Beneficiario modificado con éxito:", editado);
                                    menu();
                                });
                            });
                        });
                    });
                });
                break;

            // ==========================================
            // CRUD EMPRESAS
            // ==========================================
            case "11":
                console.log(JSON.stringify(listarEmpresas(), null, 2));
                menu();
                break;

            case "12":
                rl.question("Ingrese el ID de la empresa: ", (id: string) => {
                    console.log(buscarEmpresa(Number(id)));
                    menu();
                });
                break;

            case "13":
                rl.question("ID de Usuario Enlazado: ", (idUser: string) => {
                    rl.question("Razón Social de la Empresa: ", (razon: string) => {
                        rl.question("Tipo de Relación (APORTADORA, RECEPTORA, LOGISTICA): ", (relacion: string) => {
                            rl.question("Contacto Corporativo (Nombre/Puesto): ", (contacto: string) => {
                                const e = crearEmpresa(Number(idUser), razon, relacion, contacto || undefined);
                                if (e) console.log("Empresa Aliada vinculada correctamente:", e);
                                menu();
                            });
                        });
                    });
                });
                break;

            case "14":
                rl.question("Ingrese el ID de la empresa a desvincular: ", (id: string) => {
                    const borrado = borrarEmpresa(Number(id));
                    if (borrado) console.log("Empresa desvinculada del registro:", borrado);
                    menu();
                });
                break;

            case "15":
                rl.question("Ingrese el ID de la empresa a editar: ", (id: string) => {
                    rl.question("Nueva Razón Social (Vacio para omitir): ", (razon: string) => {
                        rl.question("Nuevo tipo relación (Vacio para omitir): ", (relacion: string) => {
                            rl.question("Nuevo contacto corporativo (Vacio para omitir): ", (contacto: string) => {
                                const datos: any = {};
                                if (razon.trim() !== "") datos.razon_social = razon;
                                if (relacion.trim() !== "") datos.relacionInput = relacion;
                                if (contacto.trim() !== "") datos.contacto_corporativo = contacto;

                                const editado = editarEmpresa(Number(id), datos);
                                if (editado) console.log("Datos corporativos actualizados:", editado);
                                menu();
                            });
                        });
                    });
                });
                break;

            case "16":
                console.log("Cerrando sesión en AyudandoGT...");
                rl.close();
                break;

            default:
                console.log("Opción inválida, intente de nuevo.");
                menu();
                break;
        }
    });
}