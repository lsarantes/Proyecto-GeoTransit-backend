import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando carga masiva de datos...");

  // --- PERSONAS ---
  const personas = await prisma.persona.createMany({
    data: [
      { id: "P001", primer_nombre: "Carlos", primer_apellido: "Gómez", cod_pais: "NI", role: "ENCARGADO_COOPERATIVA" },
      { id: "P002", primer_nombre: "José", primer_apellido: "Martínez", cod_pais: "NI", role: "CONDUCTORES" },
      { id: "P003", primer_nombre: "Andrea", primer_apellido: "González", cod_pais: "NI", role: "EMPLEADO_MTI" },
      { id: "P004", primer_nombre: "Lucía", primer_apellido: "Pérez", role: "PASAJERO" },
      { id: "P005", primer_nombre: "Miguel", primer_apellido: "Hernández", role: "CONDUCTORES" },
      { id: "P006", primer_nombre: "Rosa", primer_apellido: "Sánchez", role: "ENCARGADO_COOPERATIVA" },
      { id: "P007", primer_nombre: "Luis", primer_apellido: "Navarro", role: "EMPLEADO_MTI" },
      { id: "P008", primer_nombre: "Paola", primer_apellido: "Torres", role: "PASAJERO" },
      { id: "P009", primer_nombre: "Marcos", primer_apellido: "Rivas", role: "PASAJERO" },
    ],
  });

  // --- TELÉFONOS ---
  await prisma.telefono.createMany({
    data: [
      { no_telefonico: "88887777", compania: "Claro", persona_id: "P001" },
      { no_telefonico: "87654321", compania: "Tigo", persona_id: "P002" },
      { no_telefonico: "88334455", compania: "Claro", persona_id: "P003" },
      { no_telefonico: "82991234", compania: "Movistar", persona_id: "P004" },
      { no_telefonico: "87112233", compania: "Tigo", persona_id: "P005" },
      { no_telefonico: "85667788", compania: "Claro", persona_id: "P006" },
      { no_telefonico: "83997711", compania: "Claro", persona_id: "P007" },
      { no_telefonico: "88445566", compania: "Tigo", persona_id: "P008" },
      { no_telefonico: "88221133", compania: "Movistar", persona_id: "P009" },
    ],
  });

  // --- USUARIOS ---
  await prisma.user.createMany({
    data: [
      { username: "carlos_admin", email: "carlos@example.com", password: "hashed_pass", persona_id: "P001", esta_activo: true },
      { username: "jose_driver", email: "jose@example.com", password: "hashed_pass", persona_id: "P002", esta_activo: true },
      { username: "andrea_mti", email: "andrea@example.com", password: "hashed_pass", persona_id: "P003", esta_activo: true },
    ],
  });

  // --- ENCARGADOS DE COOPERATIVA ---
  const encargados = await prisma.encargado_Cooperativa.createMany({
    data: [
      { id: "ENC001", persona_id: "P001" },
      { id: "ENC002", persona_id: "P006" },
      { id: "ENC003", persona_id: "P007" },
    ],
  });

  // --- COOPERATIVAS ---
  await prisma.cooperativa.createMany({
    data: [
      {
        nombre_cooperativa: "Cooperativa San Francisco",
        direccion: "Managua",
        cod_pais: "NI",
        latitud_ubicacion: 12.1151,
        logitud_ubicacion: -86.2369,
        no_telefonico: 22223333,
        url_foto_perfil: "https://example.com/cooperativa1.jpg",
        fecha_de_creacion: new Date(),
        id_encargado: "ENC001",
      },
      {
        nombre_cooperativa: "Cooperativa León Express",
        direccion: "León",
        cod_pais: "NI",
        latitud_ubicacion: 12.4355,
        logitud_ubicacion: -86.8790,
        no_telefonico: 22334455,
        url_foto_perfil: "https://example.com/cooperativa2.jpg",
        fecha_de_creacion: new Date(),
        id_encargado: "ENC002",
      },
      {
        nombre_cooperativa: "Cooperativa Masaya Transit",
        direccion: "Masaya",
        cod_pais: "NI",
        latitud_ubicacion: 11.9734,
        logitud_ubicacion: -86.0943,
        no_telefonico: 22445566,
        url_foto_perfil: "https://example.com/cooperativa3.jpg",
        fecha_de_creacion: new Date(),
        id_encargado: "ENC003",
      },
    ],
  });

  // --- EMPLEADOS MTI ---
  await prisma.empleado_MTI.createMany({
    data: [
      { id_empleado_mti: "EMP001", nivel_acceso: "Gestor_de_bahias", persona_id: "P003" },
      { id_empleado_mti: "EMP002", nivel_acceso: "Gestor_de_rutas", persona_id: "P007" },
      { id_empleado_mti: "EMP003", nivel_acceso: "Administrador", persona_id: "P001" },
    ],
  });

  // --- BAHÍAS ---
  await prisma.bahias.createMany({
    data: [
      {
        nombre_bahia: "Bahía Central",
        ubicacion_latitud: 12.1141,
        ubicacion_longitud: -86.2355,
        url_foto: "https://example.com/bahia1.jpg",
        fecha_creada: new Date(),
        empleado_mti_id: "EMP001",
      },
      {
        nombre_bahia: "Bahía Norte",
        ubicacion_latitud: 12.1173,
        ubicacion_longitud: -86.2390,
        url_foto: "https://example.com/bahia2.jpg",
        fecha_creada: new Date(),
        empleado_mti_id: "EMP002",
      },
      {
        nombre_bahia: "Bahía Sur",
        ubicacion_latitud: 12.1109,
        ubicacion_longitud: -86.2321,
        url_foto: "https://example.com/bahia3.jpg",
        fecha_creada: new Date(),
        empleado_mti_id: "EMP001",
      },
    ],
  });

  // --- PASAJEROS ---
  await prisma.pasajero.createMany({
    data: [
      { id_pasajero: "PAS001", bahia_origen: "Bahía Central", bahia_destino: "Bahía Norte", persona_id: "P004", bahia_id: "Bahía Central" },
      { id_pasajero: "PAS002", bahia_origen: "Bahía Norte", bahia_destino: "Bahía Sur", persona_id: "P008", bahia_id: "Bahía Norte" },
      { id_pasajero: "PAS003", bahia_origen: "Bahía Sur", bahia_destino: "Bahía Central", persona_id: "P009", bahia_id: "Bahía Sur" },
    ],
  });

  // --- CONDUCTORES ---
  await prisma.conductor.createMany({
    data: [
      { id: "COND001", persona_id: "P002" },
      { id: "COND002", persona_id: "P005" },
      { id: "COND003", persona_id: "P001" },
    ],
  });

  // --- BUSES ---
  await prisma.bus.createMany({
    data: [
      {
        placa: "M123456",
        modelo: "Toyota Hiace",
        velocidad: 0,
        capacidad_de_pasajeros: 25,
        latitud_actual: 12.114993,
        longitud_actual: -86.236174,
        fecha_hora_ultima_ubicacion: new Date(),
        estado_ubicacion: "ACTUAL",
        estado_bus: "ACTIVO",
        conductor_id: "COND001",
      },
      {
        placa: "M654321",
        modelo: "Nissan Urvan",
        velocidad: 0,
        capacidad_de_pasajeros: 20,
        latitud_actual: 12.43512,
        longitud_actual: -86.87990,
        fecha_hora_ultima_ubicacion: new Date(),
        estado_ubicacion: "ULTIMA_CONOCIDA",
        estado_bus: "ACTIVO",
        conductor_id: "COND002",
      },
      {
        placa: "M999999",
        modelo: "Hyundai County",
        velocidad: 0,
        capacidad_de_pasajeros: 30,
        latitud_actual: 11.9734,
        longitud_actual: -86.0943,
        fecha_hora_ultima_ubicacion: new Date(),
        estado_ubicacion: "DESCONOCIDA",
        estado_bus: "EN_MANTENIMIENDO",
        conductor_id: "COND003",
      },
    ],
  });

  // --- RUTAS ---
  await prisma.ruta.createMany({
    data: [
      {
        nombre_ruta: "Ruta 101",
        origen_latitud: 12.1141,
        origen_longitud: -86.2355,
        destino_latitud: 12.1173,
        destino_longitud: -86.2390,
        fecha_creacion: new Date(),
      },
      {
        nombre_ruta: "Ruta 202",
        origen_latitud: 12.4355,
        origen_longitud: -86.8790,
        destino_latitud: 11.9734,
        destino_longitud: -86.0943,
        fecha_creacion: new Date(),
      },
      {
        nombre_ruta: "Ruta 303",
        origen_latitud: 11.9734,
        origen_longitud: -86.0943,
        destino_latitud: 12.1151,
        destino_longitud: -86.2369,
        fecha_creacion: new Date(),
      },
    ],
  });

  // --- RELACIONES COOPERATIVA ↔ RUTA ---
  await prisma.cooperativa_Ruta.createMany({
    data: [
      { cooperativa_id: "Cooperativa San Francisco", ruta_id: "Ruta 101" },
      { cooperativa_id: "Cooperativa León Express", ruta_id: "Ruta 202" },
      { cooperativa_id: "Cooperativa Masaya Transit", ruta_id: "Ruta 303" },
    ],
  });

  // --- RELACIÓN RUTA ↔ BAHÍAS ---
  await prisma.rutaBahia.createMany({
    data: [
      { ruta_id: "Ruta 101", bahia_id: "Bahía Central" },
      { ruta_id: "Ruta 101", bahia_id: "Bahía Norte" },
      { ruta_id: "Ruta 202", bahia_id: "Bahía Sur" },
      { ruta_id: "Ruta 303", bahia_id: "Bahía Central" },
      { ruta_id: "Ruta 303", bahia_id: "Bahía Sur" },
    ],
  });

  // --- ALERTAS ---
  await prisma.alertas.createMany({
    data: [
      { id_alerta: "ALT001", tipo_alerta: "Trafico", ruta_id: "Ruta 101" },
      { id_alerta: "ALT002", tipo_alerta: "Accidente", ruta_id: "Ruta 202" },
      { id_alerta: "ALT003", tipo_alerta: "Falla_mecanica", ruta_id: "Ruta 303" },
    ],
  });

  console.log("✅ Seed completado exitosamente con datos masivos.");
}

main()
  .catch((e) => {
    console.error("❌ Error durante la ejecución del seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
