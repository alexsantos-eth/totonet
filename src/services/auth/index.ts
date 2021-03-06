// IMPORTS
import { UserData } from 'models/auth'
import { execute } from 'utils/db'
import OracleDB from 'oracledb'
import jwt from 'jsonwebtoken'
import express from 'express'
import sendError, { sendData } from 'utils/res'

class AuthService {
	constructor() {
		this.getUser = this.getUser.bind(this)
		this.signing = this.signing.bind(this)
		this.login = this.login.bind(this)
	}

	/**
	 * Obtener usuario
	 * @description Validar usuario
	 * @param req
	 * @param res
	 * @param isNew
	 * @returns
	 */
	public async getUser(
		req: express.Request,
		res: express.Response,
		isNew: boolean = false,
		customUser?: UserData,
	) {
		// DATA
		const user = (req.body.user ?? customUser) as UserData | undefined
		let hasErr: boolean = false
		if (user) {
			// VALIDAR USUARIO
			const query = (await execute(
				isNew
					? `INSERT INTO Users (user_id, user_role, user_name, department_fk, password, date_in, active) VALUES (
					users_seq.nextval, '${user?.role}', '${user?.name}', ${
							user?.department
								? `(SELECT department_id FROM Departments WHERE department_name = '${user?.department}')`
								: 'NULL'
					  }, '${user?.password}', '${user?.dateIn}', 1
					)`
					: `SELECT user_id, user_role, password, active FROM Users WHERE user_name = '${user?.name}'`,
			).catch((err) => {
				hasErr = true
				sendError(res, err)
			})) as OracleDB.Result<unknown>

			if (
				((query?.rows &&
					query?.rows.length &&
					// @ts-ignore
					query?.rows?.[0][2] === user.password &&
					// @ts-ignore
					query?.rows?.[0][3] === 1) ||
					isNew) &&
				!hasErr &&
				user
			) {
				return sendData(res, {
					// @ts-ignore
					uid: query.rows?.[0][0],
					// @ts-ignore
					role: query.rows?.[0][1],
					token: jwt.sign(
						// @ts-ignore
						{ ...user, role: query.rows?.[0][1] },
						process.env.TOKEN_SECRET || '',
						{
							expiresIn: `${3 * (isNew ? 1 : 5)}m`,
						},
					),
				})
			} else {
				if (!hasErr) return sendError(res)
			}
		}
	}

	/**
	 * Iniciar sesión
	 * @description Iniciar sesión y refrescar token
	 * @param req
	 * @param res
	 */
	public async login(req: express.Request, res: express.Response) {
		return await this.getUser(req, res)
	}

	/**
	 * Crear sesión
	 * @description Crear sesión y refrescar token
	 * @param req
	 * @param res
	 */
	public async signing(req: express.Request, res: express.Response) {
		return await this.getUser(req, res, true)
	}
}

export default AuthService
