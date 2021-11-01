// IMPORTS
import { Controller } from 'models/global'
import DataService from 'services/data'

// CONTROLADOR
const dataController: Controller = (app) => {
	// SERVICIOS
	const service = new DataService(false, true)

	// ENDPOINTS
	app.post('/upload', service.upload)
}

export default dataController