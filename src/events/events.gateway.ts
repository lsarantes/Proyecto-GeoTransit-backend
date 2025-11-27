import { OnModuleInit } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    @WebSocketServer()
    server: Server;

    constructor(private prisma: PrismaService) { }

    // 1. Limpieza al iniciar el servidor (Opcional pero recomendado)
    async onModuleInit() {
        console.log("🔄 Reiniciando sockets...");
        // await this.prisma.user.updateMany({ data: { estaActivo: false } });
    }

    // 2. CONEXIÓN
    async handleConnection(client: Socket) {
        try {
            // Obtenemos el ID del query string
            const rawUserId = client.handshake.query.userId;
            const userId = Number(rawUserId);

            // Validación estricta
            if (!rawUserId || isNaN(userId)) {
                console.warn(`⚠️ Conexión rechazada: ID inválido (${rawUserId})`);
                client.disconnect();
                return;
            }

            // ⭐ TRUCO CLAVE: Guardamos el ID dentro del objeto 'client' para usarlo luego
            // Esto asegura que en el disconnect NO se pierda.
            client.data.userId = userId;
            client.join(`user_${userId}`);
            console.log(`🟢 Cliente Conectado | Socket: ${client.id} | User ID: ${userId}`);

            // Actualizamos BD
            await this.prisma.user.update({
                where: { id_usuario: userId },
                data: { esta_activo: true },
            });
            this.broadcast('empleados-mti-table-updated');
        } catch (error) {
            console.error('❌ Error en handleConnection:', error);
            client.disconnect();
        }
    }

    // 3. DESCONEXIÓN
    async handleDisconnect(client: Socket) {
        try {
            // ⭐ TRUCO CLAVE: Leemos el ID que guardamos en el paso anterior
            // Ya no miramos el handshake, miramos la memoria interna del socket
            const userId = client.data.userId;

            if (!userId) {
                // Si no hay ID es porque fue una conexión rechazada o sin autenticar
                return;
            }
            console.log(`🔴 Cliente Desconectado | Socket: ${client.id} | User ID: ${userId}`);

            // Actualizamos BD
            await this.prisma.user.update({
                where: { id_usuario: userId },
                data: { esta_activo: false },
            });

            console.log(`✅ Usuario ${userId} marcado como inactivo en BD.`);
            this.broadcast('empleados-mti-table-updated');
        } catch (error) {
            console.error('❌ Error en handleDisconnect:', error);
        }
    }

    sendUpdateToUser(userId: number, event: string, data: any) {
        // Usamos el método 'to' para enviar solo a los sockets que están en la sala 'user_ID'
        this.server.to(`user_${userId}`).emit(event, data);
        console.log(`📡 Evento '${event}' enviado al usuario: ${userId}`);
    }
    // Agrega este método dentro de tu clase EventsGateway
    broadcast(event: string, data: any = {}) {
        // Emitimos a TODOS los sockets conectados
        this.server.emit(event, data);
        console.log(`📡 Broadcast emitido: '${event}'`);
    }

}