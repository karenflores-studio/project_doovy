import dns from "dns"
// conexion unica a mongodb atlas
import { MongoClient, ObjectId } from "mongodb"

// en algunas maquinas node no lee bien los dns del sistema y usa 127.0.0.1
// mongodb+srv necesita resolver registros SRV, y sin un dns valido no conecta
// si defino DNS_SERVERS en el .env le indico cuales usar
if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(","))
}

// leo la configuracion del archivo .env
const uri = process.env.MONGO_URI
const nombreBase = process.env.DB_NAME

// el cliente es el que maneja la comunicacion con el cluster de atlas
const cliente = new MongoClient(uri)

// esta es la base ya seleccionada, la que van a usar todos los servicios
export const db = cliente.db(nombreBase)

// abro la conexion una sola vez cuando arranca el servidor
// asi me entero enseguida si las credenciales estan mal, y no recien en el primer pedido
export async function conectarBase() {
    await cliente.connect()
    console.log(`conectado a mongodb - base: ${nombreBase}`)
}

// cierro la conexion, lo uso en los scripts que terminan (como el de datos de prueba)
// el servidor web no la usa porque queda corriendo siempre
export async function cerrarBase() {
    await cliente.close()
}

// mongo explota si le paso un id con formato invalido, asi que lo chequeo antes
// un ObjectId valido son 24 caracteres hexadecimales, cualquier otra cosa no sirve
export function esIdValido(id) {
    return ObjectId.isValid(id)
}