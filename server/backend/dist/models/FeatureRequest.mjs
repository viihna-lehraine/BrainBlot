import { DataTypes, Model } from 'sequelize';
import { validateDependencies } from '../utils/helpers.mjs';
import { ServiceFactory } from '../index/factory/ServiceFactory.mjs';
export class FeatureRequest extends Model {
	featureRequestNumber;
	id;
	email;
	featureRequestType;
	featureRequestContent;
	canFollowUpFeatureRequest;
	featureRequestOpenDate;
	featureRequestCloseDate;
}
export async function createFeatureRequestModel() {
	const logger = await ServiceFactory.getLoggerService();
	const errorLogger = await ServiceFactory.getErrorLoggerService();
	const errorHandler = await ServiceFactory.getErrorHandlerService();
	try {
		const databaseController = await ServiceFactory.getDatabaseController();
		const sequelize = databaseController.getSequelizeInstance();
		if (!sequelize) {
			const databaseError =
				new errorHandler.ErrorClasses.DatabaseErrorRecoverable(
					'Failed to initialize FeatureRequest model: Sequelize instance not found',
					{ exposeToClient: false }
				);
			errorLogger.logError(databaseError.message);
			errorHandler.handleError({ error: databaseError });
			return null;
		}
		validateDependencies(
			[{ name: 'sequelize', instance: sequelize }],
			logger
		);
		FeatureRequest.init(
			{
				featureRequestNumber: {
					type: DataTypes.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true
				},
				id: {
					type: DataTypes.STRING,
					allowNull: true
				},
				email: {
					type: DataTypes.STRING,
					allowNull: true
				},
				featureRequestType: {
					type: DataTypes.STRING,
					allowNull: false
				},
				featureRequestContent: {
					type: DataTypes.TEXT,
					allowNull: false
				},
				canFollowUpFeatureRequest: {
					type: DataTypes.BOOLEAN,
					allowNull: false
				},
				featureRequestOpenDate: {
					type: DataTypes.DATE,
					allowNull: false,
					defaultValue: DataTypes.NOW
				},
				featureRequestCloseDate: {
					type: DataTypes.DATE,
					allowNull: true
				}
			},
			{
				sequelize,
				tableName: 'FeatureRequests',
				timestamps: true
			}
		);
		logger.info('FeatureRequest model initialized successfully');
		return FeatureRequest;
	} catch (dbError) {
		const databaseError =
			new errorHandler.ErrorClasses.DatabaseErrorRecoverable(
				`Failed to initialize FeatureRequest model: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`,
				{
					exposeToClient: false
				}
			);
		errorLogger.logError(databaseError.message);
		errorHandler.handleError({ error: databaseError });
		return null;
	}
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmVhdHVyZVJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL0ZlYXR1cmVSZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTixTQUFTLEVBQ1QsS0FBSyxFQUlMLE1BQU0sV0FBVyxDQUFDO0FBQ25CLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQWFqRSxNQUFNLE9BQU8sY0FDWixTQUFRLEtBR1A7SUFHTSxvQkFBb0IsQ0FBVTtJQUM5QixFQUFFLENBQVU7SUFDWixLQUFLLENBQWlCO0lBQ3RCLGtCQUFrQixDQUFVO0lBQzVCLHFCQUFxQixDQUFVO0lBQy9CLHlCQUF5QixDQUFXO0lBQ3BDLHNCQUFzQixDQUEwQjtJQUNoRCx1QkFBdUIsQ0FBZTtDQUM3QztBQUVELE1BQU0sQ0FBQyxLQUFLLFVBQVUseUJBQXlCO0lBRzlDLE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDdkQsTUFBTSxXQUFXLEdBQUcsTUFBTSxjQUFjLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUNqRSxNQUFNLFlBQVksR0FBRyxNQUFNLGNBQWMsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBRW5FLElBQUksQ0FBQztRQUNKLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxjQUFjLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN4RSxNQUFNLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBRTVELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNoQixNQUFNLGFBQWEsR0FDbEIsSUFBSSxZQUFZLENBQUMsWUFBWSxDQUFDLHdCQUF3QixDQUNyRCx5RUFBeUUsRUFDekUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLENBQ3pCLENBQUM7WUFDSCxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxZQUFZLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDbkQsT0FBTyxJQUFJLENBQUM7UUFDYixDQUFDO1FBRUQsb0JBQW9CLENBQ25CLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUM1QyxNQUFNLENBQ04sQ0FBQztRQUVGLGNBQWMsQ0FBQyxJQUFJLENBQ2xCO1lBQ0Msb0JBQW9CLEVBQUU7Z0JBQ3JCLElBQUksRUFBRSxTQUFTLENBQUMsT0FBTztnQkFDdkIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixhQUFhLEVBQUUsSUFBSTthQUNuQjtZQUNELEVBQUUsRUFBRTtnQkFDSCxJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU07Z0JBQ3RCLFNBQVMsRUFBRSxJQUFJO2FBQ2Y7WUFDRCxLQUFLLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLFNBQVMsQ0FBQyxNQUFNO2dCQUN0QixTQUFTLEVBQUUsSUFBSTthQUNmO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ25CLElBQUksRUFBRSxTQUFTLENBQUMsTUFBTTtnQkFDdEIsU0FBUyxFQUFFLEtBQUs7YUFDaEI7WUFDRCxxQkFBcUIsRUFBRTtnQkFDdEIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJO2dCQUNwQixTQUFTLEVBQUUsS0FBSzthQUNoQjtZQUNELHlCQUF5QixFQUFFO2dCQUMxQixJQUFJLEVBQUUsU0FBUyxDQUFDLE9BQU87Z0JBQ3ZCLFNBQVMsRUFBRSxLQUFLO2FBQ2hCO1lBQ0Qsc0JBQXNCLEVBQUU7Z0JBQ3ZCLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTtnQkFDcEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLFlBQVksRUFBRSxTQUFTLENBQUMsR0FBRzthQUMzQjtZQUNELHVCQUF1QixFQUFFO2dCQUN4QixJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUk7Z0JBQ3BCLFNBQVMsRUFBRSxJQUFJO2FBQ2Y7U0FDRCxFQUNEO1lBQ0MsU0FBUztZQUNULFNBQVMsRUFBRSxpQkFBaUI7WUFDNUIsVUFBVSxFQUFFLElBQUk7U0FDaEIsQ0FDRCxDQUFDO1FBRUYsTUFBTSxDQUFDLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1FBQzdELE9BQU8sY0FBYyxDQUFDO0lBQ3ZCLENBQUM7SUFBQyxPQUFPLE9BQU8sRUFBRSxDQUFDO1FBQ2xCLE1BQU0sYUFBYSxHQUNsQixJQUFJLFlBQVksQ0FBQyxZQUFZLENBQUMsd0JBQXdCLENBQ3JELDhDQUE4QyxPQUFPLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsRUFDNUc7WUFDQyxjQUFjLEVBQUUsS0FBSztTQUNyQixDQUNELENBQUM7UUFDSCxXQUFXLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QyxZQUFZLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0FBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdERhdGFUeXBlcyxcblx0TW9kZWwsXG5cdEluZmVyQXR0cmlidXRlcyxcblx0SW5mZXJDcmVhdGlvbkF0dHJpYnV0ZXMsXG5cdENyZWF0aW9uT3B0aW9uYWxcbn0gZnJvbSAnc2VxdWVsaXplJztcbmltcG9ydCB7IHZhbGlkYXRlRGVwZW5kZW5jaWVzIH0gZnJvbSAnLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgeyBTZXJ2aWNlRmFjdG9yeSB9IGZyb20gJy4uL2luZGV4L2ZhY3RvcnkvU2VydmljZUZhY3RvcnknO1xuXG5pbnRlcmZhY2UgRmVhdHVyZVJlcXVlc3RBdHRyaWJ1dGVzIHtcblx0ZmVhdHVyZVJlcXVlc3ROdW1iZXI6IG51bWJlcjtcblx0aWQ6IHN0cmluZztcblx0ZW1haWw/OiBzdHJpbmcgfCBudWxsO1xuXHRmZWF0dXJlUmVxdWVzdFR5cGU6IHN0cmluZztcblx0ZmVhdHVyZVJlcXVlc3RDb250ZW50OiBzdHJpbmc7XG5cdGNhbkZvbGxvd1VwRmVhdHVyZVJlcXVlc3Q6IGJvb2xlYW47XG5cdGZlYXR1cmVSZXF1ZXN0T3BlbkRhdGU6IERhdGU7XG5cdGZlYXR1cmVSZXF1ZXN0Q2xvc2VEYXRlPzogRGF0ZSB8IG51bGw7XG59XG5cbmV4cG9ydCBjbGFzcyBGZWF0dXJlUmVxdWVzdFxuXHRleHRlbmRzIE1vZGVsPFxuXHRcdEluZmVyQXR0cmlidXRlczxGZWF0dXJlUmVxdWVzdD4sXG5cdFx0SW5mZXJDcmVhdGlvbkF0dHJpYnV0ZXM8RmVhdHVyZVJlcXVlc3Q+XG5cdD5cblx0aW1wbGVtZW50cyBGZWF0dXJlUmVxdWVzdEF0dHJpYnV0ZXNcbntcblx0cHVibGljIGZlYXR1cmVSZXF1ZXN0TnVtYmVyITogbnVtYmVyO1xuXHRwdWJsaWMgaWQhOiBzdHJpbmc7XG5cdHB1YmxpYyBlbWFpbCE6IHN0cmluZyB8IG51bGw7XG5cdHB1YmxpYyBmZWF0dXJlUmVxdWVzdFR5cGUhOiBzdHJpbmc7XG5cdHB1YmxpYyBmZWF0dXJlUmVxdWVzdENvbnRlbnQhOiBzdHJpbmc7XG5cdHB1YmxpYyBjYW5Gb2xsb3dVcEZlYXR1cmVSZXF1ZXN0ITogYm9vbGVhbjtcblx0cHVibGljIGZlYXR1cmVSZXF1ZXN0T3BlbkRhdGUhOiBDcmVhdGlvbk9wdGlvbmFsPERhdGU+O1xuXHRwdWJsaWMgZmVhdHVyZVJlcXVlc3RDbG9zZURhdGUhOiBEYXRlIHwgbnVsbDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUZlYXR1cmVSZXF1ZXN0TW9kZWwoKTogUHJvbWlzZTxcblx0dHlwZW9mIEZlYXR1cmVSZXF1ZXN0IHwgbnVsbFxuPiB7XG5cdGNvbnN0IGxvZ2dlciA9IGF3YWl0IFNlcnZpY2VGYWN0b3J5LmdldExvZ2dlclNlcnZpY2UoKTtcblx0Y29uc3QgZXJyb3JMb2dnZXIgPSBhd2FpdCBTZXJ2aWNlRmFjdG9yeS5nZXRFcnJvckxvZ2dlclNlcnZpY2UoKTtcblx0Y29uc3QgZXJyb3JIYW5kbGVyID0gYXdhaXQgU2VydmljZUZhY3RvcnkuZ2V0RXJyb3JIYW5kbGVyU2VydmljZSgpO1xuXG5cdHRyeSB7XG5cdFx0Y29uc3QgZGF0YWJhc2VDb250cm9sbGVyID0gYXdhaXQgU2VydmljZUZhY3RvcnkuZ2V0RGF0YWJhc2VDb250cm9sbGVyKCk7XG5cdFx0Y29uc3Qgc2VxdWVsaXplID0gZGF0YWJhc2VDb250cm9sbGVyLmdldFNlcXVlbGl6ZUluc3RhbmNlKCk7XG5cblx0XHRpZiAoIXNlcXVlbGl6ZSkge1xuXHRcdFx0Y29uc3QgZGF0YWJhc2VFcnJvciA9XG5cdFx0XHRcdG5ldyBlcnJvckhhbmRsZXIuRXJyb3JDbGFzc2VzLkRhdGFiYXNlRXJyb3JSZWNvdmVyYWJsZShcblx0XHRcdFx0XHQnRmFpbGVkIHRvIGluaXRpYWxpemUgRmVhdHVyZVJlcXVlc3QgbW9kZWw6IFNlcXVlbGl6ZSBpbnN0YW5jZSBub3QgZm91bmQnLFxuXHRcdFx0XHRcdHsgZXhwb3NlVG9DbGllbnQ6IGZhbHNlIH1cblx0XHRcdFx0KTtcblx0XHRcdGVycm9yTG9nZ2VyLmxvZ0Vycm9yKGRhdGFiYXNlRXJyb3IubWVzc2FnZSk7XG5cdFx0XHRlcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IoeyBlcnJvcjogZGF0YWJhc2VFcnJvciB9KTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHZhbGlkYXRlRGVwZW5kZW5jaWVzKFxuXHRcdFx0W3sgbmFtZTogJ3NlcXVlbGl6ZScsIGluc3RhbmNlOiBzZXF1ZWxpemUgfV0sXG5cdFx0XHRsb2dnZXJcblx0XHQpO1xuXG5cdFx0RmVhdHVyZVJlcXVlc3QuaW5pdChcblx0XHRcdHtcblx0XHRcdFx0ZmVhdHVyZVJlcXVlc3ROdW1iZXI6IHtcblx0XHRcdFx0XHR0eXBlOiBEYXRhVHlwZXMuSU5URUdFUixcblx0XHRcdFx0XHRhbGxvd051bGw6IGZhbHNlLFxuXHRcdFx0XHRcdHByaW1hcnlLZXk6IHRydWUsXG5cdFx0XHRcdFx0YXV0b0luY3JlbWVudDogdHJ1ZVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRpZDoge1xuXHRcdFx0XHRcdHR5cGU6IERhdGFUeXBlcy5TVFJJTkcsXG5cdFx0XHRcdFx0YWxsb3dOdWxsOiB0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVtYWlsOiB7XG5cdFx0XHRcdFx0dHlwZTogRGF0YVR5cGVzLlNUUklORyxcblx0XHRcdFx0XHRhbGxvd051bGw6IHRydWVcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmVhdHVyZVJlcXVlc3RUeXBlOiB7XG5cdFx0XHRcdFx0dHlwZTogRGF0YVR5cGVzLlNUUklORyxcblx0XHRcdFx0XHRhbGxvd051bGw6IGZhbHNlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZlYXR1cmVSZXF1ZXN0Q29udGVudDoge1xuXHRcdFx0XHRcdHR5cGU6IERhdGFUeXBlcy5URVhULFxuXHRcdFx0XHRcdGFsbG93TnVsbDogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0Y2FuRm9sbG93VXBGZWF0dXJlUmVxdWVzdDoge1xuXHRcdFx0XHRcdHR5cGU6IERhdGFUeXBlcy5CT09MRUFOLFxuXHRcdFx0XHRcdGFsbG93TnVsbDogZmFsc2Vcblx0XHRcdFx0fSxcblx0XHRcdFx0ZmVhdHVyZVJlcXVlc3RPcGVuRGF0ZToge1xuXHRcdFx0XHRcdHR5cGU6IERhdGFUeXBlcy5EQVRFLFxuXHRcdFx0XHRcdGFsbG93TnVsbDogZmFsc2UsXG5cdFx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBEYXRhVHlwZXMuTk9XXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZlYXR1cmVSZXF1ZXN0Q2xvc2VEYXRlOiB7XG5cdFx0XHRcdFx0dHlwZTogRGF0YVR5cGVzLkRBVEUsXG5cdFx0XHRcdFx0YWxsb3dOdWxsOiB0cnVlXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHNlcXVlbGl6ZSxcblx0XHRcdFx0dGFibGVOYW1lOiAnRmVhdHVyZVJlcXVlc3RzJyxcblx0XHRcdFx0dGltZXN0YW1wczogdHJ1ZVxuXHRcdFx0fVxuXHRcdCk7XG5cblx0XHRsb2dnZXIuaW5mbygnRmVhdHVyZVJlcXVlc3QgbW9kZWwgaW5pdGlhbGl6ZWQgc3VjY2Vzc2Z1bGx5Jyk7XG5cdFx0cmV0dXJuIEZlYXR1cmVSZXF1ZXN0O1xuXHR9IGNhdGNoIChkYkVycm9yKSB7XG5cdFx0Y29uc3QgZGF0YWJhc2VFcnJvciA9XG5cdFx0XHRuZXcgZXJyb3JIYW5kbGVyLkVycm9yQ2xhc3Nlcy5EYXRhYmFzZUVycm9yUmVjb3ZlcmFibGUoXG5cdFx0XHRcdGBGYWlsZWQgdG8gaW5pdGlhbGl6ZSBGZWF0dXJlUmVxdWVzdCBtb2RlbDogJHtkYkVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBkYkVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcid9YCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGV4cG9zZVRvQ2xpZW50OiBmYWxzZVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdGVycm9yTG9nZ2VyLmxvZ0Vycm9yKGRhdGFiYXNlRXJyb3IubWVzc2FnZSk7XG5cdFx0ZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKHsgZXJyb3I6IGRhdGFiYXNlRXJyb3IgfSk7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cbn1cbiJdfQ==
