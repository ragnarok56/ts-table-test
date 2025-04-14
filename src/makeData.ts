import { faker } from '@faker-js/faker'

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  subRows?: Person[]
}

const range = (len: number) => {
  const arr: number[] = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int(40),
    visits: faker.number.int(1000),
    progress: faker.number.int(100),
    status: faker.helpers.shuffle<Person['status']>([
      'relationship',
      'complicated',
      'single',
    ])[0]!,
  }
}

export function makePersonData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Person[] => {
      const len = lens[depth]!
      return range(len).map((): Person => {
        return {
          ...newPerson(),
          subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
        }
      })
    }

    return makeDataLevel()
  }


/* step 1: search identifier for through identifier terms
  query:
    match:
      identifierType: identifier
  aggs:
    terms:
      field: throughIdentifierType

  step 2: find other identifiers from through identifier results
  for each agg result and identifier:
    query:
      must_not:
        identifierType: identifier
      must:
        throughIdentifierType: throughIdentifier
*/

export type ConnectionType = 'configured' | 'connected'

export interface StartConnection {
  identifier: string
  identifierType: string
  throughIdentifierPrimary: string
  throughIdentifierSecondary: string[]
  type: ConnectionType
  firstSeen: Date
  lastSeen: Date
}

export interface Connection extends StartConnection {
    connectedIdentifier: string
    connectedIdentifierType: string
    connectedType: ConnectionType
    connectedFirstSeen: Date
    connectedLastSeen: Date
    subRows?: Connection[]
}

const newConnectionStart = (): StartConnection => {
  const firstSeen = faker.date.past()
  return {
    identifier: faker.internet.mac(),
    identifierType: 'mac',
    firstSeen,
    lastSeen: faker.date.between({ from: firstSeen, to: new Date() }),
    type: faker.helpers.shuffle<Connection['type']>(['configured', 'connected'])[0],
    throughIdentifierPrimary: faker.internet.mac(),
    throughIdentifierSecondary: faker.helpers.multiple(() => faker.internet.displayName(), { count: { min: 0, max: 5 }}),
  }
}

const newConnection = (from: StartConnection): Connection => {
  const connectedFirstSeen = faker.date.past()
  return {
      ...from,
      connectedIdentifier: faker.internet.mac(),
      connectedIdentifierType: 'mac',
      connectedFirstSeen,
      connectedLastSeen: faker.date.between({ from: connectedFirstSeen, to: new Date() }),
      connectedType: faker.helpers.shuffle<Connection['type']>(['configured', 'connected'])[0],
      // dates: faker.helpers.multiple(() => new Date(faker.date.past()).toISOString().split('T')[0], { count: { min: 1, max: 20 }})
  }
}

export function makeConnectionData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Connection[] => {
      const len = lens[depth]!
      return range(len).flatMap((): Connection[] => {
        const startConnection = newConnectionStart()

        return faker.helpers.multiple(() => newConnection(startConnection), { count: { min: 1, max: 20 }})
        // return {
        //   ...newConnection(),
        //   // subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
        // }
      })
    }

    return makeDataLevel()
  }
