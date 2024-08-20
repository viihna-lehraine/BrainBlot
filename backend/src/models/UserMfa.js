import { __awaiter } from 'tslib';
import { DataTypes, Model } from 'sequelize';
import initializeDatabase from '../config/db';
import UserModelPromise from './User';
// Fields in the UserMfa Model
class UserMfa extends Model {
	constructor() {
		super(...arguments);
		Object.defineProperty(this, 'id', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'userid', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'isMfaEnabled', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'backupCodes', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'isEmail2faEnabled', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'isTotpl2faEnabled', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'isYubicoOtp2faEnabled', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'isU2f2faEnabled', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'isPasskeyEnabled', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'totpSecret', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'yubicoOtpPublicId', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'yubicoOtpSecretKey', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'fido2CredentialId', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'fido2PublicKey', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'fido2Counter', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'fido2AttestationFormat', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'passkeyCredentialId', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'passkeyPublicKey', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'passkeyCounter', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		Object.defineProperty(this, 'passkeyAttestationFormat', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
	}
}
// Initialize the UserMfa model
function initializeUserMfaModel() {
	return __awaiter(this, void 0, void 0, function* () {
		const sequelize = yield initializeDatabase();
		UserMfa.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
					allowNull: false,
					unique: true,
					references: {
						model: yield UserModelPromise,
						key: 'id'
					}
				},
				userid: {
					type: DataTypes.UUID,
					allowNull: false,
					unique: true,
					references: {
						model: yield UserModelPromise,
						key: 'userid'
					}
				},
				isMfaEnabled: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false,
					references: {
						model: yield UserModelPromise,
						key: 'isMfaEnabled'
					}
				},
				backupCodes: {
					type: DataTypes.ARRAY(DataTypes.STRING),
					defaultValue: null,
					allowNull: true
				},
				isEmail2faEnabled: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false
				},
				isTotpl2faEnabled: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false
				},
				isYubicoOtp2faEnabled: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false
				},
				isU2f2faEnabled: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false
				},
				isPasskeyEnabled: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: false
				},
				totpSecret: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true,
					unique: true
				},
				yubicoOtpPublicId: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true,
					unique: true
				},
				yubicoOtpSecretKey: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true,
					unique: true
				},
				fido2CredentialId: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true,
					unique: true
				},
				fido2PublicKey: {
					type: DataTypes.TEXT,
					defaultValue: null,
					allowNull: true
				},
				fido2Counter: {
					type: DataTypes.INTEGER,
					defaultValue: null,
					allowNull: true
				},
				fido2AttestationFormat: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true
				},
				passkeyCredentialId: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true,
					unique: true
				},
				passkeyPublicKey: {
					type: DataTypes.TEXT,
					defaultValue: null,
					allowNull: true,
					unique: true
				},
				passkeyCounter: {
					type: DataTypes.INTEGER,
					defaultValue: null,
					allowNull: true
				},
				passkeyAttestationFormat: {
					type: DataTypes.STRING,
					defaultValue: null,
					allowNull: true
				}
			},
			{
				sequelize,
				modelName: 'UserMfa',
				timestamps: true
			}
		);
		yield UserMfa.sync();
		return UserMfa;
	});
}
// Export the initialized model
const UserMfaModelPromise = initializeUserMfaModel();
export default UserMfaModelPromise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlck1mYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL21vZGVscy9Vc2VyTWZhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ04sU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLFdBQVcsQ0FBQztBQUNuQixPQUFPLGtCQUFrQixNQUFNLGNBQWMsQ0FBQztBQUM5QyxPQUFPLGdCQUFnQixNQUFNLFFBQVEsQ0FBQztBQXlCdEMsOEJBQThCO0FBQzlCLE1BQU0sT0FDTCxTQUFRLEtBQWlFO0lBRDFFOztRQUlDOzs7OztXQUFZO1FBQ1o7Ozs7O1dBQWdCO1FBQ2hCOzs7OztXQUF1QjtRQUN2Qjs7Ozs7V0FBOEI7UUFDOUI7Ozs7O1dBQTRCO1FBQzVCOzs7OztXQUE0QjtRQUM1Qjs7Ozs7V0FBZ0M7UUFDaEM7Ozs7O1dBQTBCO1FBQzFCOzs7OztXQUEyQjtRQUMzQjs7Ozs7V0FBMkI7UUFDM0I7Ozs7O1dBQWtDO1FBQ2xDOzs7OztXQUFtQztRQUNuQzs7Ozs7V0FBa0M7UUFDbEM7Ozs7O1dBQStCO1FBQy9COzs7OztXQUE2QjtRQUM3Qjs7Ozs7V0FBdUM7UUFDdkM7Ozs7O1dBQW9DO1FBQ3BDOzs7OztXQUFpQztRQUNqQzs7Ozs7V0FBK0I7UUFDL0I7Ozs7O1dBQXlDO0lBQzFDLENBQUM7Q0FBQTtBQUVELCtCQUErQjtBQUMvQixTQUFlLHNCQUFzQjs7UUFDcEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxrQkFBa0IsRUFBRSxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxJQUFJLENBQ1g7WUFDQyxFQUFFLEVBQUU7Z0JBQ0gsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJO2dCQUNwQixZQUFZLEVBQUUsU0FBUyxDQUFDLE1BQU07Z0JBQzlCLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixTQUFTLEVBQUUsS0FBSztnQkFDaEIsTUFBTSxFQUFFLElBQUk7Z0JBQ1osVUFBVSxFQUFFO29CQUNYLEtBQUssRUFBRSxNQUFNLGdCQUFnQjtv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QVksRUFBRSxJQUFJO2dCQUNsQixTQUFTLEVBQUUsSUFBSTtnQkFDZixNQUFNLEVBQUUsSUFBSTthQUNaO1lBQ0QsZ0JBQWdCLEVBQUU7Z0JBQ2pCLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSTtnQkFDcEIsWUFBWSxFQUFFLElBQUk7Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJO2dCQUNmLE1BQU0sRUFBRSxJQUFJO2FBQ1o7WUFDRCxjQUFjLEVBQUU7Z0JBQ2YsSUFBSSxFQUFFLFNBQVMsQ0FBQyxPQUFPO2dCQUN2QixZQUFZLEVBQUUsSUFBSTtnQkFDbEIsU0FBUyxFQUFFLElBQUk7YUFDZjtZQUNELHdCQUF3QixFQUFFO2dCQUN6QixJQUFJLEVBQUUsU0FBUyxDQUFDLE1BQU07Z0JBQ3RCLFlBQVksRUFBRSxJQUFJO2dCQUNsQixTQUFTLEVBQUUsSUFBSTthQUNmO1NBQ0QsRUFDRDtZQUNDLFNBQVM7WUFDVCxTQUFTLEVBQUUsU0FBUztZQUNwQixVQUFVLEVBQUUsSUFBSTtTQUNoQixDQUNELENBQUM7UUFFRixNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQixPQUFPLE9BQU8sQ0FBQztJQUNoQixDQUFDO0NBQUE7QUFFRCwrQkFBK0I7QUFDL0IsTUFBTSxtQkFBbUIsR0FBRyxzQkFBc0IsRUFBRSxDQUFDO0FBQ3JELGVBQWUsbUJBQW1CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHREYXRhVHlwZXMsXG5cdEluZmVyQXR0cmlidXRlcyxcblx0SW5mZXJDcmVhdGlvbkF0dHJpYnV0ZXMsXG5cdE1vZGVsXG59IGZyb20gJ3NlcXVlbGl6ZSc7XG5pbXBvcnQgaW5pdGlhbGl6ZURhdGFiYXNlIGZyb20gJy4uL2NvbmZpZy9kYic7XG5pbXBvcnQgVXNlck1vZGVsUHJvbWlzZSBmcm9tICcuL1VzZXInO1xuXG5pbnRlcmZhY2UgVXNlck1mYUF0dHJpYnV0ZXMge1xuXHRpZDogc3RyaW5nO1xuXHR1c2VyaWQ6IHN0cmluZztcblx0aXNNZmFFbmFibGVkOiBib29sZWFuO1xuXHRiYWNrdXBDb2Rlczogc3RyaW5nW10gfCBudWxsO1xuXHRpc0VtYWlsMmZhRW5hYmxlZDogYm9vbGVhbjtcblx0aXNUb3RwbDJmYUVuYWJsZWQ6IGJvb2xlYW47XG5cdGlzWXViaWNvT3RwMmZhRW5hYmxlZDogYm9vbGVhbjtcblx0aXNVMmYyZmFFbmFibGVkOiBib29sZWFuO1xuXHRpc1Bhc3NrZXlFbmFibGVkOiBib29sZWFuO1xuXHR0b3RwU2VjcmV0OiBzdHJpbmcgfCBudWxsO1xuXHR5dWJpY29PdHBQdWJsaWNJZDogc3RyaW5nIHwgbnVsbDtcblx0eXViaWNvT3RwU2VjcmV0S2V5OiBzdHJpbmcgfCBudWxsO1xuXHRmaWRvMkNyZWRlbnRpYWxJZDogc3RyaW5nIHwgbnVsbDtcblx0ZmlkbzJQdWJsaWNLZXk6IHN0cmluZyB8IG51bGw7XG5cdGZpZG8yQ291bnRlcjogbnVtYmVyIHwgbnVsbDtcblx0ZmlkbzJBdHRlc3RhdGlvbkZvcm1hdDogc3RyaW5nIHwgbnVsbDtcblx0cGFzc2tleUNyZWRlbnRpYWxJZDogc3RyaW5nIHwgbnVsbDtcblx0cGFzc2tleVB1YmxpY0tleTogc3RyaW5nIHwgbnVsbDtcblx0cGFzc2tleUNvdW50ZXI6IG51bWJlciB8IG51bGw7XG5cdHBhc3NrZXlBdHRlc3RhdGlvbkZvcm1hdDogc3RyaW5nIHwgbnVsbDtcbn1cblxuLy8gRmllbGRzIGluIHRoZSBVc2VyTWZhIE1vZGVsXG5jbGFzcyBVc2VyTWZhXG5cdGV4dGVuZHMgTW9kZWw8SW5mZXJBdHRyaWJ1dGVzPFVzZXJNZmE+LCBJbmZlckNyZWF0aW9uQXR0cmlidXRlczxVc2VyTWZhPj5cblx0aW1wbGVtZW50cyBVc2VyTWZhQXR0cmlidXRlc1xue1xuXHRpZCE6IHN0cmluZztcblx0dXNlcmlkITogc3RyaW5nO1xuXHRpc01mYUVuYWJsZWQhOiBib29sZWFuO1xuXHRiYWNrdXBDb2RlcyE6IHN0cmluZ1tdIHwgbnVsbDtcblx0aXNFbWFpbDJmYUVuYWJsZWQhOiBib29sZWFuO1xuXHRpc1RvdHBsMmZhRW5hYmxlZCE6IGJvb2xlYW47XG5cdGlzWXViaWNvT3RwMmZhRW5hYmxlZCE6IGJvb2xlYW47XG5cdGlzVTJmMmZhRW5hYmxlZCE6IGJvb2xlYW47XG5cdGlzUGFzc2tleUVuYWJsZWQhOiBib29sZWFuO1xuXHR0b3RwU2VjcmV0ITogc3RyaW5nIHwgbnVsbDtcblx0eXViaWNvT3RwUHVibGljSWQhOiBzdHJpbmcgfCBudWxsO1xuXHR5dWJpY29PdHBTZWNyZXRLZXkhOiBzdHJpbmcgfCBudWxsO1xuXHRmaWRvMkNyZWRlbnRpYWxJZCE6IHN0cmluZyB8IG51bGw7XG5cdGZpZG8yUHVibGljS2V5ITogc3RyaW5nIHwgbnVsbDtcblx0ZmlkbzJDb3VudGVyITogbnVtYmVyIHwgbnVsbDtcblx0ZmlkbzJBdHRlc3RhdGlvbkZvcm1hdCE6IHN0cmluZyB8IG51bGw7XG5cdHBhc3NrZXlDcmVkZW50aWFsSWQhOiBzdHJpbmcgfCBudWxsO1xuXHRwYXNza2V5UHVibGljS2V5ITogc3RyaW5nIHwgbnVsbDtcblx0cGFzc2tleUNvdW50ZXIhOiBudW1iZXIgfCBudWxsO1xuXHRwYXNza2V5QXR0ZXN0YXRpb25Gb3JtYXQhOiBzdHJpbmcgfCBudWxsO1xufVxuXG4vLyBJbml0aWFsaXplIHRoZSBVc2VyTWZhIG1vZGVsXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplVXNlck1mYU1vZGVsKCk6IFByb21pc2U8dHlwZW9mIFVzZXJNZmE+IHtcblx0Y29uc3Qgc2VxdWVsaXplID0gYXdhaXQgaW5pdGlhbGl6ZURhdGFiYXNlKCk7XG5cdFVzZXJNZmEuaW5pdChcblx0XHR7XG5cdFx0XHRpZDoge1xuXHRcdFx0XHR0eXBlOiBEYXRhVHlwZXMuVVVJRCxcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBEYXRhVHlwZXMuVVVJRFY0LFxuXHRcdFx0XHRwcmltYXJ5S2V5OiB0cnVlLFxuXHRcdFx0XHRhbGxvd051bGw6IGZhbHNlLFxuXHRcdFx0XHR1bmlxdWU6IHRydWUsXG5cdFx0XHRcdHJlZmVyZW5jZXM6IHtcblx0XHRcdFx0XHRtb2RlbDogYXdhaXQgVXNlck1vZGVsUHJvbWlzZSxcblx0XHRcdFx0XHRrZXk6ICdpZCdcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHVzZXJpZDoge1xuXHRcdFx0XHR0eXBlOiBEYXRhVHlwZXMuVVVJRCxcblx0XHRcdFx0YWxsb3dOdWxsOiBmYWxzZSxcblx0XHRcdFx0dW5pcXVlOiB0cnVlLFxuXHRcdFx0XHRyZWZlcmVuY2VzOiB7XG5cdFx0XHRcdFx0bW9kZWw6IGF3YWl0IFVzZXJNb2RlbFByb21pc2UsXG5cdFx0XHRcdFx0a2V5OiAndXNlcmlkJ1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aXNNZmFFbmFibGVkOiB7XG5cdFx0XHRcdHR5cGU6IERhdGFUeXBlcy5CT09MRUFOLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlLFxuXHRcdFx0XHRhbGxvd051bGw6IGZhbHNlLFxuXHRcdFx0XHRyZWZlcmVuY2VzOiB7XG5cdFx0XHRcdFx0bW9kZWw6IGF3YWl0IFVzZXJNb2RlbFByb21pc2UsXG5cdFx0XHRcdFx0a2V5OiAnaXNNZmFFbmFibGVkJ1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0YmFja3VwQ29kZXM6IHtcblx0XHRcdFx0dHlwZTogRGF0YVR5cGVzLkFSUkFZKERhdGFUeXBlcy5TVFJJTkcpLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IG51bGwsXG5cdFx0XHRcdGFsbG93TnVsbDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdGlzRW1haWwyZmFFbmFibGVkOiB7XG5cdFx0XHRcdHR5cGU6IERhdGFUeXBlcy5CT09MRUFOLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlLFxuXHRcdFx0XHRhbGxvd051bGw6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0aXNUb3RwbDJmYUVuYWJsZWQ6IHtcblx0XHRcdFx0dHlwZTogRGF0YVR5cGVzLkJPT0xFQU4sXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogZmFsc2UsXG5cdFx0XHRcdGFsbG93TnVsbDogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHRpc1l1Ymljb090cDJmYUVuYWJsZWQ6IHtcblx0XHRcdFx0dHlwZTogRGF0YVR5cGVzLkJPT0xFQU4sXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogZmFsc2UsXG5cdFx0XHRcdGFsbG93TnVsbDogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHRpc1UyZjJmYUVuYWJsZWQ6IHtcblx0XHRcdFx0dHlwZTogRGF0YVR5cGVzLkJPT0xFQU4sXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogZmFsc2UsXG5cdFx0XHRcdGFsbG93TnVsbDogZmFsc2Vcblx0XHRcdH0sXG5cdFx0XHRpc1Bhc3NrZXlFbmFibGVkOiB7XG5cdFx0XHRcdHR5cGU6IERhdGFUeXBlcy5CT09MRUFOLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IGZhbHNlLFxuXHRcdFx0XHRhbGxvd051bGw6IGZhbHNlXG5cdFx0XHR9LFxuXHRcdFx0dG90cFNlY3JldDoge1xuXHRcdFx0XHR0eXBlOiBEYXRhVHlwZXMuU1RSSU5HLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IG51bGwsXG5cdFx0XHRcdGFsbG93TnVsbDogdHJ1ZSxcblx0XHRcdFx0dW5pcXVlOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0eXViaWNvT3RwUHVibGljSWQ6IHtcblx0XHRcdFx0dHlwZTogRGF0YVR5cGVzLlNUUklORyxcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBudWxsLFxuXHRcdFx0XHRhbGxvd051bGw6IHRydWUsXG5cdFx0XHRcdHVuaXF1ZTogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdHl1Ymljb090cFNlY3JldEtleToge1xuXHRcdFx0XHR0eXBlOiBEYXRhVHlwZXMuU1RSSU5HLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IG51bGwsXG5cdFx0XHRcdGFsbG93TnVsbDogdHJ1ZSxcblx0XHRcdFx0dW5pcXVlOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0ZmlkbzJDcmVkZW50aWFsSWQ6IHtcblx0XHRcdFx0dHlwZTogRGF0YVR5cGVzLlNUUklORyxcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBudWxsLFxuXHRcdFx0XHRhbGxvd051bGw6IHRydWUsXG5cdFx0XHRcdHVuaXF1ZTogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdGZpZG8yUHVibGljS2V5OiB7XG5cdFx0XHRcdHR5cGU6IERhdGFUeXBlcy5URVhULFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IG51bGwsXG5cdFx0XHRcdGFsbG93TnVsbDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdGZpZG8yQ291bnRlcjoge1xuXHRcdFx0XHR0eXBlOiBEYXRhVHlwZXMuSU5URUdFUixcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBudWxsLFxuXHRcdFx0XHRhbGxvd051bGw6IHRydWVcblx0XHRcdH0sXG5cdFx0XHRmaWRvMkF0dGVzdGF0aW9uRm9ybWF0OiB7XG5cdFx0XHRcdHR5cGU6IERhdGFUeXBlcy5TVFJJTkcsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogbnVsbCxcblx0XHRcdFx0YWxsb3dOdWxsOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0cGFzc2tleUNyZWRlbnRpYWxJZDoge1xuXHRcdFx0XHR0eXBlOiBEYXRhVHlwZXMuU1RSSU5HLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IG51bGwsXG5cdFx0XHRcdGFsbG93TnVsbDogdHJ1ZSxcblx0XHRcdFx0dW5pcXVlOiB0cnVlXG5cdFx0XHR9LFxuXHRcdFx0cGFzc2tleVB1YmxpY0tleToge1xuXHRcdFx0XHR0eXBlOiBEYXRhVHlwZXMuVEVYVCxcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiBudWxsLFxuXHRcdFx0XHRhbGxvd051bGw6IHRydWUsXG5cdFx0XHRcdHVuaXF1ZTogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdHBhc3NrZXlDb3VudGVyOiB7XG5cdFx0XHRcdHR5cGU6IERhdGFUeXBlcy5JTlRFR0VSLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IG51bGwsXG5cdFx0XHRcdGFsbG93TnVsbDogdHJ1ZVxuXHRcdFx0fSxcblx0XHRcdHBhc3NrZXlBdHRlc3RhdGlvbkZvcm1hdDoge1xuXHRcdFx0XHR0eXBlOiBEYXRhVHlwZXMuU1RSSU5HLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IG51bGwsXG5cdFx0XHRcdGFsbG93TnVsbDogdHJ1ZVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c2VxdWVsaXplLFxuXHRcdFx0bW9kZWxOYW1lOiAnVXNlck1mYScsXG5cdFx0XHR0aW1lc3RhbXBzOiB0cnVlXG5cdFx0fVxuXHQpO1xuXG5cdGF3YWl0IFVzZXJNZmEuc3luYygpO1xuXHRyZXR1cm4gVXNlck1mYTtcbn1cblxuLy8gRXhwb3J0IHRoZSBpbml0aWFsaXplZCBtb2RlbFxuY29uc3QgVXNlck1mYU1vZGVsUHJvbWlzZSA9IGluaXRpYWxpemVVc2VyTWZhTW9kZWwoKTtcbmV4cG9ydCBkZWZhdWx0IFVzZXJNZmFNb2RlbFByb21pc2U7XG4iXX0=
