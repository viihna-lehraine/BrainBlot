import { appLogger } from '../services/logger';
import {
	DependencyInterface,
	ValidateDependenciesInterface
} from '../index/interfaces';
import { validateDependencies } from '../utils/helpers';

export class DependencyValidationService
	implements ValidateDependenciesInterface
{
	validateDependencies(
		dependencies: DependencyInterface[],
		appLogger: AppLogger
	): void {
		validateDependencies(dependencies, appLogger);
	}
}

export const validationService = new DependencyValidationService();
