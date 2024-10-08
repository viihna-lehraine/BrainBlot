import {
	MailerServiceProvider,
	MulterUploadServiceProvider
} from '../providers/PreHTTPServiceProviders.mjs';
export class PreHTTPSFactory {
	static async getMailerService() {
		return await MailerServiceProvider.getMailerService();
	}
	static async getMulterUploadService() {
		return await MulterUploadServiceProvider.getMulterUploadService();
	}
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJlSFRUUFNGYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2luZGV4L2ZhY3Rvcnkvc3ViZmFjdG9yaWVzL1ByZUhUVFBTRmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxPQUFPLEVBQ04scUJBQXFCLEVBQ3JCLDJCQUEyQixFQUMzQixNQUFNLHNDQUFzQyxDQUFDO0FBRTlDLE1BQU0sT0FBTyxlQUFlO0lBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCO1FBQ25DLE9BQU8sTUFBTSxxQkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3ZELENBQUM7SUFFTSxNQUFNLENBQUMsS0FBSyxDQUFDLHNCQUFzQjtRQUN6QyxPQUFPLE1BQU0sMkJBQTJCLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNuRSxDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRNYWlsZXJTZXJ2aWNlSW50ZXJmYWNlLFxuXHRNdWx0ZXJVcGxvYWRTZXJ2aWNlSW50ZXJmYWNlXG59IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbWFpbic7XG5pbXBvcnQge1xuXHRNYWlsZXJTZXJ2aWNlUHJvdmlkZXIsXG5cdE11bHRlclVwbG9hZFNlcnZpY2VQcm92aWRlclxufSBmcm9tICcuLi9wcm92aWRlcnMvUHJlSFRUUFNlcnZpY2VQcm92aWRlcnMnO1xuXG5leHBvcnQgY2xhc3MgUHJlSFRUUFNGYWN0b3J5IHtcblx0cHVibGljIHN0YXRpYyBhc3luYyBnZXRNYWlsZXJTZXJ2aWNlKCk6IFByb21pc2U8TWFpbGVyU2VydmljZUludGVyZmFjZT4ge1xuXHRcdHJldHVybiBhd2FpdCBNYWlsZXJTZXJ2aWNlUHJvdmlkZXIuZ2V0TWFpbGVyU2VydmljZSgpO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBhc3luYyBnZXRNdWx0ZXJVcGxvYWRTZXJ2aWNlKCk6IFByb21pc2U8TXVsdGVyVXBsb2FkU2VydmljZUludGVyZmFjZT4ge1xuXHRcdHJldHVybiBhd2FpdCBNdWx0ZXJVcGxvYWRTZXJ2aWNlUHJvdmlkZXIuZ2V0TXVsdGVyVXBsb2FkU2VydmljZSgpO1xuXHR9XG59XG4iXX0=
