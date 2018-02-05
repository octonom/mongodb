import { expect } from 'chai'
import { Collection, MongoClient } from 'mongodb'

import { initMongoCollection } from './mongo-collection'

describe('MongoCollection', () => {
  let mongoClient: MongoClient
  let mongoCollection: Collection

  before(async () => {
    mongoClient = await MongoClient.connect('mongodb://localhost:27017')
    await mongoClient.db('test').dropDatabase()
  })
  beforeEach(async () => mongoCollection = await mongoClient.db('test').createCollection('test'))
  afterEach(() => mongoCollection.drop())
  after(() => mongoClient.close())

  interface Person {
    id: string
    name: string
  }

  describe('initMongoCollection()', () => {
    it('should initialize a collection', async () => {
      await initMongoCollection<Person>(mongoCollection)
    })
  })

  describe('insert()', () => {
    let people
    beforeEach(async () => people = await initMongoCollection<Person>(mongoCollection))

    it('should insert a document', async () => {
      const person: Person = { id: '1337', name: 'Darth Vader' }
      await people.insertOne(person)
      const dbDoc = await mongoCollection.findOne({ id: '1337' })
      expect(dbDoc).to.eql(person)
    })
  })
})
