import { Usuario } from '../models/Usuario';
import { EmpresaAliada } from '../models/EmpresaAliada';
import { Beneficiario } from '../models/Beneficiario';
import { CentroAcopio } from '../models/CentroAcopio';
import { Donacion } from '../models/Donacion';
import { SolicitudAyuda } from '../models/SolicitudAyuda';
import { InventarioEspecie } from '../models/InventarioEspecie';
import { EstudioSocioeconomico } from '../models/EstudiosSocioeconomicos';
import { AsignacionAyuda } from '../models/AsignacionAyuda'
import { DetalleAsignacionInventario } from '../models/DetalleAsignacionInventario';

// Tablas en memoria
export let usuarios: Usuario[] = [];
export let empresas: EmpresaAliada[] = [];
export let beneficiarios: Beneficiario[] = [];
export let centros: CentroAcopio[] = [];
export let donaciones: Donacion[] = [];
export let solicitudes: SolicitudAyuda[] = [];
export let inventarios: InventarioEspecie[] = [];
export let estudios: EstudioSocioeconomico[] = [];
export let asignaciones: AsignacionAyuda[] = [];
export let detallesAsignacion: DetalleAsignacionInventario[] = [];

// Contadores para emular llaves primarias auto-incrementables
export let idUsuarioCtr = 1;
export let idEmpresaCtr = 1;
export let idBeneficiarioCtr = 1;
export let idCentroCtr = 1;
export let idDonacionCtr = 1;
export let idSolicitudCtr = 1;
export let idInventarioCtr = 1;
export let idEstudioCtr = 1;
export let idAsignacionCtr = 1;
export let idDetalleCtr = 1;