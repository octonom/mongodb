import { Collection, Cursor } from 'mongodb'

export interface InitMongoCollectionOptions<T> {
  toDbTransform? (doc: T): any
  fromDbTransform? (dbDoc: any): T
}

export interface MongoCollection<T> {
  insertOne (doc: T): Promise<void>
  findOne (filter: object): Promise<T | null>
  find (filter: object): Cursor<T>
}

export async function initMongoCollection<T extends object> (
  collection: Collection,
  options: InitMongoCollectionOptions<T> = {}
): Promise<MongoCollection<T>> {
  const toDb = options.toDbTransform || (doc => doc)
  const fromDb = options.fromDbTransform || (dbDoc => dbDoc as T)

  async function insertOne (doc: T) {
    await collection.insertOne(toDb(doc), { forceServerObjectId: true })
  }

  async function findOne (filter: object) {
    const dbDoc = await collection.findOne(filter)
    return dbDoc === null ? null : fromDb(dbDoc)
  }

  function find (filter: object) {
    return collection.find(filter).map(fromDb) as Cursor<T>
  }

  return { insertOne, findOne, find }
}
