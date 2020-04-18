import { Request, Response } from 'express';

import { userFormat } from '../utils/format.util';
import { AuthService } from '../services/auth.service';
import { transErrors, transSuccess } from '../lang/vi';
import { dataError, dataSuccess } from '../utils/json.util';
import { changePassword, login, register } from '../validations/auth.validation';

export class AuthController {
    constructor() {}

    /**
     * This is function login
     * @param req
     * @param res
     */
    static async login(req: Request, res: Response): Promise<any> {
        // Check validation
        const { errors, isValid } = login(req.body);
        if (!isValid) return res.send(dataError(errors || transErrors.system.server_error));

        try {
            const result = await AuthService.login(req.body);
            return res.send(dataSuccess(transSuccess.system.success, result));
        } catch (error) {
            return res.send(dataError(error.message || transErrors.system.server_error));
        }
    }

    /**
     * This is function register
     * @param req
     * @param res
     */
    static async register(req: Request, res: Response): Promise<any> {
        // Check validation
        const { errors, isValid } = register(req.body);
        if (!isValid) return res.send(dataError(errors || transErrors.system.server_error));

        try {
            const result = await AuthService.register(req.body);
            return res.send(dataSuccess(transSuccess.system.success, result));
        } catch (error) {
            return res.send(dataError(error.message || transErrors.system.server_error));
        }
    }

    /**
     * Get user by token
     * @param req
     * @param res
     */
    static async auth(req: Request, res: Response): Promise<any> {
        try {
            const result = await userFormat(req.user);
            return res.send(dataSuccess(transSuccess.system.success, result));
        } catch (error) {
            return res.send(dataError(error.message || transErrors.system.server_error));
        }
    }

    /**
     * Change password user
     * @param req
     * @param res
     */
    static async changePassword(req: Request, res: Response): Promise<any> {
        // Check validation
        const { errors, isValid } = changePassword(req.body);
        if (!isValid) return res.send(dataError(errors || transErrors.system.server_error));

        try {
            const result = await AuthService.updatePassword(req.body);
            return res.send(dataSuccess(transSuccess.system.success, result));
        } catch (error) {
            return res.send(dataError(error.message || transErrors.system.server_error));
        }
    }
}
