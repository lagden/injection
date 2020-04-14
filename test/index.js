'use strict'

const {join} = require('path')
const {readFileSync} = require('fs')
const test = require('ava')
const injection = require('..')

const fixturesPath = join(__dirname, 'fixtures')

test('inject', async t => {
	await injection(
		join(fixturesPath, 'host.html'),
		join(fixturesPath, '_out.html')
	)
	const _out = readFileSync(join(fixturesPath, '_out.html'), 'utf8')
	t.snapshot(_out)
})

test('not found', async t => {
	await t.throwsAsync(async () => {
		await injection('./file.not.found')
	}, {instanceOf: Error, message: 'File not found: ./file.not.found'})
})
