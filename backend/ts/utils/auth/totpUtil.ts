import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

interface TOTPSecret {
	ascii: string;
	hex: string;
	base32: string;
	otpauth_url: string;
}

function generateTOTPSecret(): TOTPSecret {
	const totpSecret = speakeasy.generateSecret({ length: 20 });
	return {
		ascii: totpSecret.ascii || '',
		hex: totpSecret.hex || '',
		base32: totpSecret.base32 || '',
		otpauth_url: totpSecret.otpauth_url || ''
	};
}

function generateTOTPToken(secret: string): string {
	const totpToken = speakeasy.totp({
		secret: secret,
		encoding: 'base32'
	});
	return totpToken;
}

function verifyTOTPToken(secret: string, token: string): boolean {
	const isTOTPTokenValid = speakeasy.totp.verify({
		secret: secret,
		encoding: 'base32',
		token: token,
		window: 1 // gives leeway for clock drift
	});
	return isTOTPTokenValid;
}

async function generateQRCode(otpauth_url: string): Promise<string> {
	return await QRCode.toDataURL(otpauth_url);
}

export {
	generateTOTPSecret,
	generateTOTPToken,
	verifyTOTPToken,
	generateQRCode
};
