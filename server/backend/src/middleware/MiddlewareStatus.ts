import {
	AppLoggerServiceInterface,
	ErrorHandlerServiceInterface,
	ErrorLoggerServiceInterface,
	MiddlewareStatusServiceInterface
} from '../index/interfaces/main';
import { LoggerServiceFactory } from '../index/factory/subfactories/LoggerServiceFactory';
import { ErrorHandlerServiceFactory } from '../index/factory/subfactories/ErrorHandlerServiceFactory';

export class MiddlewareStatusService
	implements MiddlewareStatusServiceInterface
{
	private static instance: MiddlewareStatusService | null = null;

	private middlewareStatus: Map<string, 'on' | 'off'> = new Map();
	private logger: AppLoggerServiceInterface;
	private errorLogger: ErrorLoggerServiceInterface;
	private errorHandler: ErrorHandlerServiceInterface;

	private constructor(
		logger: AppLoggerServiceInterface,
		errorLogger: ErrorLoggerServiceInterface,
		errorHandler: ErrorHandlerServiceInterface
	) {
		this.logger = logger;
		this.errorLogger = errorLogger;
		this.errorHandler = errorHandler;
	}

	public static async getInstance(): Promise<MiddlewareStatusService> {
		if (!MiddlewareStatusService.instance) {
			const logger = await LoggerServiceFactory.getLoggerService();
			const errorLogger =
				await LoggerServiceFactory.getErrorLoggerService();
			const errorHandler =
				await ErrorHandlerServiceFactory.getErrorHandlerService();

			MiddlewareStatusService.instance = new MiddlewareStatusService(
				logger,
				errorLogger,
				errorHandler
			);
		}

		return MiddlewareStatusService.instance;
	}

	public setStatus(middlewareName: string, status: 'on' | 'off'): void {
		try {
			this.middlewareStatus.set(middlewareName, status);
		} catch (error) {
			this.errorLogger.logError(
				`Failed to update middleware for middleware ${middlewareName}: ${error}`
			);
			this.errorHandler.handleError({
				error,
				details: {
					context: 'MIDDLEWARE_STATUS',
					reason: 'Failed to update middleware status'
				}
			});
		}

		if (status === 'on') {
			this.logger.info(
				`Middleware ${middlewareName} status updated to ${status}`
			);
		} else if (status === 'off') {
			this.errorLogger.logWarn(
				`Middleware ${middlewareName} status updated to ${status}`
			);
		}
	}

	public getStatus(middlewareName: string): 'on' | 'off' | undefined | void {
		try {
			return this.middlewareStatus.get(middlewareName);
		} catch (error) {
			this.errorLogger.logError(
				`Failed to retrieve middleware status for ${middlewareName}: ${error}`
			);
			this.errorHandler.handleError({
				error,
				details: {
					context: 'MIDDLEWARE_STATUS',
					reason: 'Failed to retrieve middleware status'
				}
			});
		}
	}

	public isMiddlewareOn(middlewareName: string): boolean {
		return this.getStatus(middlewareName) === 'on';
	}

	public async shutdown(): Promise<void> {
		try {
			this.middlewareStatus.clear();
			this.logger.info(
				'Middleware Status Service shutdown successfully.'
			);
			MiddlewareStatusService.instance = null;
		} catch (error) {
			this.errorLogger.logError(
				`Error shutting down Middleware Status Service: ${
					error instanceof Error ? error.message : error
				}`
			);
		}
	}
}
