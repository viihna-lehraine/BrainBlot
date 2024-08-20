import { __awaiter } from 'tslib';
import rangeCheck from 'range_check';
import fs from 'fs';
import path from 'path';
import { __dirname } from '../config/loadEnv';
import setupLogger from '../middleware/logger';
let blacklist = [];
let logger;
let rangeCheckModule;
// Initialize rangeCheck and load the blacklist
const initializeBlacklist = () =>
	__awaiter(void 0, void 0, void 0, function* () {
		logger = yield setupLogger();
		try {
			if (!rangeCheckModule) {
				rangeCheckModule = rangeCheck;
				logger.info('rangeCheck module loaded successfully');
			}
			yield loadBlacklist();
			logger.info(
				'Blacklist and range_check module loaded successfully.'
			);
		} catch (err) {
			logger.error('Error during blacklist initialization: ', err);
			throw err;
		}
	});
// Load the blacklist from file
export const loadBlacklist = () =>
	__awaiter(void 0, void 0, void 0, function* () {
		const logger = yield setupLogger();
		const filePath = path.join(__dirname, '../../data/blacklist.json');
		try {
			if (fs.existsSync(filePath)) {
				const data = fs.readFileSync(filePath, 'utf8');
				blacklist = JSON.parse(data);
			}
		} catch (err) {
			logger.error('Error loading blacklist: ', err);
			blacklist = []; // default to empty array in case of failure
		}
	});
// Add an IP or range to the blacklist
export const addToBlacklist = (ip) => {
	if (!blacklist.includes(ip)) {
		blacklist.push(ip);
		saveBlacklist();
	}
};
// Save the blacklist
const saveBlacklist = () =>
	__awaiter(void 0, void 0, void 0, function* () {
		const filePath = path.join(__dirname, '../../data/blacklist.json');
		try {
			fs.writeFileSync(filePath, JSON.stringify(blacklist, null, 2));
		} catch (err) {
			console.error('Error saving blacklist: ', err);
		}
	});
