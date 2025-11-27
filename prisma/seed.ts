import { PrismaClient, Role, TD_Estado_Bus, TD_Estado_Ubicacion, TD_NivelAcceso, TD_Alerta } from "@prisma/client";
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Configuración de cantidades
const CANTIDAD_POR_ROL = 500; // 500 Conductores, 500 Pasajeros, etc.
const TOTAL_RUTAS = 500;
const TOTAL_BAHIAS = 500;

// Helper para coordenadas en Managua (aprox)
const getRandomLocation = () => {
  const baseLat = 12.1150;
  const baseLng = -86.2360;
  const variation = 0.05; 
  return {
    lat: baseLat + (Math.random() - 0.5) * variation,
    lng: baseLng + (Math.random() - 0.5) * variation,
  };
};

async function cleanDatabase() {
  console.log("🧹 Limpiando base de datos antigua...");
  // Orden crítico para evitar errores de llaves foráneas (FK)
  await prisma.alertas.deleteMany();
  await prisma.rutaBahia.deleteMany();
  await prisma.cooperativa_Ruta.deleteMany();
  await prisma.pasajero.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.conductor.deleteMany();
  await prisma.cooperativa.deleteMany();
  await prisma.encargado_Cooperativa.deleteMany();
  await prisma.empleado_MTI.deleteMany();
  await prisma.user.deleteMany();
  await prisma.telefono.deleteMany();
  await prisma.ruta.deleteMany();
  await prisma.bahias.deleteMany();
  await prisma.persona.deleteMany();
}

