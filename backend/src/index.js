import initializeDatabase from './config/db.js';
import featureFlags from './config/featureFlags.js';
import loadEnv, {
	__dirname,
	 __filename
} from './config/loadEnv.js';
import startServer from './config/http.js';
import {
	createTransporter,
	getTransporter } from './config/mailer.js';
import configurePassport from './config/passport.js';
import setupSecurityHeaders from './config/securityHeaders.js';
import sops from './config/sops.js';
import {
	addToBlacklist,
	initializeIpBlacklist,
	ipBlacklistMiddleware,
	loadBlacklist,
	removeFromBlacklist,
} from './middleware/ipBlacklist.js';
import limiter from './middleware/rateLimit.js';
import {
	registrationValidationRules,
	validateEntry,
} from './middleware/validate.js';
import {
	generateBackupCodes,
	getBackupCodesFromDatabase,
	saveBackupCodesToDatabase,
	verifyBackupCode,
} from './utils/auth/backupCodeUtil.js';
import {
	generateEmail2FACode,
	verifyEmail2FACode,
} from './utils/auth/email2FAUtil.js';
import {
	generatePasskeyAuthenticationOptions,
	generatePasskeyRegistrationOptions,
	verifyPasskeyAuthentication,
	verifyPasskeyRegistration,
} from './utils/auth/passkeyUtil.js';
import {
	generateYubicoOtpOptions,
	validateYubicoOTP,
} from './utils/auth/yubicoOtpUtil.js';
import {
	generateTOTPSecret,
	generateTOTPToken,
	verifyTOTPToken,
	generateQRCode,
} from './utils/auth/totpUtil.js';
import generate2FactorEmailTemplate from './utils/templates/email/2FactorEmailTemplate.js';
import generate2FAEnabledEmailTemplate from './utils/templates/email/2FAEnabledEmailTemplate.js';
import generateAccountDeletedConfirmationEmailTemplate from './utils/templates/email/accountDeletedConfirmationEmailTemplate.js';
import generateAccountDeletionStartedEmailTemplate from './utils/templates/email/accountDeletionStartedEmailTemplate.js';
import generateConfirmationEmailTemplate from './utils/templates/email/confirmationEmailTemplate.js';
import loadTestRoutes from './utils/test/loadTestRoutes.js';
import { parseBoolean } from './utils/parseBoolean.js';

export {
	addToBlacklist,
	configurePassport,
	createTransporter,
	decryptDataFiles,
	featureFlags,
	generate2FactorEmailTemplate,
	generate2FAEnabledEmailTemplate,
	generateAccountDeletedConfirmationEmailTemplate,
	generateAccountDeletionStartedEmailTemplate,
	generateBackupCodes,
	generateConfirmationEmailTemplate,
	generateEmail2FACode,
	generatePasskeyAuthenticationOptions,
	generatePasskeyRegistrationOptions,
	generateQRCode,
	generateTOTPSecret,
	generateTOTPToken,
	generateYubicoOtpOptions,
	getBackupCodesFromDatabase,
	getSSLKeys,
	getTransporter,
	ipBlacklistMiddleware,
	initializeDatabase,
	initializeIpBlacklist,
	loadBlacklist,
	loadEnv,
	loadTestRoutes,
	limiter,
	parseBoolean,
	registrationValidationRules,
	removeFromBlacklist,
	saveBackupCodesToDatabase,
	setupSecurityHeaders,
	startServer,
	validateEntry,
	validateYubicoOTP,
	verifyBackupCode,
	verifyEmail2FACode,
	verifyPasskeyAuthentication,
	verifyPasskeyRegistration,
	verifyTOTPToken,
	__dirname,
	__filename,
};

export async function loadU2fUtils() {
	const {
		generateU2fAuthenticationOptions,
		generateU2fRegistrationOptions,
		verifyU2fAuthentication,
		verifyU2fRegistration,
	} = await import('./utils/auth/fido2Util.js');

	return {
		generateU2fAuthenticationOptions,
		generateU2fRegistrationOptions,
		verifyU2fAuthentication,
		verifyU2fRegistration,
	};
}

const { decryptDataFiles, getSSLKeys } = sops;
