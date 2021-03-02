/**
 * Módulo injection
 * @module index
 */

'use strict'

const path = require('path')
const readline = require('readline')
const {Transform} = require('stream')
const {createReadStream, createWriteStream, readFileSync, statSync} = require('fs')

function _trim() {
	return new Transform({
		writableObjectMode: true,
		transform(chunk, encoding, callback) {
			const data = chunk.toString(encoding).trim()
			callback(null, data)
		}
	})
}

function _verify(file) {
	try	{
		const stats = statSync(file)
		return stats.isFile()
	} catch {
		return false
	}
}

function _perline(line, stream, regex) {
	let _matches = null
	let _write = true
	while ((_matches = regex.exec(line)) !== null) {
		try {
			const parasite = readFileSync(path.resolve(process.cwd(), _matches[1]), 'utf-8')
			stream.write(parasite)
			_write = false
		} catch {
			stream.write('')
			continue
		}
	}

	if (_write) {
		stream.write(line)
	}
}

function injection(...args) {
	return new Promise((resolve, reject) => {
		const [_in, _out = path.resolve(process.cwd(), './out'), _pattern = '<!--\\sinject:\\s([\\w./]+)\\s-->'] = args
		if (_verify(_in) === false) {
			reject(new Error(`File not found: ${_in}`))
			return
		}

		const regex = new RegExp(_pattern, 'g')
		const trim = _trim()
		const output = createWriteStream(_out)
		const input = createReadStream(_in)
		readline
			.createInterface({
				input,
				crlfDelay: Number.POSITIVE_INFINITY,
				terminal: false
			})
			.on('line', line => {
				_perline(line, trim, regex)
			})
			.on('close', () => {
				trim.end()
			})

		trim
			.pipe(output)
			.on('finish', () => {
				resolve()
			})
	})
}

module.exports = injection