async function main() {
  await cleanDatabase();
  faker.seed(123); // Semilla para datos consistentes
  console.log(`🌱 Iniciando carga masiva de datos (~${CANTIDAD_POR_ROL * 4} personas)...`);

  // -----------------------------------------------------------------------
  // 1. GENERACIÓN DE DATOS EN MEMORIA (ARRAYS)
  // -----------------------------------------------------------------------
  console.log("📝 Preparando datos en memoria...");

  // Generamos IDs predecibles o UUIDs para poder relacionarlos luego
  const empleadosMtiData = Array.from({ length: CANTIDAD_POR_ROL }).map((_, i) => ({
    id: `PER_MTI_${i + 1}`,
    nombre: faker.person.firstName(),
    apellido: faker.person.lastName(),
    role: i < 50 ? Role.GESTOR_BAHIAS_MTI : Role.EMPLEADO_MTI, // Mezclar roles
    mtiId: `MTI_EMP_${i + 1}`
  }));

  const encargadosData = Array.from({ length: CANTIDAD_POR_ROL }).map((_, i) => ({
    id: `PER_ENC_${i + 1}`,
    nombre: faker.person.firstName(),
    apellido: faker.person.lastName(),
    role: Role.ENCARGADO_COOPERATIVA,
    encId: `ENC_${i + 1}`,
    coopId: `COOP_${i + 1}` // Un encargado por cooperativa
  }));

  const conductoresData = Array.from({ length: CANTIDAD_POR_ROL }).map((_, i) => ({
    id: `PER_COND_${i + 1}`,
    nombre: faker.person.firstName(),
    apellido: faker.person.lastName(),
    role: Role.CONDUCTORES,
    condId: `COND_${i + 1}`,
    placaBus: `M-${10000 + i}`
  }));

  const pasajerosData = Array.from({ length: CANTIDAD_POR_ROL }).map((_, i) => ({
    id: `PER_PAS_${i + 1}`,
    nombre: faker.person.firstName(),
    apellido: faker.person.lastName(),
    role: Role.PASAJERO,
    pasId: `PAS_${i + 1}`
  }));

  // Unir todas las personas para el insert masivo
  const todasLasPersonas = [
    ...empleadosMtiData, 
    ...encargadosData, 
    ...conductoresData, 
    ...pasajerosData
  ];

  // -----------------------------------------------------------------------
  // 2. INSERTAR PERSONAS (BASE)
  // -----------------------------------------------------------------------
  console.log(`👤 Insertando ${todasLasPersonas.length} Personas...`);
  
  // createMany es mucho más rápido que un loop de create
  await prisma.persona.createMany({
    data: todasLasPersonas.map(p => ({
      id: p.id,
      primer_nombre: p.nombre,
      primer_apellido: p.apellido,
      cod_pais: "NI",
      role: p.role,
      url_Foto: faker.image.avatar(),
      fecha_de_creacion: new Date(),
      fecha_actualizada: new Date()
    }))
  });

  // -----------------------------------------------------------------------
  // 3. INSERTAR ROLES ESPECÍFICOS
  // -----------------------------------------------------------------------
  console.log("👔 Asignando Roles en sub-tablas...");

  // 3.1 Empleados MTI
  await prisma.empleado_MTI.createMany({
    data: empleadosMtiData.map(p => ({
      id_empleado_mti: p.mtiId,
      nivel_acceso: faker.helpers.arrayElement(Object.values(TD_NivelAcceso)),
      persona_id: p.id
    }))
  });

  // 3.2 Encargados Cooperativa
  await prisma.encargado_Cooperativa.createMany({
    data: encargadosData.map(p => ({
      id: p.encId,
      persona_id: p.id
    }))
  });

  // 3.3 Conductores
  await prisma.conductor.createMany({
    data: conductoresData.map(p => ({
      id: p.condId,
      persona_id: p.id
    }))
  });

  // -----------------------------------------------------------------------
  // 4. BAHÍAS
  // -----------------------------------------------------------------------
  console.log(`🚏 Construyendo ${TOTAL_BAHIAS} Bahías...`);
  
  const bahiasIds = Array.from({ length: TOTAL_BAHIAS }).map((_, i) => `BAH_${i + 1}`);
  
  await prisma.bahias.createMany({
    data: bahiasIds.map((id, i) => {
      const loc = getRandomLocation();
      return {
        id: id,
        nombre_bahia: `Bahía ${faker.location.streetAddress()}`,
        ubicacion_latitud: loc.lat,
        ubicacion_longitud: loc.lng,
        url_foto: "https://placehold.co/600x400",
        fecha_creada: new Date(),
        // Asignamos cíclicamente a un empleado MTI
        empleado_mti_id: empleadosMtiData[i % empleadosMtiData.length].mtiId
      };
    })
  });

  // -----------------------------------------------------------------------
  // 5. COOPERATIVAS
  // -----------------------------------------------------------------------
  console.log(`buildings Creando ${encargadosData.length} Cooperativas...`);

  await prisma.cooperativa.createMany({
    data: encargadosData.map(p => {
      const loc = getRandomLocation();
      return {
        codigoCoop: p.coopId,
        nombre_cooperativa: `Cooperativa ${faker.company.name()}`,
        direccion: faker.location.secondaryAddress(),
        cod_pais: "NI",
        latitud_ubicacion: loc.lat,
        logitud_ubicacion: loc.lng,
        no_telefonico: parseInt(faker.string.numeric(8)),
        url_foto_perfil: faker.image.url(),
        fecha_de_creacion: faker.date.past(),
        id_encargado: p.encId
      };
    })
  });

  // -----------------------------------------------------------------------
  // 6. RUTAS
  // -----------------------------------------------------------------------
  console.log(`🛣️ Trazando ${TOTAL_RUTAS} Rutas...`);
  
  const rutasIds = Array.from({ length: TOTAL_RUTAS }).map((_, i) => `RUTA_${i + 1}`);

  await prisma.ruta.createMany({
    data: rutasIds.map(id => {
      const origen = getRandomLocation();
      const destino = getRandomLocation();
      return {
        id: id,
        nombre_ruta: `Ruta ${faker.number.int({ min: 100, max: 299 })} - ${faker.location.city()}`,
        origen_latitud: origen.lat,
        origen_longitud: origen.lng,
        destino_latitud: destino.lat,
        destino_longitud: destino.lng,
        fecha_creacion: faker.date.past()
      };
    })
  });

  // -----------------------------------------------------------------------
  // 7. BUSES
  // -----------------------------------------------------------------------
  console.log(`🚌 Registrando Flota de ${conductoresData.length} Buses...`);

  await prisma.bus.createMany({
    data: conductoresData.map(p => {
      const loc = getRandomLocation();
      return {
        placa: p.placaBus,
        modelo: faker.vehicle.model(),
        velocidad: faker.number.float({ min: 0, max: 80 }),
        capacidad_de_pasajeros: faker.number.int({ min: 30, max: 70 }),
        latitud_actual: loc.lat,
        longitud_actual: loc.lng,
        fecha_hora_ultima_ubicacion: new Date(),
        estado_ubicacion: faker.helpers.arrayElement(Object.values(TD_Estado_Ubicacion)),
        estado_bus: faker.helpers.arrayElement(Object.values(TD_Estado_Bus)),
        conductor_id: p.condId
      };
    })
  });

  // -----------------------------------------------------------------------
  // 8. PASAJEROS
  // -----------------------------------------------------------------------
  console.log(`🚶 Registrando ${pasajerosData.length} Pasajeros...`);

  await prisma.pasajero.createMany({
    data: pasajerosData.map(p => {
      // Elegir bahias al azar
      const origen = faker.helpers.arrayElement(bahiasIds);
      return {
        id_pasajero: p.pasId,
        persona_id: p.id,
        bahia_origen: `Calle ${faker.location.street()}`,
        bahia_destino: `Calle ${faker.location.street()}`,
        bahia_id: origen
      };
    })
  });

  // -----------------------------------------------------------------------
  // 9. USUARIOS Y TELEFONOS
  // -----------------------------------------------------------------------
  console.log("🔐 Generando Usuarios y Teléfonos...");

  // Creamos usuarios para el 80% de las personas
  const personasConUsuario = todasLasPersonas.filter(() => Math.random() > 0.2);
  
  await prisma.user.createMany({
    data: personasConUsuario.map(p => ({
      username: faker.internet.username() + faker.string.alphanumeric(3),
      email: faker.internet.email({ firstName: p.nombre, lastName: p.apellido }),
      password: "password123", // En prod esto iría hasheado
      esta_activo: true,
      persona_id: p.id
    }))
  });

  const telefonosData = todasLasPersonas
    .filter(() => Math.random() > 0.3) // 70% tienen telefono
    .map(p => ({
      no_telefonico: faker.phone.number(),
      compania: faker.helpers.arrayElement(["Claro", "Tigo"]),
      persona_id: p.id
    }));

  await prisma.telefono.createMany({ data: telefonosData });

  // -----------------------------------------------------------------------
  // 10. RELACIONES MANY-TO-MANY (MASIVO)
  // -----------------------------------------------------------------------
  console.log("🔗 Tejiendo Relaciones Masivas...");

  // Coop <-> Ruta
  // Cada cooperativa maneja unas 3 rutas aleatorias
  const coopRutaData: any[] = [];
  encargadosData.forEach(enc => {
    const rutasRandom = faker.helpers.arrayElements(rutasIds, 3);
    rutasRandom.forEach(rutaId => {
      coopRutaData.push({
        cooperativa_id: enc.coopId,
        ruta_id: rutaId
      });
    });
  });
  // Eliminar duplicados si el random seleccionó la misma ruta para la misma coop (raro con arrayElements, pero posible lógica)
  await prisma.cooperativa_Ruta.createMany({ data: coopRutaData, skipDuplicates: true });

  // Ruta <-> Bahia
  // Cada ruta pasa por 10 bahías aleatorias
  const rutaBahiaData: any[] = [];
  rutasIds.forEach(rutaId => {
    const bahiasRandom = faker.helpers.arrayElements(bahiasIds, 10);
    bahiasRandom.forEach(bahiaId => {
      rutaBahiaData.push({
        ruta_id: rutaId,
        bahia_id: bahiaId
      });
    });
  });
  await prisma.rutaBahia.createMany({ data: rutaBahiaData, skipDuplicates: true });

  // -----------------------------------------------------------------------
  // 11. ALERTAS
  // -----------------------------------------------------------------------
  console.log("⚠️ Generando Alertas...");
  
  const alertasData = Array.from({ length: 600 }).map(() => ({
    id_alerta: faker.string.uuid(),
    tipo_alerta: faker.helpers.arrayElement(Object.values(TD_Alerta)),
    ruta_id: faker.helpers.arrayElement(rutasIds)
  }));

  await prisma.alertas.createMany({ data: alertasData });

  console.log("✅ Seed masivo completado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error fatal en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });