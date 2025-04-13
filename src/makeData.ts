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
      return range(len).map((d): Person => {
        return {
          ...newPerson(),
          subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
        }
      })
    }

    return makeDataLevel()
  }


export interface Connection {
    identifier: string
    identifierType: string
    throughIdentifierPrimary: string
    throughIdentifierSecondary: string[]
    connectedIdentifier: string
    connectedIdentifierType: string
    type: 'configured' | 'connected'
    dates: string[]
    subRows?: Connection[]
}

const newConnection = (): Connection => {
    return {
        identifier: faker.internet.mac(),
        identifierType: 'mac',
        throughIdentifierPrimary: faker.internet.mac(),
        throughIdentifierSecondary: faker.helpers.multiple(() => faker.internet.displayName(), { count: { min: 0, max: 5 }}),
        connectedIdentifier: faker.internet.mac(),
        connectedIdentifierType: 'mac',
        type: faker.helpers.shuffle<Connection['type']>(['configured', 'connected'])[0],
        dates: faker.helpers.multiple(() => new Date(faker.date.past()).toISOString().split('T')[0], { count: { min: 1, max: 20 }})
    }
}

export function makeConnectionData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Connection[] => {
      const len = lens[depth]!
      return range(len).map((d): Connection => {
        return {
          ...newConnection(),
          subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
        }
      })
    }

    return makeDataLevel()
  }
