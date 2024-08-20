import { __awaiter } from 'tslib';
import { generateToken } from '../utils/auth/jwtUtil';
import UserModelPromise from '../models/User';
export const login = (req, res) =>
	__awaiter(void 0, void 0, void 0, function* () {
		try {
			const User = yield UserModelPromise;
			const { username, password } = req.body;
			// Correctly type `user` and ensure the correct model is used
			const user = yield User.findOne({ where: { username } });
			if (!user) {
				return res
					.status(401)
					.json({ message: 'Login failed - invalid credentials' });
			}
			// Use the comparePassword method from the User model
			const isPasswordValid = yield user.comparePassword(password);
			if (!isPasswordValid) {
				return res.status(401).json({ message: 'Invalid credentials' });
			}
			// Generate JWT token
			const token = yield generateToken(user);
			// Respond with the token
			res.json({ token });
		} catch (err) {
			console.error(err);
			res.status(500).json({ message: 'Server error' });
		}
		return; // unreachable code, but it satisfies TypeScript *shrug*
	});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9jb250cm9sbGVycy9hdXRoQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sZ0JBQWdCLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQU8sR0FBWSxFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQzFELElBQUksQ0FBQztRQUNKLE1BQU0sSUFBSSxHQUFHLE1BQU0sZ0JBQWdCLENBQUM7UUFFcEMsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBRXhDLDZEQUE2RDtRQUM3RCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFekQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1gsT0FBTyxHQUFHO2lCQUNSLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ1gsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBRUQscURBQXFEO1FBQ3JELE1BQU0sZUFBZSxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU3RCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7UUFDakUsQ0FBQztRQUVELHFCQUFxQjtRQUNyQixNQUFNLEtBQUssR0FBRyxNQUFNLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV4Qyx5QkFBeUI7UUFDekIsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELE9BQU8sQ0FBQyx3REFBd0Q7QUFDakUsQ0FBQyxDQUFBLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSB9IGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0IHsgZ2VuZXJhdGVUb2tlbiB9IGZyb20gJy4uL3V0aWxzL2F1dGgvand0VXRpbCc7XG5pbXBvcnQgVXNlck1vZGVsUHJvbWlzZSBmcm9tICcuLi9tb2RlbHMvVXNlcic7XG5cbmV4cG9ydCBjb25zdCBsb2dpbiA9IGFzeW5jIChyZXE6IFJlcXVlc3QsIHJlczogUmVzcG9uc2UpID0+IHtcblx0dHJ5IHtcblx0XHRjb25zdCBVc2VyID0gYXdhaXQgVXNlck1vZGVsUHJvbWlzZTtcblxuXHRcdGNvbnN0IHsgdXNlcm5hbWUsIHBhc3N3b3JkIH0gPSByZXEuYm9keTtcblxuXHRcdC8vIENvcnJlY3RseSB0eXBlIGB1c2VyYCBhbmQgZW5zdXJlIHRoZSBjb3JyZWN0IG1vZGVsIGlzIHVzZWRcblx0XHRjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kT25lKHsgd2hlcmU6IHsgdXNlcm5hbWUgfSB9KTtcblxuXHRcdGlmICghdXNlcikge1xuXHRcdFx0cmV0dXJuIHJlc1xuXHRcdFx0XHQuc3RhdHVzKDQwMSlcblx0XHRcdFx0Lmpzb24oeyBtZXNzYWdlOiAnTG9naW4gZmFpbGVkIC0gaW52YWxpZCBjcmVkZW50aWFscycgfSk7XG5cdFx0fVxuXG5cdFx0Ly8gVXNlIHRoZSBjb21wYXJlUGFzc3dvcmQgbWV0aG9kIGZyb20gdGhlIFVzZXIgbW9kZWxcblx0XHRjb25zdCBpc1Bhc3N3b3JkVmFsaWQgPSBhd2FpdCB1c2VyLmNvbXBhcmVQYXNzd29yZChwYXNzd29yZCk7XG5cblx0XHRpZiAoIWlzUGFzc3dvcmRWYWxpZCkge1xuXHRcdFx0cmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHsgbWVzc2FnZTogJ0ludmFsaWQgY3JlZGVudGlhbHMnIH0pO1xuXHRcdH1cblxuXHRcdC8vIEdlbmVyYXRlIEpXVCB0b2tlblxuXHRcdGNvbnN0IHRva2VuID0gYXdhaXQgZ2VuZXJhdGVUb2tlbih1c2VyKTtcblxuXHRcdC8vIFJlc3BvbmQgd2l0aCB0aGUgdG9rZW5cblx0XHRyZXMuanNvbih7IHRva2VuIH0pO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHRjb25zb2xlLmVycm9yKGVycik7XG5cdFx0cmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiAnU2VydmVyIGVycm9yJyB9KTtcblx0fVxuXG5cdHJldHVybjsgLy8gdW5yZWFjaGFibGUgY29kZSwgYnV0IGl0IHNhdGlzZmllcyBUeXBlU2NyaXB0ICpzaHJ1Zypcbn07XG4iXX0=
