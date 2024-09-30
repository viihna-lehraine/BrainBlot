import {
	YubClientInterface,
	YubicoOTPServiceInterface,
	YubicoOTPOptionsInterface,
	YubResponseInterface
} from '../index/interfaces';
import { ServiceFactory } from '../index/factory';
import { serviceTTLConfig } from '../config/cache';

import '../../types/custom/yub.js';

export class YubicoOTPService implements YubicoOTPServiceInterface {
	private static instance: YubicoOTPService | null = null;
	private logger = ServiceFactory.getLoggerService();
	private errorLogger = ServiceFactory.getErrorLoggerService();
	private errorHandler = ServiceFactory.getErrorHandlerService();
	private configService = ServiceFactory.getConfigService();
	private secrets = ServiceFactory.getSecretsStore();
	private cacheService = ServiceFactory.getCacheService();
	private yubClient: YubClientInterface | undefined;
	private ttl = serviceTTLConfig.YubicoOtpService || serviceTTLConfig.default;

	private constructor(private yub: YubicoOTPServiceInterface) {}

	public static getInstance(
		yub: YubicoOTPServiceInterface
	): YubicoOTPService {
		if (!YubicoOTPService.instance) {
			YubicoOTPService.instance = new YubicoOTPService(yub);
		}
		return YubicoOTPService.instance;
	}

	public init(clientId: string, secretKey: string): YubClientInterface {
		return this.yub.init(clientId, secretKey) as YubClientInterface;
	}

	public async initializeYubicoOTP(): Promise<void> {
		const cacheKey = 'yubicoClient';
		const cachedClient = await this.cacheService.get(cacheKey, 'auth');

		if (
			cachedClient &&
			typeof cachedClient === 'object' &&
			'verify' in cachedClient
		) {
			this.logger.debug('Loaded Yubico Client from cache.');
			this.yubClient = cachedClient as YubClientInterface;
			return;
		}

		try {
			this.logger.info('Initializing Yubico OTP Utility.');

			const yubiSecrets = await this.secrets.retrieveSecrets(
				['YUBICO_CLIENT_ID', 'YUBICO_SECRET_KEY'],
				secrets => secrets
			);

			if (
				yubiSecrets &&
				typeof yubiSecrets === 'object' &&
				!Array.isArray(yubiSecrets)
			) {
				const yubicoClientId =
					yubiSecrets['YUBICO_CLIENT_ID']?.toString() || '';
				const yubicoSecretKey =
					yubiSecrets['YUBICO_SECRET_KEY']?.toString() || '';

				if (!yubicoClientId || !yubicoSecretKey) {
					throw new Error(
						'Yubico Client ID or Secret Key is missing'
					);
				}

				const initializedClient = this.yub.init(
					yubicoClientId,
					yubicoSecretKey
				);

				if (initializedClient && 'verify' in initializedClient) {
					this.yubClient = initializedClient as YubClientInterface;

					await this.cacheService.set(
						cacheKey,
						this.yubClient,
						'auth',
						this.ttl
					);

					this.logger.info(
						'Yubico OTP Utility successfully initialized.'
					);
				}
			} else {
				throw new Error('Failed to retrieve Yubico secrets');
			}
		} catch (utilError) {
			const utilityError =
				new this.errorHandler.ErrorClasses.UtilityErrorRecoverable(
					`Failed to initialize Yubico OTP Utility: ${
						utilError instanceof Error
							? utilError.message
							: utilError
					}`,
					{ exposeToClient: false }
				);
			this.errorLogger.logError(utilityError.message);
			this.errorHandler.handleError({ error: utilityError });
		}
	}

	public async validateYubicoOTP(otp: string): Promise<boolean> {
		const cacheKey = `yubicoOtp:${otp}`;
		const cachedResult = await this.cacheService.get(cacheKey, 'auth');
		if (cachedResult !== null) {
			this.logger.debug('Loaded OTP validation result from cache.');
			return cachedResult as boolean;
		}

		try {
			if (!this.yubClient) {
				await this.initializeYubicoOTP();
			}

			return new Promise((resolve, reject) => {
				this.yubClient!.verify(
					otp,
					(utilError: Error | null, data: YubResponseInterface) => {
						if (utilError) {
							const innerUtilError =
								new this.errorHandler.ErrorClasses.UtilityErrorRecoverable(
									`Failed to validate Yubico OTP: ${
										utilError instanceof Error
											? utilError.message
											: String(utilError)
									}`,
									{ exposeToClient: false }
								);
							this.errorLogger.logWarn(innerUtilError.message);
							this.errorHandler.handleError({
								error: innerUtilError
							});
							return reject(innerUtilError);
						}

						const isValid = data && data.status === 'OK';
						this.logger.debug(
							`Yubico OTP validation ${
								isValid ? 'successful' : 'failed'
							}.`
						);

						this.cacheService.set(
							cacheKey,
							isValid,
							'auth',
							this.ttl
						);

						resolve(isValid);
					}
				);
			});
		} catch (utilError) {
			const utilityError =
				new this.errorHandler.ErrorClasses.UtilityErrorRecoverable(
					`Failed to validate Yubico OTP: ${
						utilError instanceof Error
							? utilError.message
							: utilError
					}`,
					{ exposeToClient: false }
				);
			this.errorLogger.logWarn(utilityError.message);
			this.errorHandler.handleError({ error: utilityError });
			return false;
		}
	}

	public async generateYubicoOTPOptions(): Promise<YubicoOTPOptionsInterface> {
		try {
			this.logger.info('Generating Yubico OTP options.');

			const apiUrl = this.configService.getEnvVariable(
				'yubicoApiUrl'
			) as string;

			// Await the retrieval of secrets
			const yubiSecrets = await this.secrets.retrieveSecrets(
				['YUBICO_CLIENT_ID', 'YUBICO_SECRET_KEY'],
				secrets => secrets
			);

			if (
				yubiSecrets &&
				typeof yubiSecrets === 'object' &&
				!Array.isArray(yubiSecrets)
			) {
				const yubicoClientId =
					yubiSecrets['YUBICO_CLIENT_ID']?.toString() || '';
				const yubicoSecretKey =
					yubiSecrets['YUBICO_SECRET_KEY']?.toString() || '';

				if (!yubicoClientId || !yubicoSecretKey) {
					throw new Error(
						'Failed to retrieve or decrypt Yubico client ID or secret key'
					);
				}

				return {
					clientId: parseInt(yubicoClientId, 10),
					apiKey: yubicoSecretKey,
					apiUrl
				};
			} else {
				throw new Error('Failed to retrieve Yubico secrets');
			}
		} catch (utiLError) {
			const utilityError =
				new this.errorHandler.ErrorClasses.UtilityErrorRecoverable(
					`Failed to generate Yubico OTP options: ${
						utiLError instanceof Error
							? utiLError.message
							: utiLError
					}; Returning object with placeholder values.`,
					{ exposeToClient: false }
				);

			this.errorLogger.logWarn(utilityError.message);
			this.errorHandler.handleCriticalError({ error: utilityError });

			return {
				clientId: 0,
				apiKey: '',
				apiUrl: ''
			};
		}
	}
}
