import * as cryptoConstants from 'constants';
import { execSync } from 'child_process';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { randomBytes } from 'crypto';
import express from 'express';
import fs, { promises as fsPromises } from 'fs';
import hpp from 'hpp';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import passport, { session } from 'passport';
import { inRange } from 'range_check';
import { validateDependencies } from '../utils/helpers';
import { blankRequest } from '../utils/constants';
import { secretsStore } from '../services/secrets';
import { createJwt } from '../auth/jwt';
import * as interfaces from './interfaces';
import { initCsrf } from '../middleware/csrf';
import {
	fidoAuthRequireResidentKeyAsBoolean,
	fidoCryptoParamsAsArray,
	emailSecureAsBoolean,
	tlsCiphers
} from '../utils/constants';
import { createLogger, format, transports, addColors } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import LogStashTransport from 'winston-logstash';
import { ErrorClasses, ErrorSeverity } from '../errors/errorClasses';
import { v4 as uuidv4 } from 'uuid';
import { Sequelize } from 'sequelize';
import { sanitizeRequestBody } from '../utils/validator';

// ****** PARAMETER OBJECTS ****** //

export const AddIpToBlacklistStaticParameters: Omit<
	interfaces.AddIpToBlacklistInterface,
	'ip'
> = {
	validateDependencies
};

export const CreateJwtParameters: interfaces.CreateJwtInterface = {
	jwt,
	execSync,
	validateDependencies
};

export const DeclareWebServerOptionsStaticParameters: interfaces.DeclareWebServerOptionsInterface =
	{
		blankRequest,
		constants: cryptoConstants,
		fs: fs.promises,
		tlsCiphers,
		validateDependencies
	};

export const envVariables: interfaces.EnvVariableTypes = {
	baseUrl: process.env.BASE_URL!,
	batchReEncryptSecretsInterval: parseInt(
		process.env.BATCH_RE_ENCRYPT_SECRETS_INTERVAL!,
		10
	),
	blacklistSyncInterval: parseInt(
		process.env.BLACKLIST_SYNC_INTERVAL!,
		3600000
	),
	clearExpiredSecretsInterval: parseInt(
		process.env.TZ_CLEAR_EXPIRED_SECRETS_INTERVAL!,
		10
	),
	cpuLimit: parseInt(process.env.CPU_LIMIT!, 10),
	cronLoggerSetting: parseInt(process.env.CRON_LOGGER_SETTING!),
	dbDialect: process.env.DB_DIALECT! as
		| 'mariadb'
		| 'mssql'
		| 'mysql'
		| 'postgres'
		| 'sqlite',
	dbHost: process.env.DB_HOST! || 'localhost',
	dbInitMaxRetries: parseInt(process.env.DB_INIT_MAX_RETRIES!, 10),
	dbInitRetryAfter: parseInt(process.env.DB_INIT_RETRY_AFTER!, 10),
	dbName: process.env.DB_NAME!,
	dbUser: process.env.DB_USER!,
	diskPath: process.env.DISK_PATH!,
	emailHost: process.env.EMAIL_HOST!,
	emailPort: parseInt(process.env.EMAIL_PORT!, 10),
	emailSecure: emailSecureAsBoolean!,
	emailUser: process.env.EMAIL_USER!,
	eventLoopLagThreshold: parseInt(process.env.EVENT_LOOP_LAG!, 10),
	featureApiRoutesCsrf: process.env.FEATURE_API_ROUTES_CSRF === 'true',
	featureDbSync: process.env.FEATURE_DB_SYNC === 'true',
	featureEnableIpBlacklist:
		process.env.FEATURE_ENABLE_IP_BLACKLIST === 'true',
	featureEnableJwtAuth: process.env.FEATURE_ENABLE_JWT_AUTH === 'true',
	featureEnableLogStash: process.env.FEATURE_ENABLE_LOGSTASH === 'true',
	featureEnableRateLimit: process.env.FEATURE_ENABLE_RATE_LIMIT === 'true',
	featureEnableSession: process.env.FEATURE_ENABLE_SESSION! === 'true',
	featureEncryptSecretsStore: process.env.FEATURE_ENCRYPTS_STORE! === 'true',
	featureHttpsRedirect: process.env.FEATURE_HTTPS_REDIRECT! === 'true',
	featureLoadTestRoutes: process.env.FEATURE_LOAD_TEST_ROUTES! === 'true',
	featureSequelizeLogging: process.env.FEATURE_SEQUELIZE_LOGGING! === 'true',
	featureHonorCipherOrder: process.env.FEATURE_HONOR_CIPHER_ORDER! === 'true',
	fidoAuthRequireResidentKey: fidoAuthRequireResidentKeyAsBoolean!,
	fidoAuthUserVerification: process.env
		.FIDO_AUTHENTICATOR_USER_VERIFICATION! as
		| 'required'
		| 'preferred'
		| 'discouraged'
		| 'enterprise',
	fidoChallengeSize: parseInt(process.env.FIDO_CHALLENGE_SIZE!, 10),
	fidoCryptoParams: fidoCryptoParamsAsArray!,
	frontendSecretsPath: process.env.FRONTEND_SECRETS_PATH!,
	ipWhitelistPath: process.env.IP_WHITELIST_PATH!,
	logExportPath: process.env.LOG_EXPORT_PATH!,
	logLevel: process.env.LOG_LEVEL! as 'debug' | 'info' | 'warn' | 'error',
	loggerServiceName: process.env.LOG_SERVICE_NAME!,
	logStashHost: process.env.LOGSTASH_HOST!,
	logStashNode: process.env.LOGSTASH_NODE!,
	logStashPort: parseInt(process.env.LOGSTASH_PORT!, 10),
	maxCacheSize: parseInt(process.env.MAX_CACHE_SIZE!, 10),
	memoryLimit: parseInt(process.env.MEMORY_LIMIT!, 10),
	memoryThreshold: parseInt(process.env.MEMORY_THRESHOLD!, 10),
	memoryMonitorInterval: parseInt(process.env.MEMORY_MONITOR_INTERVAL!, 10),
	multerFileSizeLimit: parseInt(process.env.MULTER_FILE_SIZE_LIMIT!, 10),
	multerStorageDir: process.env.MULTER_STORAGE_DIR!,
	multerUploadDir: process.env.UPLOAD_DIR!,
	nodeEnv: process.env.NODE_ENV! as 'development' | 'testing' | 'production',
	npmLogPath: process.env.SERVER_NPM_LOG_PATH!,
	primaryLogPath: process.env.SERVER_LOG_PATH!,
	rateLimiterBaseDuration: parseInt(
		process.env.RATE_LIMITER_BASE_DURATION!,
		10
	),
	rateLimiterBasePoints: parseInt(process.env.RATE_LIMITER_BASE_POINTS!, 10),
	rateLimiterGlobalReset: parseInt(
		process.env.RATE_LIMITER_GLOBAL_RESET!,
		10
	),
	redisUrl: process.env.REDIS_URL!,
	rpName: process.env.RP_NAME!,
	rpIcon: process.env.RP_ICON!,
	rpId: process.env.RP_ID!,
	secretsFilePath1: process.env.SECRETS_FILE_PATH_1!,
	secretsRateLimitMaxAttempts: parseInt(
		process.env.SECRETS_RATE_LIMIT_MAX_ATTEMPTS!,
		10
	),
	secretsRateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW!, 10),
	secretsReEncryptionCooldown: parseInt(
		process.env.SECRETS_RE_ENCRYPTION_COOLDOWN!,
		10
	),
	serverDataFilePath1: process.env.SERVER_DATA_FILE_PATH_1!,
	serverDataFilePath2: process.env.SERVER_DATA_FILE_PATH_2!,
	serverDataFilePath3: process.env.SERVER_DATA_FILE_PATH_3!,
	serverDataFilePath4: process.env.SERVER_DATA_FILE_PATH_4!,
	serverPort: parseInt(process.env.SERVER_PORT!, 10),
	slowdownThreshold: parseInt(process.env.SLOWDOWN_THRESHOLD!, 10),
	staticRootPath: process.env.STATIC_ROOT_PATH!,
	tempDir: process.env.TEMP_DIR!,
	tlsCertPath1: process.env.TLS_CERT_PATH_1!,
	tlsKeyPath1: process.env.TLS_KEY_PATH_1!,
	yubicoApiUrl: process.env.YUBICO_API_URL!
};

