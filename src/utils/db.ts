import { connect, connection } from 'mongoose'

const name = process.env.DBNAME
const uri = `${process.env.DBURI}${name}${process.env.DBOPTIONS}`

/* eslint-disable @typescript-eslint/no-floating-promises */
connect(uri)
/* eslint-enable @typescript-eslint/no-floating-promises */

connection.on('connected', (db) => {
  console.log(`🔥BBDD (${name}) conectada🔥`)
})

connection.on('error', (e: Error) => {
  console.log(`🥵Sucedió un error al conectarse a ${name}🥵: ${e.message}`)
})

export default connection
