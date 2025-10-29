import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de datos iniciales...');

  // --- PERSONAS ---
  const personaEncargado = await prisma.persona.create({
    data: {
      id: 'P001',
      primer_nombre: 'Carlos',
      segundo_nombre: 'Andrés',
      primer_apellido: 'Gómez',
      segundo_apellido: 'López',
      cod_pais: 'NI',
      role: 'ENCARGADO_COOPERATIVA',
      telefonos: {
        create: [
          { no_telefonico: '88887777', compania: 'Claro' },
          { no_telefonico: '87654321', compania: 'Tigo' },
        ],
      },
    },
  });

  const personaConductor = await prisma.persona.create({
    data: {
      id: 'P002',
      primer_nombre: 'José',
      segundo_nombre: 'Manuel',
      primer_apellido: 'Martínez',
      cod_pais: 'NI',
      role: 'CONDUCTORES',
      telefonos: {
        create: [{ no_telefonico: '87991234', compania: 'Claro' }],
      },
    },
  });

  const personaEmpleadoMTI = await prisma.persona.create({
    data: {
      id: 'P003',
      primer_nombre: 'Andrea',
      primer_apellido: 'González',
      role: 'EMPLEADO_MTI',
    },
  });

  const personaPasajero = await prisma.persona.create({
    data: {
      id: 'P004',
      primer_nombre: 'Lucía',
      segundo_nombre: 'María',
      primer_apellido: 'Pérez',
      role: 'PASAJERO',
    },
  });

  // --- USUARIOS ---
  await prisma.user.create({
    data: {
      username: 'carlos_admin',
      email: 'carlos@example.com',
      password: 'hashed_password',
      esta_activo: true,
      persona_id: personaEncargado.id,
    },
  });

  // --- ENCARGADO COOPERATIVA ---
  const encargado = await prisma.encargado_Cooperativa.create({
    data: {
      id: 'ENC001',
      persona_id: personaEncargado.id,
    },
  });

  // --- COOPERATIVA ---
  const cooperativa = await prisma.cooperativa.create({
    data: {
      nombre_cooperativa: 'Cooperativa San Francisco',
      direccion: 'Managua, Nicaragua',
      cod_pais: 'NI',
      latitud_ubicacion: 12.1151,
      logitud_ubicacion: -86.2369,
      no_telefonico: 22334455,
      url_foto_perfil: 'https://example.com/fotos/cooperativa.jpg',
      fecha_de_creacion: new Date(),
      id_encargado: encargado.id,
    },
  });

  // --- EMPLEADO MTI ---
  const empleadoMTI = await prisma.empleado_MTI.create({
    data: {
      id_empleado_mti: 'EMP001',
      nivel_acceso: 'Gestor_de_bahias',
      persona_id: personaEmpleadoMTI.id,
    },
  });

  // --- BAHÍAS ---
  const bahia1 = await prisma.bahias.create({
    data: {
      nombre_bahia: 'Bahía Central',
      ubicacion_latitud: 12.1141,
      ubicacion_longitud: -86.2355,
      url_foto: 'https://example.com/fotos/bahia1.jpg',
      fecha_creada: new Date(),
      empleado_mti_id: empleadoMTI.id_empleado_mti,
    },
  });

  const bahia2 = await prisma.bahias.create({
    data: {
      nombre_bahia: 'Bahía Norte',
      ubicacion_latitud: 12.1173,
      ubicacion_longitud: -86.2390,
      url_foto: 'https://example.com/fotos/bahia2.jpg',
      fecha_creada: new Date(),
      empleado_mti_id: empleadoMTI.id_empleado_mti,
    },
  });

  // --- PASAJERO ---
  const pasajero = await prisma.pasajero.create({
    data: {
      id_pasajero: 'PAS001',
      bahia_origen: bahia1.nombre_bahia,
      bahia_destino: bahia2.nombre_bahia,
      persona_id: personaPasajero.id,
      bahia_id: bahia1.nombre_bahia,
    },
  });

  // --- CONDUCTOR ---
  const conductor = await prisma.conductor.create({
    data: {
      id: 'COND001',
      persona_id: personaConductor.id,
    },
  });

  // --- BUS ---
  const bus = await prisma.bus.create({
    data: {
      placa: 'M123456',
      modelo: 'Toyota Hiace',
      velocidad: 0,
      capacidad_de_pasajeros: 25,
      latitud_actual: 12.114993,
      longitud_actual: -86.236174,
      fecha_hora_ultima_ubicacion: new Date(),
      estado_ubicacion: 'ACTUAL',
      estado_bus: 'ACTIVO',
      conductor_id: conductor.id,
    },
  });

  // --- RUTA ---
  const ruta = await prisma.ruta.create({
    data: {
      nombre_ruta: 'Ruta 101',
      origen_latitud: 12.1141,
      origen_longitud: -86.2355,
      destino_latitud: 12.1173,
      destino_longitud: -86.2390,
      fecha_creacion: new Date(),
    },
  });

  // --- RELACIÓN COOPERATIVA ↔ RUTA ---
  await prisma.cooperativa_Ruta.create({
    data: {
      cooperativa_id: cooperativa.nombre_cooperativa,
      ruta_id: ruta.nombre_ruta,
    },
  });

  // --- RELACIÓN RUTA ↔ BAHÍAS ---
  await prisma.rutaBahia.createMany({
    data: [
      { ruta_id: ruta.nombre_ruta, bahia_id: bahia1.nombre_bahia },
      { ruta_id: ruta.nombre_ruta, bahia_id: bahia2.nombre_bahia },
    ],
  });

  // --- ALERTAS ---
  await prisma.alertas.create({
    data: {
      id_alerta: 'ALT001',
      tipo_alerta: 'Trafico',
      ruta_id: ruta.nombre_ruta,
    },
  });

  console.log('✅ Seed ejecutado correctamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });