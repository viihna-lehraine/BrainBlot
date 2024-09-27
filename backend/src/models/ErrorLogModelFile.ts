import {
	CreationOptional,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	Model,
	Sequelize
} from 'sequelize';
import { validateDependencies } from '../utils/helpers';
import { ServiceFactory } from '../index/factory';

interface ErrorLogAttributes {
	id: CreationOptional<number>; // primary key, auto-incremented
	name: string;
	message: string;
	statusCode?: number | null;
	severity: string;
	errorCode?: string | null;
	details?: string | Record<string, unknown> | null;
	timestamp: CreationOptional<Date>;
	count: number;
}

class ErrorLog
	extends Model<InferAttributes<ErrorLog>, InferCreationAttributes<ErrorLog>>
	implements ErrorLogAttributes
{
	public id!: CreationOptional<number>;
	public name!: string;
	public message!: string;
	public statusCode!: number | null;
	public severity!: string;
	public errorCode!: string | null;
	public details!: string | Record<string, unknown> | null;
	public timestamp!: CreationOptional<Date>;
	public count!: number;
}

export function createErrorLogModel(
	sequelize: Sequelize
): typeof ErrorLog | null {
	const logger = ServiceFactory.getLoggerService();
	const errorLogger = ServiceFactory.getErrorLoggerService();
	const errorHandler = ServiceFactory.getErrorHandlerService();

	try {
		validateDependencies(
			[{ name: 'sequelize', instance: sequelize }],
			logger
		);

		ErrorLog.init(
			{
				id: {
					type: DataTypes.INTEGER,
					autoIncrement: true,
					primaryKey: true,
					unique: true
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false
				},
				message: {
					type: DataTypes.TEXT,
					allowNull: false
				},
				statusCode: {
					type: DataTypes.INTEGER,
					allowNull: true
				},
				severity: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						isIn: [['info', 'recoverable', 'warning', 'fatal']]
					}
				},
				errorCode: {
					type: DataTypes.STRING,
					allowNull: true
				},
				details: {
					type: DataTypes.JSONB,
					allowNull: true
				},
				timestamp: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: DataTypes.NOW
				},
				count: {
					type: DataTypes.INTEGER,
					allowNull: false,
					defaultValue: 0
				}
			},
			{
				sequelize,
				modelName: 'ErrorLog',
				tableName: 'error_logs',
				timestamps: false
			}
		);

		logger.info('ErrorLog model initialized');

		return ErrorLog;
	} catch (loadModelError) {
		const loadErrorLogModelError =
			new errorHandler.ErrorClasses.DatabaseErrorRecoverable(
				`Failed to initialize ErrorLog model: ${loadModelError instanceof Error ? loadModelError.message : 'Unknown error'}`,
				{
					exposeToClient: false
				}
			);
		errorLogger.logError(loadErrorLogModelError.message);
		errorHandler.handleError({ error: loadErrorLogModelError });
		return null;
	}
}
