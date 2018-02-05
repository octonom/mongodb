import { Collection } from 'mongodb'

export interface InitMongoCollectionOptions<T> {
  toDbTransform? (doc: T): any
  fromDbTransform? (dbDoc: any): T
}

export async function initMongoCollection<T> (
  collection: Collection,
  options: InitMongoCollectionOptions<T> = {}
) {
  const toDbTransform = options.toDbTransform || (doc => doc)
  const fromDbTransform = options.fromDbTransform || (dbDoc => dbDoc as T)

  async function insertOne (doc: T) {
    await collection.insertOne(toDbTransform(doc))
  }

  async function findOne (filter: object) {
    const dbDoc = await collection.findOne(filter)
    return dbDoc === null ? null : fromDbTransform(dbDoc)
  }

  return { insertOne, findOne }
}
