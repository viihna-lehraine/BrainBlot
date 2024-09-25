import TransportStream from 'winston-transport';
import {
	AppLoggerServiceDeps,
	AppLoggerServiceInterface,
	ErrorLoggerServiceInterface
} from '../index/interfaces';
import { Op } from 'sequelize';
import { Logger as WinstonLogger } from 'winston';
import { Request } from 'express';

export class AppLoggerService
	extends WinstonLogger
	implements AppLoggerServiceInterface
{
	public static instance: AppLoggerService | null = null;
	protected _deps: AppLoggerServiceDeps;

	constructor(
		deps: AppLoggerServiceDeps,
		logLevel?: string,
		serviceName?: string
	) {
		const { format, transports, addColors } = deps.winston;
		const { colorize, combine, errors, json, printf, timestamp } = format;

		const resolvedLogLevel =
			logLevel || deps.configService.getEnvVariables().logLevel || 'info';
		const resolvedServiceName =
			serviceName ||
			deps.configService.getEnvVariables().loggerServiceName ||
			'Log Service';
		const isProduction =
			deps.configService.getEnvVariables().nodeEnv === 'production';
		const logDirectory = './data/logs/server/main/';
		const logFormat = printf(({ level, message, timestamp, stack }) => {
			return `${timestamp} ${level}: ${stack || message}`;
		});

		if (!deps.fs.existsSync(logDirectory)) {
			deps.fs.mkdirSync(logDirectory, { recursive: true });
		}

		const loggerTransports: TransportStream[] = [
			new transports.Console({
				format: combine(colorize(), logFormat),
				level: isProduction ? 'info' : resolvedLogLevel
			}),
			new deps.DailyRotateFile({
				filename: 'server-%DATE%.log',
				dirname: logDirectory,
				datePattern: 'YYYY-MM-DD',
				zippedArchive: true,
				maxSize: '20m',
				maxFiles: '30d',
				format: combine(
					timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
					logFormat
				),
				level: resolvedLogLevel
			})
		];

		super({
			levels: AppLoggerService.getCustomLogLevels().levels,
			level: resolvedLogLevel,
			format: combine(errors({ stack: true }), json()),
			defaultMeta: { service: resolvedServiceName },
			transports: loggerTransports
		});

		this.addLogstashTransport(loggerTransports);

		this._deps = deps;
		addColors(AppLoggerService.getCustomLogLevels().colors);
	}

	public static getCustomLogLevels(): {
		levels: Record<string, number>;
		colors: Record<string, string>;
	} {
		return {
			levels: {
				critical: 0,
				error: 1,
				warn: 2,
				info: 3,
				debug: 4,
				notice: 5
			},
			colors: {
				critical: 'red',
				error: 'orange',
				warn: 'yellow',
				info: 'green',
				debug: 'blue',
				notice: 'magenta'
			}
		};
	}

	public static getInstance(
		deps: AppLoggerServiceDeps,
		logLevel?: string,
		serviceName?: string
	): AppLoggerServiceInterface {
		if (!AppLoggerService.instance) {
			AppLoggerService.instance = new AppLoggerService(
				deps,
				logLevel,
				serviceName
			);
		}
		return AppLoggerService.instance;
	}

	private createRedactedLogger(): AppLoggerServiceInterface {
		const redactedLogger: AppLoggerServiceInterface = Object.create(this);

		const levels: (
			| 'debug'
			| 'info'
			| 'notice'
			| 'warn'
			| 'error'
			| 'crit'
		)[] = ['debug', 'info', 'notice', 'warn', 'error', 'crit'];

		levels.forEach(level => {
			const originalMethod = this[level].bind(this);

			redactedLogger[level] = ((
				message: string,
				meta?: Record<string, unknown> | string
			): void => {
				const redactedMeta =
					typeof meta === 'object'
						? this._deps.envSecretsStore.redactSecrets(meta)
						: meta;
				originalMethod(message, redactedMeta);
			}) as typeof originalMethod;
		});

		return Object.assign(redactedLogger, {
			getRedactedLogger: this.getRedactedLogger.bind(this)
		}) as AppLoggerServiceInterface;
	}

	public getLogger(): AppLoggerServiceInterface {
		return this as AppLoggerServiceInterface;
	}

	public getRedactedLogger(): AppLoggerServiceInterface {
		return this.createRedactedLogger();
	}

	private addLogstashTransport(transportsArray: TransportStream[]): void {
		if (this._deps.configService.getFeatureFlags().enableLogStash) {
			const logStashTransport = this.createLogstashTransport();
			if (logStashTransport) {
				transportsArray.push(logStashTransport);
			}
		}
	}

	private createLogstashTransport(): TransportStream | null {
		try {
			return new this._deps.LogStashTransport({
				port: this._deps.configService.getEnvVariables().logStashPort,
				node_name:
					this._deps.configService.getEnvVariables().logStashNode,
				host: this._deps.configService.getEnvVariables().logStashHost
			}) as unknown as TransportStream;
		} catch (error) {
			const logstashError =
				new this._deps.ErrorClasses.ServiceUnavailableError(
					60,
					'Application Logger Service',
					{
						message:
							'Logger Service Error: Failed to create Logstash transport'
					}
				);
			this.logError(
				`Logstash error: ${error instanceof Error ? error.message : error}`
			);
			this._deps.errorHandler.handleError({
				...this._deps.HandleErrorStaticParameters,
				error: logstashError,
				details: { reason: 'Failed to create Logstash transport' }
			});
			return null;
		}
	}

	public logDebug(message: string, details?: Record<string, unknown>): void {
		this.debug(message, details);
	}

	public logInfo(message: string, details?: Record<string, unknown>): void {
		this.info(message, details);
	}

	public logNotice(message: string, details?: Record<string, unknown>): void {
		this.notice(message, details);
	}

	public logWarn(message: string, details?: Record<string, unknown>): void {
		this.warn(message, details);
	}

	public logError(message: string, details?: Record<string, unknown>): void {
		this.error(message, details);
	}

	public logCritical(
		message: string,
		details?: Record<string, unknown>
	): void {
		this.crit(message, details);
	}

	public async cleanUpOldLogs(
		sequelize: import('sequelize').Sequelize,
		retentionPeriodDays: number = 30
	): Promise<void> {
		const retentionDate = new Date();
		retentionDate.setDate(retentionDate.getDate() - retentionPeriodDays);

		try {
			const ErrorLog = sequelize.model('ErrorLog');
			await ErrorLog.destroy({
				where: {
					timestamp: {
						[Op.lt]: retentionDate
					}
				}
			});
			this.info(
				`Old logs older than ${retentionPeriodDays} days have been deleted.`
			);
		} catch (cleanupError) {
			this.error('Failed to clean up old logs', cleanupError);
		}
	}

	public getErrorDetails(
		getCallerInfo: () => string,
		action: string = 'unknown',
		req?: Request,
		userId?: string | null,
		additionalData?: Record<string, unknown>
	): Record<string, unknown> {
		const details: Record<string, unknown> = {
			requestId: req?.headers['x-request-id'] || this._deps.uuidv4(),
			adminId: this._deps.configService.getAdminId() || null,
			userId: userId || null,
			action: action || 'unknown',
			caller: String(getCallerInfo()),
			timestamp: Date.now(),
			requestInfo: {
				method: req?.method || null,
				url: req?.originalUrl || req?.url || null,
				ip:
					req?.ip ||
					req?.headers['x-forwarded-for'] ||
					req?.socket.remoteAddress ||
					null,
				userAgent: req?.headers['user-agent'] || null,
				referrer:
					req?.headers['referer'] || req?.headers['referrer'] || null,
				query: req?.query || null,
				params: req?.params || null,
				body: req?.body
					? this._deps.sanitizeRequestBody(req?.body)
					: null
			},
			...additionalData
		};

		return details;
	}

	public isAppLogger(
		logger: AppLoggerServiceInterface | Console | undefined
	): logger is AppLoggerServiceInterface {
		return (
			logger !== undefined &&
			logger !== null &&
			typeof logger.error === 'function' &&
			typeof logger.warn === 'function' &&
			typeof logger.debug === 'function' &&
			typeof logger.info === 'function' &&
			typeof logger.log === 'function'
		);
	}

	protected get __deps(): AppLoggerServiceDeps {
		return this._deps;
	}
}

