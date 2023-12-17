import mongoose from 'mongoose'

const name = process.env.DBNAME
const uri = `${process.env.DBURI}${name}${process.env.DBOPTIONS}`

mongoose.set('strictQuery', true)

export const dbClient = mongoose.connect(uri).then((m) => {
  console.log(`🔥BBDD (${name}) conectada🔥`)
  return m.connection.getClient()
})

mongoose.connection.on('error', () => {
  console.log(`🥵Sucedió un error al conectarse a ${name}🥵`)
})

export default dbClient
