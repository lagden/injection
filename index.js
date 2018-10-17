/**
 * Módulo injection
 * @module index
 */

'use strict'

const process = require('process')
const readline = require('readline')
const {Transform} = require('stream')
const {resolve: _resolve} = require('path')
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
		return stats.isFile() ? file : false
	} catch (error) {
		return false
	}
}

function _perline(line, stream, regex) {
	let _matches = null
	let _write = true
	while ((_matches = regex.exec(line)) !== null) {
		const parasite = readFileSync(_resolve(process.cwd(), _matches[1]), 'utf-8')
		if (parasite) {
			stream.write(parasite)
			_write = false
		}
	}
	if (_write) {
		stream.write(line)
	}
}

function injection(...args) {
	return new Promise((resolve, reject) => {
		const [_in, _out = _resolve(process.cwd(), './out.txt'), _pattern = '<!--\\sinject:\\s([\\w./]+)\\s-->'] = args
		if (_verify(_in) === false) {
			reject(new Error('File not found'))
			return
		}
		const regex = new RegExp(_pattern, 'g')
		const trim = _trim()
		const output = createWriteStream(_out)
		const input = createReadStream(_in)
		readline
			.createInterface({
				input,
				crlfDelay: Infinity,
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