export class ErrorLoggerService
	extends AppLoggerService
	implements ErrorLoggerServiceInterface
{
	public static override instance: ErrorLoggerService;
	private errorCounts: Map<string, number>;

	constructor(
		deps: AppLoggerServiceDeps,
		logLevel?: string,
		serviceName?: string
	) {
		super(deps, logLevel, serviceName);
		this.errorCounts = new Map<string, number>();
	}

	public static override getInstance(
		deps: AppLoggerServiceDeps,
		logLevel?: string,
		serviceName?: string
	): AppLoggerServiceInterface {
		if (!ErrorLoggerService.instance) {
			ErrorLoggerService.instance = new ErrorLoggerService(
				deps,
				logLevel,
				serviceName
			);
		}
		return Object.assign(ErrorLoggerService.instance, {
			logAppError: ErrorLoggerService.instance.logAppError.bind(
				ErrorLoggerService.instance
			),
			getErrorCount: ErrorLoggerService.instance.getErrorCount.bind(
				ErrorLoggerService.instance
			),
			getRedactedLogger:
				ErrorLoggerService.instance.getRedactedLogger.bind(
					ErrorLoggerService.instance
				),
			logDebug: ErrorLoggerService.instance.logDebug.bind(
				ErrorLoggerService.instance
			),
			logInfo: ErrorLoggerService.instance.logInfo.bind(
				ErrorLoggerService.instance
			),
			logNotice: ErrorLoggerService.instance.logNotice.bind(
				ErrorLoggerService.instance
			),
			logWarn: ErrorLoggerService.instance.logWarn.bind(
				ErrorLoggerService.instance
			),
			logError: ErrorLoggerService.instance.logError.bind(
				ErrorLoggerService.instance
			),
			logCritical: ErrorLoggerService.instance.logCritical.bind(
				ErrorLoggerService.instance
			),
			cleanUpOldLogs: ErrorLoggerService.instance.cleanUpOldLogs.bind(
				ErrorLoggerService.instance
			),
			getErrorDetails: ErrorLoggerService.instance.getErrorDetails.bind(
				ErrorLoggerService.instance
			),
			isAppLogger: ErrorLoggerService.instance.isAppLogger.bind(
				ErrorLoggerService.instance
			)
		}) as AppLoggerServiceInterface;
	}

	public logAppError(
		error: import('../errors/errorClasses').AppError,
		sequelize?: import('sequelize').Sequelize,
		details: Record<string, unknown> = {}
	): void {
		if (sequelize) {
			this.logToDatabase(error, sequelize).catch(databaseError => {
				this.warn(
					`Could not log error to database: ${databaseError.message || databaseError}`
				);
			});
		} else {
			this.logWarn(
				'Sequelize instance not provided for logging error to database'
			);
		}

		const errorCount = this.errorCounts.get(error.name) || 0;
		this.errorCounts.set(error.name, errorCount + 1);

		if (error.severity === this.__deps.ErrorSeverity.FATAL) {
			this.logError(`FATAL: ${error.message}`, {
				...details,
				severity: error.severity
			});
		} else if (error.severity === this.__deps.ErrorSeverity.RECOVERABLE) {
			this.logWarn(`RECOVERABLE: ${error.message}`, { ...details });
		}
	}

	public async logToDatabase(
		error: import('../errors/errorClasses').AppError,
		sequelize: import('sequelize').Sequelize,
		retryCount: number = 3
	): Promise<void> {
		try {
			const ErrorLog = sequelize.model('ErrorLog');
			await ErrorLog.create({
				name: error.name,
				message: error.message,
				statusCode: error.statusCode,
				severity: error.severity,
				timestamp: new Date(),
				count: this.errorCounts.get(error.name) || 1
			});
			this.info('Error logged to database');
		} catch (databaseError) {
			this.error(`Failed to log error to the database: ${databaseError}`);
			if (retryCount > 0) {
				setTimeout(
					() => {
						this.logToDatabase(error, sequelize, retryCount - 1);
					},
					1000 * (4 - retryCount)
				);
			}
		}
	}

	public getErrorCount(errorName: string): number {
		return this.errorCounts.get(errorName) || 0;
	}
}
