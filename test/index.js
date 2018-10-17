'use strict'

import {join} from 'path'
import {readFileSync} from 'fs'
import test from 'ava'
import injection from '..'

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
	const error = await t.throws(injection(
		'./file.not.found'
	))
	t.is(error.message, 'File not found: ./file.not.found')
})
