import assert from 'node:assert'
import { resolve } from 'node:path'
import { env } from 'node:process'
import fetch from 'node-fetch'
import {
  compressArtifact,
  joinUrl,
  setup,
  teardown,
} from '../../_testHelpers/index.js'

// "Could not find 'Docker', skipping 'Docker' tests."
const _describe = env.DOCKER_DETECTED ? describe : describe.skip

_describe('Artifact with docker tests', function desc() {
  this.timeout(120000)

  beforeEach(async () => {
    await compressArtifact(__dirname, './artifacts/hello.zip', ['./handler.js'])
    return setup({
      servicePath: resolve(__dirname),
    })
  })

  afterEach(() => teardown())

  //
  ;[
    {
      description: 'should work with artifact in docker container',
      expected: {
        message: 'Hello Node.js!',
      },
      path: '/dev/hello',
    },
  ].forEach(({ description, expected, path }) => {
    it(description, async () => {
      const url = joinUrl(env.TEST_BASE_URL, path)
      const response = await fetch(url)
      const json = await response.json()

      assert.deepEqual(json, expected)
    })
  })
})
