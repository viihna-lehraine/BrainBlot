import { ServiceFactory } from '../index/factory/ServiceFactory';
import { validateDependencies } from '../utils/helpers';

const logger = await ServiceFactory.getLoggerService();
const errorHandler = await ServiceFactory.getErrorHandlerService();
const errorLogger = await ServiceFactory.getErrorLoggerService();

export const generateConfirmationEmailTemplate = (
	username: string,
	confirmationUrl: string
): string => {
	validateDependencies(
		[
			{ name: 'username', instance: username },
			{ name: 'confirmationUrl', instance: confirmationUrl }
		],
		logger || console
	);

	try {
		return `
    	    <!DOCTYPE html>
    	    <html lang="en">
    	        <head>
    	            <meta charset="UTF-8">
    	            <title>Guestbook - Account Confirmation</title>
    	            <style>
    	                body {
    	                    margin: 0;
    	                    padding: 0;
    	                    background-color: #F4F4F4;
    	                    font-family: Arial, sans-serif;
    	                }
    	                .container {
    	                    width: 100%;
    	                    max-width: 600px;
    	                    padding: 20px;
    	                    border-radius: 5px;
    	                    margin: 20px auto;
    	                    background-color: #FFFFFF;
    	                }
    	                .header {
    	                    padding: 10px;
    	                    text-align: center;
    	                    border-radius: 5px 5px 0 0;
    	                    background-color: #007BFF;
    	                    color: #FFFFFF;
    	                }
    	                .content {
    	                    padding: 20px;
    	                }
    	                .content p {
    	                    font-size: 16px;
    	                }
    	                .button {
    	                    display: block;
    	                    width: 200px;
    	                    padding: 10px;
    	                    border-radius: 5px;
    	                    margin: 20px auto;
    	                    text-align: center;
    	                    background-color: #007BFF;
    	                    color: #FFFFFF;
    	                    text-decoration: none;
    	                }
    	                .footer {
    	                    text-align: center;
    	                    font-size: 12px;
    	                    padding: 10px;
    	                    color: #888888;
    	                }
    	            </style>
    	        </head>
    	        <body>
    	            <div class="container">
    	                <div class="header">
    	                    <h1>Guestbook - Account Confirmation</h1>
    	                </div>
    	                <div class="content">
    	                    <p>Hello, ${username},</p>
    	                    <p>Thank you for registering your account at guestbook.com! I'm so glad you've chosen to join our community.</p>
    	                    <p>Please click the button below or copy and paste the link into your browser to confirm your account, and your account will be fully registered.</p>
    	                    <a href="${confirmationUrl}" class="button">Confirm Email</a>
    	                    <p>${confirmationUrl}</p>
    	                </div>
    	                <div class="footer">
    	                    <p>If you did not register for an account at guestbook.com, please ignore this email.</p>
    	                    <p>If you experience any issues registering your account, please send an email to me at <a href="mailto:admin@viihnatech.com">admin@viihnatech.com</a> and I'll respond to you as soon as possible.</p>
    	                    <p>Have a great day! :)</p>
    	                </div>
    	            </div>
    	        </body>
    	    </html>
    	`;
	} catch (error) {
		const templateError =
			new errorHandler.ErrorClasses.DependencyErrorRecoverable(
				`Failed to generate confirmation email template: ${error instanceof Error ? error.message : String(error)}`,
				{
					dependency: 'generateConfirmationEmailTemplate()',
					originalError: error,
					exposeToClient: false
				}
			);
		errorLogger.logError(templateError.message);
		errorHandler.handleError({ error: templateError });
		throw templateError;
	}
};

export default generateConfirmationEmailTemplate;
