const Sensor = require('../../entities/sensor')
const { signGetURL } = require('./storage')

module.exports.get = {
	method: 'GET',
	path: '/gcs/sensor/:sensorId',
	requiresAuth: true,
	schema: {
		params: {
			type: 'object',
			additionalProperties: false,
			required: ['sensorId'],
			properties: {
				sensorId: {
					type: 'string',
					pattern: '^[0-9a-fA-F]{24}$'
				}
			}
		}
	},
	handler: async (req, res, next) => {
		const { user: { _id: owner } } = req
		const { sensorId } = req.params

		const sensor = await Sensor.findOne({
			owner,
			_id: sensorId
		})

		if (!sensor) return next(new StatusError('Unauthorized', 403))

		const url = await signGetURL(`${owner}-${sensorId}`)

		res.status(200).send({
			message: 'GET URL signed successfully',
			url
		})
	}
}