export const ExpressErrorHandlerStaticParameters = {
	fallbackLogger: console
};

export const FeatureFlagNames = {
	API_ROUTES_CSR: 'FEATURE_API_ROUTES_CSRF',
	DB_SYNC: 'FEATURE_DB_SYNC',
	ENABLE_CSRF: 'FEATURE_ENABLE_CSRF',
	ENABLE_IP_BLACKLIST: 'FEATURE_ENABLE_IP_BLACKLIST',
	ENABLE_JWT_AUTH: 'FEATURE_ENABLE_JWT_AUTH',
	ENABLE_LOG_STASH: 'FEATURE_ENABLE_LOG_STASH',
	ENABLE_RATE_LIMIT: 'FEATURE_ENABLE_RATE_LIMIT',
	ENABLE_TLS: 'FEATURE_ENABLE_TLS',
	ENCRYPT_SECRETS_STORE: 'FEATURE_ENCRYPT_SECRETS_STORE',
	HONOR_CIPHER_ORDER: 'FEATURE_HONOR_CIPHER_ORDER',
	HTTPS_REDIRECT: 'FEATURE_HTTPS_REDIRECT',
	LOAD_TEST_ROUTES: 'FEATURE_LOAD_TEST_ROUTES',
	SECURE_HEADERS: 'FEATURE_SECURE_HEADERS',
	SEQUELIZE_LOGGING: 'FEATURE_SEQUELIZE_LOGGING'
} as const;

export const GetFeatureFlagsStaticParameters = {
	blankRequest
};

export const HandleCriticalErrorStaticParameters = {
	fallbackLogger: console
};

export const HandleErrorStaticParameters = {
	fallbackLogger: console
};

export const InitializeDatabaseStaticParameters: interfaces.InitializeDatabaseInterface =
	{
		blankRequest
	};

export const InitIpBlacklistParameters: interfaces.InitIpBlacklistInterface = {
	fsModule: fs,
	inRange,
	validateDependencies
};

export const InitJwtAuthParameters: interfaces.InitJwtAuthInterface = {
	verifyJwt: createJwt().verifyJwt,
	validateDependencies
};

export const InitMiddlewareStaticParameters = {
	authenticateOptions: { session: false },
	cookieParser,
	cors,
	express,
	fsModule: fs,
	hpp,
	initCsrf,
	morgan,
	passport,
	session,
	randomBytes,
	RedisStore,
	verifyJwt: passport.authenticate('jwt', { session: false })
};

export const LoadIpBlacklistParameters: interfaces.LoadIpBlacklistInterface = {
	fsModule: fsPromises
};

export const SetUpDatabaseParameters: interfaces.SetUpDatabaseInterface = {
	blankRequest
};

//
///
//// ***** SERVICE FACTORY PARAMETER OBJECTS ***** ////
///
//

export const AppLoggerServiceParameters = {
	winston: {
		createLogger,
		format,
		transports,
		addColors
	},
	DailyRotateFile,
	LogStashTransport,
	secretsStore,
	ErrorClasses,
	ErrorSeverity,
	HandleErrorStaticParameters,
	uuidv4,
	sanitizeRequestBody,
	fs,
	Sequelize
};
