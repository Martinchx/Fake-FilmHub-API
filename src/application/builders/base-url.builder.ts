import { ResourceType } from '../../domain';
import { envs } from '../../config';

export class BaseUrlBuilder {
  static build(resourceType: ResourceType, additionalPath: string = ''): string {
    return `${envs.WEBSERVICE_URL}/${resourceType}${additionalPath}`;
  }
}