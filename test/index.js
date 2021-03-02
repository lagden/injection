'use strict'

const path = require('path')
const {readFileSync} = require('fs')
const test = require('ava')
const injection = require('..')

const fixturesPath = path.join(__dirname, 'fixture')

test('inject', async t => {
	await injection(
		path.join(fixturesPath, 'host.html'),
		path.join(fixturesPath, 'out.html')
	)
	const out = readFileSync(path.join(fixturesPath, 'out.html'), 'utf8')
	t.snapshot(out)
})

test('not found', async t => {
	await t.throwsAsync(async () => {
		await injection('./file.not.found')
	}, {
		instanceOf: Error,
		message: 'File not found: ./file.not.found'
	})
})