// Middleware to check if the requester's IP is blacklisted
export const ipBlacklistMiddleware = (req, res, next) => {
	if (!rangeCheck) {
		console.error('rangeCheck module is not loaded');
		return res.status(500).json({ error: 'Server error' });
	}
	const clientIp = req.ip;
	if (!clientIp) {
		console.error('Client IP undefined');
		return res.status(500).json({ error: 'Bad request' });
	}
	if (blacklist.some((range) => rangeCheck.inRange(clientIp, range))) {
		console.log(`Blocked request from blacklisted IP: ${clientIp}`);
		return res.status(403).json({ error: 'Access denied' });
	}
	return next();
};
// Remove an IP or range from the blacklist
export const removeFromBlacklist = (ip) => {
	blacklist = blacklist.filter((range) => range != ip);
	saveBlacklist();
};
export const initializeIpBlacklist = initializeBlacklist;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXBCbGFja2xpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9taWRkbGV3YXJlL2lwQmxhY2tsaXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLFVBQVUsTUFBTSxhQUFhLENBQUM7QUFHckMsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBQ3BCLE9BQU8sSUFBSSxNQUFNLE1BQU0sQ0FBQztBQUN4QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUMsT0FBTyxXQUFXLE1BQU0sc0JBQXNCLENBQUM7QUFNL0MsSUFBSSxTQUFTLEdBQWEsRUFBRSxDQUFDO0FBQzdCLElBQUksTUFBYyxDQUFDO0FBQ25CLElBQUksZ0JBQTRDLENBQUM7QUFFakQsK0NBQStDO0FBQy9DLE1BQU0sbUJBQW1CLEdBQUcsR0FBd0IsRUFBRTtJQUNyRCxNQUFNLEdBQUcsTUFBTSxXQUFXLEVBQUUsQ0FBQztJQUM3QixJQUFJLENBQUM7UUFDSixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN2QixnQkFBZ0IsR0FBRyxVQUFVLENBQUM7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFDRCxNQUFNLGFBQWEsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsdURBQXVELENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMseUNBQXlDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDN0QsTUFBTSxHQUFHLENBQUM7SUFDWCxDQUFDO0FBQ0YsQ0FBQyxDQUFBLENBQUM7QUFFRiwrQkFBK0I7QUFDL0IsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLEdBQXdCLEVBQUU7SUFDdEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxXQUFXLEVBQUUsQ0FBQztJQUNuQyxNQUFNLFFBQVEs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QUN2RCxTQUFTLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELGFBQWEsRUFBRSxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFHLG1CQUFtQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJhbmdlQ2hlY2sgZnJvbSAncmFuZ2VfY2hlY2snO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSAnd2luc3Rvbic7XG5pbXBvcnQgeyBSZXF1ZXN0LCBSZXNwb25zZSwgTmV4dEZ1bmN0aW9uIH0gZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBfX2Rpcm5hbWUgfSBmcm9tICcuLi9jb25maWcvbG9hZEVudic7XG5pbXBvcnQgc2V0dXBMb2dnZXIgZnJvbSAnLi4vbWlkZGxld2FyZS9sb2dnZXInO1xuXG50eXBlIFJhbmdlQ2hlY2tUeXBlID0ge1xuXHRpblJhbmdlOiAoaXA6IHN0cmluZywgcmFuZ2U6IHN0cmluZykgPT4gYm9vbGVhbjtcbn07XG5cbmxldCBibGFja2xpc3Q6IHN0cmluZ1tdID0gW107XG5sZXQgbG9nZ2VyOiBMb2dnZXI7XG5sZXQgcmFuZ2VDaGVja01vZHVsZTogUmFuZ2VDaGVja1R5cGUgfCB1bmRlZmluZWQ7XG5cbi8vIEluaXRpYWxpemUgcmFuZ2VDaGVjayBhbmQgbG9hZCB0aGUgYmxhY2tsaXN0XG5jb25zdCBpbml0aWFsaXplQmxhY2tsaXN0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuXHRsb2dnZXIgPSBhd2FpdCBzZXR1cExvZ2dlcigpO1xuXHR0cnkge1xuXHRcdGlmICghcmFuZ2VDaGVja01vZHVsZSkge1xuXHRcdFx0cmFuZ2VDaGVja01vZHVsZSA9IHJhbmdlQ2hlY2s7XG5cdFx0XHRsb2dnZXIuaW5mbygncmFuZ2VDaGVjayBtb2R1bGUgbG9hZGVkIHN1Y2Nlc3NmdWxseScpO1xuXHRcdH1cblx0XHRhd2FpdCBsb2FkQmxhY2tsaXN0KCk7XG5cdFx0bG9nZ2VyLmluZm8oJ0JsYWNrbGlzdCBhbmQgcmFuZ2VfY2hlY2sgbW9kdWxlIGxvYWRlZCBzdWNjZXNzZnVsbHkuJyk7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdGxvZ2dlci5lcnJvcignRXJyb3IgZHVyaW5nIGJsYWNrbGlzdCBpbml0aWFsaXphdGlvbjogJywgZXJyKTtcblx0XHR0aHJvdyBlcnI7XG5cdH1cbn07XG5cbi8vIExvYWQgdGhlIGJsYWNrbGlzdCBmcm9tIGZpbGVcbmV4cG9ydCBjb25zdCBsb2FkQmxhY2tsaXN0ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuXHRjb25zdCBsb2dnZXIgPSBhd2FpdCBzZXR1cExvZ2dlcigpO1xuXHRjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi9kYXRhL2JsYWNrbGlzdC5qc29uJyk7XG5cdHRyeSB7XG5cdFx0aWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG5cdFx0XHRjb25zdCBkYXRhID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmOCcpO1xuXHRcdFx0YmxhY2tsaXN0ID0gSlNPTi5wYXJzZShkYXRhKTtcblx0XHR9XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdGxvZ2dlci5lcnJvcignRXJyb3IgbG9hZGluZyBibGFja2xpc3Q6ICcsIGVycik7XG5cdFx0YmxhY2tsaXN0ID0gW107IC8vIGRlZmF1bHQgdG8gZW1wdHkgYXJyYXkgaW4gY2FzZSBvZiBmYWlsdXJlXG5cdH1cbn07XG5cbi8vIEFkZCBhbiBJUCBvciByYW5nZSB0byB0aGUgYmxhY2tsaXN0XG5leHBvcnQgY29uc3QgYWRkVG9CbGFja2xpc3QgPSAoaXA6IHN0cmluZyk6IHZvaWQgPT4ge1xuXHRpZiAoIWJsYWNrbGlzdC5pbmNsdWRlcyhpcCkpIHtcblx0XHRibGFja2xpc3QucHVzaChpcCk7XG5cdFx0c2F2ZUJsYWNrbGlzdCgpO1xuXHR9XG59O1xuXG4vLyBTYXZlIHRoZSBibGFja2xpc3RcbmNvbnN0IHNhdmVCbGFja2xpc3QgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG5cdGNvbnN0IGZpbGVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uL2RhdGEvYmxhY2tsaXN0Lmpzb24nKTtcblx0dHJ5IHtcblx0XHRmcy53cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCBKU09OLnN0cmluZ2lmeShibGFja2xpc3QsIG51bGwsIDIpKTtcblx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0Y29uc29sZS5lcnJvcignRXJyb3Igc2F2aW5nIGJsYWNrbGlzdDogJywgZXJyKTtcblx0fVxufTtcblxuLy8gTWlkZGxld2FyZSB0byBjaGVjayBpZiB0aGUgcmVxdWVzdGVyJ3MgSVAgaXMgYmxhY2tsaXN0ZWRcbmV4cG9ydCBjb25zdCBpcEJsYWNrbGlzdE1pZGRsZXdhcmUgPSAoXG5cdHJlcTogUmVxdWVzdCxcblx0cmVzOiBSZXNwb25zZSxcblx0bmV4dDogTmV4dEZ1bmN0aW9uXG4pID0+IHtcblx0aWYgKCFyYW5nZUNoZWNrKSB7XG5cdFx0Y29uc29sZS5lcnJvcigncmFuZ2VDaGVjayBtb2R1bGUgaXMgbm90IGxvYWRlZCcpO1xuXHRcdHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiAnU2VydmVyIGVycm9yJyB9KTtcblx0fVxuXG5cdGNvbnN0IGNsaWVudElwID0gcmVxLmlwO1xuXG5cdGlmICghY2xpZW50SXApIHtcblx0XHRjb25zb2xlLmVycm9yKCdDbGllbnQgSVAgdW5kZWZpbmVkJyk7XG5cdFx0cmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6ICdCYWQgcmVxdWVzdCcgfSk7XG5cdH1cblxuXHRpZiAoYmxhY2tsaXN0LnNvbWUoKHJhbmdlKSA9PiByYW5nZUNoZWNrIS5pblJhbmdlKGNsaWVudElwLCByYW5nZSkpKSB7XG5cdFx0Y29uc29sZS5sb2coYEJsb2NrZWQgcmVxdWVzdCBmcm9tIGJsYWNrbGlzdGVkIElQOiAke2NsaWVudElwfWApO1xuXHRcdHJldHVybiByZXMuc3RhdHVzKDQwMykuanNvbih7IGVycm9yOiAnQWNjZXNzIGRlbmllZCcgfSk7XG5cdH1cblxuXHRyZXR1cm4gbmV4dCgpO1xufTtcblxuLy8gUmVtb3ZlIGFuIElQIG9yIHJhbmdlIGZyb20gdGhlIGJsYWNrbGlzdFxuZXhwb3J0IGNvbnN0IHJlbW92ZUZyb21CbGFja2xpc3QgPSAoaXA6IHN0cmluZyk6IHZvaWQgPT4ge1xuXHRibGFja2xpc3QgPSBibGFja2xpc3QuZmlsdGVyKChyYW5nZSkgPT4gcmFuZ2UgIT0gaXApO1xuXHRzYXZlQmxhY2tsaXN0KCk7XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbGl6ZUlwQmxhY2tsaXN0ID0gaW5pdGlhbGl6ZUJsYWNrbGlzdDtcbiJdfQ==
