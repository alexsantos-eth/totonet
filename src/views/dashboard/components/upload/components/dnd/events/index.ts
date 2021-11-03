/* eslint-disable no-console */
import authFetch from 'utils/tools'

/**
 * Enviar xml
 * @description Cargar xml a base de datos
 * @param xml
 */
const onSubmit = (xml: string): void => {
	// PETICION
	authFetch(
		'http://localhost:5000/upload',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ xml }),
		},
		true
	)
		.then((res) => res?.json())
		.then((data) => {
			if (data.success) {
				window.Snack('Archivo xml subido correctamente')
			} else window.Snack('Error al intentar subir')
		})
		.catch((err) => {
			window.Snack(err)
		})
}

export default onSubmit
