import { LoggerServiceFactory } from '../index/factory/subfactories/LoggerServiceFactory.mjs';
import { ErrorHandlerServiceFactory } from '../index/factory/subfactories/ErrorHandlerServiceFactory.mjs';
export class PassportAuthMiddlewareService {
	static instance = null;
	logger;
	errorLogger;
	errorHandler;
	constructor(logger, errorLogger, errorHandler) {
		this.logger = logger;
		this.errorLogger = errorLogger;
		this.errorHandler = errorHandler;
	}
	static async getInstance() {
		if (!PassportAuthMiddlewareService.instance) {
			const logger = await LoggerServiceFactory.getLoggerService();
			const errorLogger =
				await LoggerServiceFactory.getErrorLoggerService();
			const errorHandler =
				await ErrorHandlerServiceFactory.getErrorHandlerService();
			PassportAuthMiddlewareService.instance =
				new PassportAuthMiddlewareService(
					logger,
					errorLogger,
					errorHandler
				);
		}
		return PassportAuthMiddlewareService.instance;
	}
	initializePassportAuthMiddleware({
		passport,
		authenticateOptions,
		validateDependencies
	}) {
		validateDependencies(
			[
				{ name: 'passport', instance: passport },
				{ name: 'authenticateOptions', instance: authenticateOptions }
			],
			this.logger
		);
		return (req, res, next) => {
			try {
				passport.authenticate(
					'jwt',
					authenticateOptions,
					(err, user) => {
						if (err) {
							this.logger.error(
								`Passport authentication error: ${err.message}`
							);
							res.status(500).json({
								error: 'Internal Server Error'
							});
							return;
						}
						if (!user) {
							this.logger.warn('Unauthorized access attempt');
							res.status(401).json({ error: 'Unauthorized' });
							return;
						}
						req.user = user;
						return next();
					}
				)(req, res, next);
			} catch (expressError) {
				this.handleError(expressError, req, res, next);
			}
		};
	}
	async shutdown() {
		try {
			this.logger.info('Shutting down Passport middleware service...');
			PassportAuthMiddlewareService.instance = null;
			this.logger.info('Passport middleware service has been shut down.');
		} catch (error) {
			this.errorLogger.logError(
				`Error shutting down Passport middleware service: ${error instanceof Error ? error.message : error}`
			);
		}
	}
	handleError(expressError, req, res, next) {
		const middleware = 'PassportMiddlewareService';
		const expressMiddlewareError =
			new this.errorHandler.ErrorClasses.ExpressError(
				`Fatal error: Execution of ${middleware} failed\nShutting down...\n${
					expressError instanceof Error
						? expressError.message
						: 'Unknown error'
				}`,
				{
					utility: middleware,
					originalError: expressError
				}
			);
		this.errorLogger.logError(expressMiddlewareError.message);
		this.errorHandler.expressErrorHandler()(
			expressMiddlewareError,
			req,
			res,
			next
		);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFzc3BvcnRBdXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21pZGRsZXdhcmUvUGFzc3BvcnRBdXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQzFGLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDBEQUEwRCxDQUFDO0FBRXRHLE1BQU0sT0FBTyw2QkFBNkI7SUFHakMsTUFBTSxDQUFDLFFBQVEsR0FBeUMsSUFBSSxDQUFDO0lBQzdELE1BQU0sQ0FBNEI7SUFDbEMsV0FBVyxDQUE4QjtJQUN6QyxZQUFZLENBQStCO0lBRW5ELFlBQ0MsTUFBaUMsRUFDakMsV0FBd0MsRUFDeEMsWUFBMEM7UUFFMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7SUFDbEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVztRQUM5QixJQUFJLENBQUMsNkJBQTZCLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDN0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQzdELE1BQU0sV0FBVyxHQUNoQixNQUFNLG9CQUFvQixDQUFDLHFCQUFxQixFQUFFLENBQUM7WUFDcEQsTUFBTSxZQUFZLEdBQ2pCLE1BQU0sMEJBQTBCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUUzRCw2QkFBNkIsQ0FBQyxRQUFRO2dCQUNyQyxJQUFJLDZCQUE2QixDQUNoQyxNQUFNLEVBQ04sV0FBVyxFQUNYLFlBQVksQ0FDWixDQUFDO1FBQ0osQ0FBQztRQUNELE9BQU8sNkJBQTZCLENBQUMsUUFBUSxDQUFDO0lBQy9DLENBQUM7SUFFTSxnQ0FBZ0MsQ0FBQyxFQUN2QyxRQUFRLEVBQ1IsbUJB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SCxHQUFHLEVBQ0gsSUFBSSxDQUNKLENBQUM7UUFDRixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlcXVlc3QsIFJlcXVlc3RIYW5kbGVyLCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQge1xuXHRBcHBMb2dnZXJTZXJ2aWNlSW50ZXJmYWNlLFxuXHRFcnJvckhhbmRsZXJTZXJ2aWNlSW50ZXJmYWNlLFxuXHRFcnJvckxvZ2dlclNlcnZpY2VJbnRlcmZhY2UsXG5cdFBhc3Nwb3J0QXV0aE1pZGRsZXdhcmVTZXJ2aWNlRGVwcyxcblx0UGFzc3BvcnRBdXRoTWlkZGxld2FyZVNlcnZpY2VJbnRlcmZhY2Vcbn0gZnJvbSAnLi4vaW5kZXgvaW50ZXJmYWNlcy9tYWluJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2VGYWN0b3J5IH0gZnJvbSAnLi4vaW5kZXgvZmFjdG9yeS9zdWJmYWN0b3JpZXMvTG9nZ2VyU2VydmljZUZhY3RvcnknO1xuaW1wb3J0IHsgRXJyb3JIYW5kbGVyU2VydmljZUZhY3RvcnkgfSBmcm9tICcuLi9pbmRleC9mYWN0b3J5L3N1YmZhY3Rvcmllcy9FcnJvckhhbmRsZXJTZXJ2aWNlRmFjdG9yeSc7XG5cbmV4cG9ydCBjbGFzcyBQYXNzcG9ydEF1dGhNaWRkbGV3YXJlU2VydmljZVxuXHRpbXBsZW1lbnRzIFBhc3Nwb3J0QXV0aE1pZGRsZXdhcmVTZXJ2aWNlSW50ZXJmYWNlXG57XG5cdHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBQYXNzcG9ydEF1dGhNaWRkbGV3YXJlU2VydmljZSB8IG51bGwgPSBudWxsO1xuXHRwcml2YXRlIGxvZ2dlcjogQXBwTG9nZ2VyU2VydmljZUludGVyZmFjZTtcblx0cHJpdmF0ZSBlcnJvckxvZ2dlcjogRXJyb3JMb2dnZXJTZXJ2aWNlSW50ZXJmYWNlO1xuXHRwcml2YXRlIGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyU2VydmljZUludGVyZmFjZTtcblxuXHRwcml2YXRlIGNvbnN0cnVjdG9yKFxuXHRcdGxvZ2dlcjogQXBwTG9nZ2VyU2VydmljZUludGVyZmFjZSxcblx0XHRlcnJvckxvZ2dlcjogRXJyb3JMb2dnZXJTZXJ2aWNlSW50ZXJmYWNlLFxuXHRcdGVycm9ySGFuZGxlcjogRXJyb3JIYW5kbGVyU2VydmljZUludGVyZmFjZVxuXHQpIHtcblx0XHR0aGlzLmxvZ2dlciA9IGxvZ2dlcjtcblx0XHR0aGlzLmVycm9yTG9nZ2VyID0gZXJyb3JMb2dnZXI7XG5cdFx0dGhpcy5lcnJvckhhbmRsZXIgPSBlcnJvckhhbmRsZXI7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGFzeW5jIGdldEluc3RhbmNlKCk6IFByb21pc2U8UGFzc3BvcnRBdXRoTWlkZGxld2FyZVNlcnZpY2U+IHtcblx0XHRpZiAoIVBhc3Nwb3J0QXV0aE1pZGRsZXdhcmVTZXJ2aWNlLmluc3RhbmNlKSB7XG5cdFx0XHRjb25zdCBsb2dnZXIgPSBhd2FpdCBMb2dnZXJTZXJ2aWNlRmFjdG9yeS5nZXRMb2dnZXJTZXJ2aWNlKCk7XG5cdFx0XHRjb25zdCBlcnJvckxvZ2dlciA9XG5cdFx0XHRcdGF3YWl0IExvZ2dlclNlcnZpY2VGYWN0b3J5LmdldEVycm9yTG9nZ2VyU2VydmljZSgpO1xuXHRcdFx0Y29uc3QgZXJyb3JIYW5kbGVyID1cblx0XHRcdFx0YXdhaXQgRXJyb3JIYW5kbGVyU2VydmljZUZhY3RvcnkuZ2V0RXJyb3JIYW5kbGVyU2VydmljZSgpO1xuXG5cdFx0XHRQYXNzcG9ydEF1dGhNaWRkbGV3YXJlU2VydmljZS5pbnN0YW5jZSA9XG5cdFx0XHRcdG5ldyBQYXNzcG9ydEF1dGhNaWRkbGV3YXJlU2VydmljZShcblx0XHRcdFx0XHRsb2dnZXIsXG5cdFx0XHRcdFx0ZXJyb3JMb2dnZXIsXG5cdFx0XHRcdFx0ZXJyb3JIYW5kbGVyXG5cdFx0XHRcdCk7XG5cdFx0fVxuXHRcdHJldHVybiBQYXNzcG9ydEF1dGhNaWRkbGV3YXJlU2VydmljZS5pbnN0YW5jZTtcblx0fVxuXG5cdHB1YmxpYyBpbml0aWFsaXplUGFzc3BvcnRBdXRoTWlkZGxld2FyZSh7XG5cdFx0cGFzc3BvcnQsXG5cdFx0YXV0aGVudGljYXRlT3B0aW9ucyxcblx0XHR2YWxpZGF0ZURlcGVuZGVuY2llc1xuXHR9OiBQYXNzcG9ydEF1dGhNaWRkbGV3YXJlU2VydmljZURlcHMpOiBSZXF1ZXN0SGFuZGxlciB7XG5cdFx0dmFsaWRhdGVEZXBlbmRlbmNpZXMoXG5cdFx0XHRbXG5cdFx0XHRcdHsgbmFtZTogJ3Bhc3Nwb3J0JywgaW5zdGFuY2U6IHBhc3Nwb3J0IH0sXG5cdFx0XHRcdHsgbmFtZTogJ2F1dGhlbnRpY2F0ZU9wdGlvbnMnLCBpbnN0YW5jZTogYXV0aGVudGljYXRlT3B0aW9ucyB9XG5cdFx0XHRdLFxuXHRcdFx0dGhpcy5sb2dnZXJcblx0XHQpO1xuXG5cdFx0cmV0dXJuIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UsIG5leHQ6IE5leHRGdW5jdGlvbik6IHZvaWQgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0cGFzc3BvcnQuYXV0aGVudGljYXRlKFxuXHRcdFx0XHRcdCdqd3QnLFxuXHRcdFx0XHRcdGF1dGhlbnRpY2F0ZU9wdGlvbnMsXG5cdFx0XHRcdFx0KGVycjogRXJyb3IgfCBudWxsLCB1c2VyOiBFeHByZXNzLlVzZXIgfCBmYWxzZSkgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmxvZ2dlci5lcnJvcihcblx0XHRcdFx0XHRcdFx0XHRgUGFzc3BvcnQgYXV0aGVudGljYXRpb24gZXJyb3I6ICR7ZXJyLm1lc3NhZ2V9YFxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRyZXMuc3RhdHVzKDUwMCkuanNvbih7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3I6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICghdXNlcikge1xuXHRcdFx0XHRcdFx0XHR0aGlzLmxvZ2dlci53YXJuKCdVbmF1dGhvcml6ZWQgYWNjZXNzIGF0dGVtcHQnKTtcblx0XHRcdFx0XHRcdFx0cmVzLnN0YXR1cyg0MDEpLmpzb24oeyBlcnJvcjogJ1VuYXV0aG9yaXplZCcgfSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0cmVxLnVzZXIgPSB1c2VyO1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5leHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCkocmVxLCByZXMsIG5leHQpO1xuXHRcdFx0fSBjYXRjaCAoZXhwcmVzc0Vycm9yKSB7XG5cdFx0XHRcdHRoaXMuaGFuZGxlRXJyb3IoZXhwcmVzc0Vycm9yLCByZXEsIHJlcywgbmV4dCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdHB1YmxpYyBhc3luYyBzaHV0ZG93bigpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5sb2dnZXIuaW5mbygnU2h1dHRpbmcgZG93biBQYXNzcG9ydCBtaWRkbGV3YXJlIHNlcnZpY2UuLi4nKTtcblx0XHRcdFBhc3Nwb3J0QXV0aE1pZGRsZXdhcmVTZXJ2aWNlLmluc3RhbmNlID0gbnVsbDtcblx0XHRcdHRoaXMubG9nZ2VyLmluZm8oJ1Bhc3Nwb3J0IG1pZGRsZXdhcmUgc2VydmljZSBoYXMgYmVlbiBzaHV0IGRvd24uJyk7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdHRoaXMuZXJyb3JMb2dnZXIubG9nRXJyb3IoXG5cdFx0XHRcdGBFcnJvciBzaHV0dGluZyBkb3duIFBhc3Nwb3J0IG1pZGRsZXdhcmUgc2VydmljZTogJHtcblx0XHRcdFx0XHRlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IGVycm9yXG5cdFx0XHRcdH1gXG5cdFx0XHQpO1xuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgaGFuZGxlRXJyb3IoXG5cdFx0ZXhwcmVzc0Vycm9yOiBFcnJvciB8IHVua25vd24sXG5cdFx0cmVxOiBSZXF1ZXN0LFxuXHRcdHJlczogUmVzcG9uc2UsXG5cdFx0bmV4dDogTmV4dEZ1bmN0aW9uXG5cdCk6IHZvaWQge1xuXHRcdGNvbnN0IG1pZGRsZXdhcmU6IHN0cmluZyA9ICdQYXNzcG9ydE1pZGRsZXdhcmVTZXJ2aWNlJztcblx0XHRjb25zdCBleHByZXNzTWlkZGxld2FyZUVycm9yID1cblx0XHRcdG5ldyB0aGlzLmVycm9ySGFuZGxlci5FcnJvckNsYXNzZXMuRXhwcmVzc0Vycm9yKFxuXHRcdFx0XHRgRmF0YWwgZXJyb3I6IEV4ZWN1dGlvbiBvZiAke21pZGRsZXdhcmV9IGZhaWxlZFxcblNodXR0aW5nIGRvd24uLi5cXG4ke1xuXHRcdFx0XHRcdGV4cHJlc3NFcnJvciBpbnN0YW5jZW9mIEVycm9yXG5cdFx0XHRcdFx0XHQ/IGV4cHJlc3NFcnJvci5tZXNzYWdlXG5cdFx0XHRcdFx0XHQ6ICdVbmtub3duIGVycm9yJ1xuXHRcdFx0XHR9YCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHV0aWxpdHk6IG1pZGRsZXdhcmUsXG5cdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXhwcmVzc0Vycm9yXG5cdFx0XHRcdH1cblx0XHRcdCk7XG5cblx0XHR0aGlzLmVycm9yTG9nZ2VyLmxvZ0Vycm9yKGV4cHJlc3NNaWRkbGV3YXJlRXJyb3IubWVzc2FnZSk7XG5cdFx0dGhpcy5lcnJvckhhbmRsZXIuZXhwcmVzc0Vycm9ySGFuZGxlcigpKFxuXHRcdFx0ZXhwcmVzc01pZGRsZXdhcmVFcnJvcixcblx0XHRcdHJlcSxcblx0XHRcdHJlcyxcblx0XHRcdG5leHRcblx0XHQpO1xuXHRcdHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6ICdJbnRlcm5hbCBTZXJ2ZXIgRXJyb3InIH0pO1xuXHR9XG59XG4iXX0=
