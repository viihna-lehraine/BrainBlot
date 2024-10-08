import { CacheService } from '../../../services/Cache.mjs';
export class CacheServiceProvider {
	static instance = null;
	static async getCacheService() {
		if (!this.instance) {
			this.instance = await CacheService.getInstance();
		}
		return this.instance;
	}
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FjaGVMYXllclNlcnZpY2VQcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaW5kZXgvZmFjdG9yeS9wcm92aWRlcnMvQ2FjaGVMYXllclNlcnZpY2VQcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBR3ZELE1BQU0sT0FBTyxvQkFBb0I7SUFDeEIsTUFBTSxDQUFDLFFBQVEsR0FBaUMsSUFBSSxDQUFDO0lBRXRELE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZTtRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbEQsQ0FBQztRQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN0QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FjaGVTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvQ2FjaGUnO1xuaW1wb3J0IHsgQ2FjaGVTZXJ2aWNlSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9tYWluJztcblxuZXhwb3J0IGNsYXNzIENhY2hlU2VydmljZVByb3ZpZGVyIHtcblx0cHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IENhY2hlU2VydmljZUludGVyZmFjZSB8IG51bGwgPSBudWxsO1xuXG5cdHB1YmxpYyBzdGF0aWMgYXN5bmMgZ2V0Q2FjaGVTZXJ2aWNlKCk6IFByb21pc2U8Q2FjaGVTZXJ2aWNlSW50ZXJmYWNlPiB7XG5cdFx0aWYgKCF0aGlzLmluc3RhbmNlKSB7XG5cdFx0XHR0aGlzLmluc3RhbmNlID0gYXdhaXQgQ2FjaGVTZXJ2aWNlLmdldEluc3RhbmNlKCk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmluc3RhbmNlO1xuXHR9XG59XG4iXX0=
