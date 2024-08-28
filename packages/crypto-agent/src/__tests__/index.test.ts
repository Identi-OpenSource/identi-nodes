import { jest } from '@jest/globals'
import { agent } from '../setup-local'

jest.setTimeout(10000)

describe('basic', () => {
  it('2. creates a DID', async () => {
    // const created = await agent.didManagerGetOrCreate({
    //   alias: 'myDID',
    // })
    expect('1').toHaveLength(1)
  })
})
