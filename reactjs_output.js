/*jshint esversion: 6 */
/*global fetch, btoa */
import Q from 'q';
/**
 * These APIs provide services for manipulating Harbor project.
 * @class Test
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
let Test = (function() {
    'use strict';

    function Test(options) {
        let domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : 'http://localhost/api';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
    }

    function serializeQueryParams(parameters) {
        let str = [];
        for (let p in parameters) {
            if (parameters.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(parameters[p]));
            }
        }
        return str.join('&');
    }

    function mergeQueryParams(parameters, queryParameters) {
        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    let parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }
        return queryParameters;
    }

    /**
     * HTTP Request
     * @method
     * @name Test#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    Test.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred) {
        const queryParams = queryParameters && Object.keys(queryParameters).length ? serializeQueryParams(queryParameters) : null;
        const urlWithParams = url + (queryParams ? '?' + queryParams : '');

        if (body && !Object.keys(body).length) {
            body = undefined;
        }

        fetch(urlWithParams, {
            method,
            headers,
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json();
        }).then((body) => {
            deferred.resolve(body);
        }).catch((error) => {
            deferred.reject(error);
        });
    };

    /**
     * The Search endpoint returns information about the projects and repositories
    offered at public status or related to the current logged in user. The
    response includes the project and repository list in a proper
    display order.

     * @method
     * @name Test#getSearch
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.q - Search parameter for project and repository name.
     */
    Test.prototype.getSearch = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/search';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['q'] !== undefined) {
            queryParameters['q'] = parameters['q'];
        }

        if (parameters['q'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: q'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint returns all projects created by Harbor, and can be filtered by project name.

     * @method
     * @name Test#getProjects
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.name - The name of project.
         * @param {boolean} parameters.public - The project is public or private.
         * @param {string} parameters.owner - The name of project owner.
         * @param {integer} parameters.page - The page nubmer, default is 1.
         * @param {integer} parameters.pageSize - The size of per page, default is 10, maximum is 100.
     */
    Test.prototype.getProjects = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        if (parameters['public'] !== undefined) {
            queryParameters['public'] = parameters['public'];
        }

        if (parameters['owner'] !== undefined) {
            queryParameters['owner'] = parameters['owner'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        if (parameters['pageSize'] !== undefined) {
            queryParameters['page_size'] = parameters['pageSize'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is used to check if the project name user provided already exist.

     * @method
     * @name Test#headProjects
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.projectName - Project name for checking exists.
     */
    Test.prototype.headProjects = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['projectName'] !== undefined) {
            queryParameters['project_name'] = parameters['projectName'];
        }

        if (parameters['projectName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectName'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('HEAD', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for user to create a new project.

     * @method
     * @name Test#postProjects
     * @param {object} parameters - method options and parameters
         * @param {} parameters.project - New created project.
     */
    Test.prototype.postProjects = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['project'] !== undefined) {
            body = parameters['project'];
        }

        if (parameters['project'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: project'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint returns specific project information by project ID.

     * @method
     * @name Test#getProjectsByProjectId
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Project ID for filtering results.
     */
    Test.prototype.getProjectsByProjectId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is aimed to update the properties of a project.

     * @method
     * @name Test#putProjectsByProjectId
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Selected project ID.
         * @param {} parameters.project - Updates of project.
     */
    Test.prototype.putProjectsByProjectId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        if (parameters['project'] !== undefined) {
            body = parameters['project'];
        }

        if (parameters['project'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: project'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is aimed to delete project by project ID.

     * @method
     * @name Test#deleteProjectsByProjectId
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Project ID of project which will be deleted.
     */
    Test.prototype.deleteProjectsByProjectId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user search access logs filtered by operations and date time ranges.

     * @method
     * @name Test#getProjectsByProjectIdLogs
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Relevant project ID
         * @param {string} parameters.username - Username of the operator.
         * @param {string} parameters.repository - The name of repository
         * @param {string} parameters.tag - The name of tag
         * @param {string} parameters.operation - The operation
         * @param {string} parameters.beginTimestamp - The begin timestamp
         * @param {string} parameters.endTimestamp - The end timestamp
         * @param {integer} parameters.page - The page nubmer, default is 1.
         * @param {integer} parameters.pageSize - The size of per page, default is 10, maximum is 100.
     */
    Test.prototype.getProjectsByProjectIdLogs = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}/logs';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        if (parameters['username'] !== undefined) {
            queryParameters['username'] = parameters['username'];
        }

        if (parameters['repository'] !== undefined) {
            queryParameters['repository'] = parameters['repository'];
        }

        if (parameters['tag'] !== undefined) {
            queryParameters['tag'] = parameters['tag'];
        }

        if (parameters['operation'] !== undefined) {
            queryParameters['operation'] = parameters['operation'];
        }

        if (parameters['beginTimestamp'] !== undefined) {
            queryParameters['begin_timestamp'] = parameters['beginTimestamp'];
        }

        if (parameters['endTimestamp'] !== undefined) {
            queryParameters['end_timestamp'] = parameters['endTimestamp'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        if (parameters['pageSize'] !== undefined) {
            queryParameters['page_size'] = parameters['pageSize'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint returns metadata of the project specified by project ID.

     * @method
     * @name Test#getProjectsByProjectIdMetadatas
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - The ID of project.
     */
    Test.prototype.getProjectsByProjectIdMetadatas = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}/metadatas';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is aimed to add metadata of a project.

     * @method
     * @name Test#postProjectsByProjectIdMetadatas
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Selected project ID.
         * @param {} parameters.metadata - The metadata of project.
     */
    Test.prototype.postProjectsByProjectIdMetadatas = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}/metadatas';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        if (parameters['metadata'] !== undefined) {
            body = parameters['metadata'];
        }

        if (parameters['metadata'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: metadata'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint returns specified metadata of a project.

     * @method
     * @name Test#getProjectsByProjectIdMetadatasByMetaName
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Project ID for filtering results.
         * @param {string} parameters.metaName - The name of metadat.
     */
    Test.prototype.getProjectsByProjectIdMetadatasByMetaName = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}/metadatas/{meta_name}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{meta_name}', parameters['metaName']);

        if (parameters['metaName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: metaName'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is aimed to update the metadata of a project.

     * @method
     * @name Test#putProjectsByProjectIdMetadatasByMetaName
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - The ID of project.
         * @param {string} parameters.metaName - The name of metadat.
     */
    Test.prototype.putProjectsByProjectIdMetadatasByMetaName = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}/metadatas/{meta_name}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{meta_name}', parameters['metaName']);

        if (parameters['metaName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: metaName'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is aimed to delete metadata of a project.

     * @method
     * @name Test#deleteProjectsByProjectIdMetadatasByMetaName
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - The ID of project.
         * @param {string} parameters.metaName - The name of metadat.
     */
    Test.prototype.deleteProjectsByProjectIdMetadatasByMetaName = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}/metadatas/{meta_name}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{meta_name}', parameters['metaName']);

        if (parameters['metaName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: metaName'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for user to search a specified project's relevant role members.

     * @method
     * @name Test#getProjectsByProjectIdMembers
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Relevant project ID.
     */
    Test.prototype.getProjectsByProjectIdMembers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}/members/';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for user to add project role member accompany with relevant project and user.

     * @method
     * @name Test#postProjectsByProjectIdMembers
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Relevant project ID.
         * @param {} parameters.roles - Role members for adding to relevant project. Only one role is supported in the role list.
     */
    Test.prototype.postProjectsByProjectIdMembers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}/members/';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        if (parameters['roles'] !== undefined) {
            body = parameters['roles'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for user to get role members accompany with relevant project and user.

     * @method
     * @name Test#getProjectsByProjectIdMembersByUserId
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Relevant project ID
         * @param {integer} parameters.userId - Relevant user ID
     */
    Test.prototype.getProjectsByProjectIdMembersByUserId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}/members/{user_id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{user_id}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for user to update current project role members accompany with relevant project and user.

     * @method
     * @name Test#putProjectsByProjectIdMembersByUserId
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Relevant project ID.
         * @param {integer} parameters.userId - Relevant user ID.
         * @param {} parameters.roles - Updates for roles and username.
     */
    Test.prototype.putProjectsByProjectIdMembersByUserId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}/members/{user_id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{user_id}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters['roles'] !== undefined) {
            body = parameters['roles'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is aimed to remove project role members already added to the relevant project and user.

     * @method
     * @name Test#deleteProjectsByProjectIdMembersByUserId
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Relevant project ID.
         * @param {integer} parameters.userId - Relevant user ID.
     */
    Test.prototype.deleteProjectsByProjectIdMembersByUserId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/projects/{project_id}/members/{user_id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{project_id}', parameters['projectId']);

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        path = path.replace('{user_id}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is aimed to statistic all of the projects number and repositories number relevant to the logined user, also the public projects number and repositories number. If the user is admin, he can also get total projects number and total repositories number.

     * @method
     * @name Test#getStatistics
     * @param {object} parameters - method options and parameters
     */
    Test.prototype.getStatistics = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/statistics';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for user to search registered users, support for filtering results with username.Notice, by now this operation is only for administrator.

     * @method
     * @name Test#getUsers
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.username - Username for filtering results.
         * @param {string} parameters.email - Email for filtering results.
         * @param {integer} parameters.page - The page nubmer, default is 1.
         * @param {integer} parameters.pageSize - The size of per page.
     */
    Test.prototype.getUsers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['username'] !== undefined) {
            queryParameters['username'] = parameters['username'];
        }

        if (parameters['email'] !== undefined) {
            queryParameters['email'] = parameters['email'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        if (parameters['pageSize'] !== undefined) {
            queryParameters['page_size'] = parameters['pageSize'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is to create a user if the user does not already exist.

     * @method
     * @name Test#postUsers
     * @param {object} parameters - method options and parameters
         * @param {} parameters.user - New created user.
     */
    Test.prototype.postUsers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['user'] !== undefined) {
            body = parameters['user'];
        }

        if (parameters['user'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: user'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is to get the current user infomation.

     * @method
     * @name Test#getUsersCurrent
     * @param {object} parameters - method options and parameters
     */
    Test.prototype.getUsersCurrent = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users/current';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Get user's profile with user id.

     * @method
     * @name Test#getUsersByUserId
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.userId - Registered user ID
     */
    Test.prototype.getUsersByUserId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users/{user_id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{user_id}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let a registered user change his profile.

     * @method
     * @name Test#putUsersByUserId
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.userId - Registered user ID
         * @param {} parameters.profile - Only email, realname and comment can be modified.
     */
    Test.prototype.putUsersByUserId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users/{user_id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{user_id}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters['profile'] !== undefined) {
            body = parameters['profile'];
        }

        if (parameters['profile'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: profile'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let administrator of Harbor mark a registered user as
    be removed.It actually won't be deleted from DB.

     * @method
     * @name Test#deleteUsersByUserId
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.userId - User ID for marking as to be removed.
     */
    Test.prototype.deleteUsersByUserId = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users/{user_id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{user_id}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for user to update password. Users with the admin role can change any user's password. Guest users can change only their own password.

     * @method
     * @name Test#putUsersByUserIdPassword
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.userId - Registered user ID.
         * @param {} parameters.password - Password to be updated.
     */
    Test.prototype.putUsersByUserIdPassword = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users/{user_id}/password';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{user_id}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters['password'] !== undefined) {
            body = parameters['password'];
        }

        if (parameters['password'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: password'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let a registered user change to be an administrator
    of Harbor.

     * @method
     * @name Test#putUsersByUserIdSysadmin
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.userId - Registered user ID
         * @param {} parameters.hasAdminRole - Toggle a user to admin or not.
     */
    Test.prototype.putUsersByUserIdSysadmin = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users/{user_id}/sysadmin';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{user_id}', parameters['userId']);

        if (parameters['userId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userId'));
            return deferred.promise;
        }

        if (parameters['hasAdminRole'] !== undefined) {
            body = parameters['hasAdminRole'];
        }

        if (parameters['hasAdminRole'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: hasAdminRole'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user search repositories accompanying with relevant project ID and repo name.

     * @method
     * @name Test#getRepositories
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - Relevant project ID.
         * @param {string} parameters.q - Repo name for filtering results.
         * @param {integer} parameters.page - The page nubmer, default is 1.
         * @param {integer} parameters.pageSize - The size of per page, default is 10, maximum is 100.
     */
    Test.prototype.getRepositories = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/repositories';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['projectId'] !== undefined) {
            queryParameters['project_id'] = parameters['projectId'];
        }

        if (parameters['projectId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: projectId'));
            return deferred.promise;
        }

        if (parameters['q'] !== undefined) {
            queryParameters['q'] = parameters['q'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        if (parameters['pageSize'] !== undefined) {
            queryParameters['page_size'] = parameters['pageSize'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user delete a repository with name.

     * @method
     * @name Test#deleteRepositoriesByRepoName
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.repoName - The name of repository which will be deleted.
     */
    Test.prototype.deleteRepositoriesByRepoName = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/repositories/{repo_name}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{repo_name}', parameters['repoName']);

        if (parameters['repoName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: repoName'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint aims to retrieve the tag of the repository. If deployed with Notary, the signature property of response represents whether the image is singed or not. If the property is null, the image is unsigned.

     * @method
     * @name Test#getRepositoriesByRepoNameTagsByTag
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.repoName - Relevant repository name.
         * @param {string} parameters.tag - Tag of the repository.
     */
    Test.prototype.getRepositoriesByRepoNameTagsByTag = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/repositories/{repo_name}/tags/{tag}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{repo_name}', parameters['repoName']);

        if (parameters['repoName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: repoName'));
            return deferred.promise;
        }

        path = path.replace('{tag}', parameters['tag']);

        if (parameters['tag'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tag'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user delete tags with repo name and tag.

     * @method
     * @name Test#deleteRepositoriesByRepoNameTagsByTag
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.repoName - The name of repository which will be deleted.
         * @param {string} parameters.tag - Tag of a repository.
     */
    Test.prototype.deleteRepositoriesByRepoNameTagsByTag = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/repositories/{repo_name}/tags/{tag}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{repo_name}', parameters['repoName']);

        if (parameters['repoName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: repoName'));
            return deferred.promise;
        }

        path = path.replace('{tag}', parameters['tag']);

        if (parameters['tag'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tag'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint aims to retrieve tags from a relevant repository. If deployed with Notary, the signature property of response represents whether the image is singed or not. If the property is null, the image is unsigned.

     * @method
     * @name Test#getRepositoriesByRepoNameTags
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.repoName - Relevant repository name.
     */
    Test.prototype.getRepositoriesByRepoNameTags = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/repositories/{repo_name}/tags';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{repo_name}', parameters['repoName']);

        if (parameters['repoName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: repoName'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint aims to retreive manifests from a relevant repository.

     * @method
     * @name Test#getRepositoriesByRepoNameTagsByTagManifest
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.repoName - Repository name
         * @param {string} parameters.tag - Tag name
         * @param {string} parameters.version - The version of manifest, valid value are "v1" and "v2", default is "v2"
     */
    Test.prototype.getRepositoriesByRepoNameTagsByTagManifest = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/repositories/{repo_name}/tags/{tag}/manifest';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{repo_name}', parameters['repoName']);

        if (parameters['repoName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: repoName'));
            return deferred.promise;
        }

        path = path.replace('{tag}', parameters['tag']);

        if (parameters['tag'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tag'));
            return deferred.promise;
        }

        if (parameters['version'] !== undefined) {
            queryParameters['version'] = parameters['version'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Trigger jobservice to call Clair API to scan the image identified by the repo_name and tag.  Only project admins have permission to scan images under the project.

     * @method
     * @name Test#postRepositoriesByRepoNameTagsByTagScan
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.repoName - Repository name
         * @param {string} parameters.tag - Tag name
     */
    Test.prototype.postRepositoriesByRepoNameTagsByTagScan = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/repositories/{repo_name}/tags/{tag}/scan';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{repo_name}', parameters['repoName']);

        if (parameters['repoName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: repoName'));
            return deferred.promise;
        }

        path = path.replace('{tag}', parameters['tag']);

        if (parameters['tag'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tag'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * The server will launch different jobs to scan each image on the regsitry, so this is equivalent to calling  the API to scan the image one by one in background, so there's no way to track the overall status of the "scan all" action.  Only system adim has permission to call this API.

     * @method
     * @name Test#postRepositoriesScanAll
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.projectId - When this parm is set only the images under the project identified by the project_id will be scanned.
     */
    Test.prototype.postRepositoriesScanAll = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/repositories/scanAll';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['projectId'] !== undefined) {
            queryParameters['project_id'] = parameters['projectId'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Call Clair API to get the vulnerability based on the previous successful scan.

     * @method
     * @name Test#getRepositoriesByRepoNameTagsByTagVulnerabilityDetails
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.repoName - Repository name
         * @param {string} parameters.tag - Tag name
     */
    Test.prototype.getRepositoriesByRepoNameTagsByTagVulnerabilityDetails = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/repositories/{repo_name}/tags/{tag}/vulnerability/details';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{repo_name}', parameters['repoName']);

        if (parameters['repoName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: repoName'));
            return deferred.promise;
        }

        path = path.replace('{tag}', parameters['tag']);

        if (parameters['tag'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tag'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint aims to retrieve signature information of a repository, the data is
    from the nested notary instance of Harbor.
    If the repository does not have any signature information in notary, this API will
    return an empty list with response code 200, instead of 404

     * @method
     * @name Test#getRepositoriesByRepoNameSignatures
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.repoName - repository name.
     */
    Test.prototype.getRepositoriesByRepoNameSignatures = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/repositories/{repo_name}/signatures';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{repo_name}', parameters['repoName']);

        if (parameters['repoName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: repoName'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint aims to let users see the most popular public repositories

     * @method
     * @name Test#getRepositoriesTop
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.count - The number of the requested public repositories, default is 10 if not provided.
     */
    Test.prototype.getRepositoriesTop = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/repositories/top';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['count'] !== undefined) {
            queryParameters['count'] = parameters['count'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user see the recent operation logs of the projects which he is member of

     * @method
     * @name Test#getLogs
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.username - Username of the operator.
         * @param {string} parameters.repository - The name of repository
         * @param {string} parameters.tag - The name of tag
         * @param {string} parameters.operation - The operation
         * @param {string} parameters.beginTimestamp - The begin timestamp
         * @param {string} parameters.endTimestamp - The end timestamp
         * @param {integer} parameters.page - The page nubmer, default is 1.
         * @param {integer} parameters.pageSize - The size of per page, default is 10, maximum is 100.
     */
    Test.prototype.getLogs = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/logs';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['username'] !== undefined) {
            queryParameters['username'] = parameters['username'];
        }

        if (parameters['repository'] !== undefined) {
            queryParameters['repository'] = parameters['repository'];
        }

        if (parameters['tag'] !== undefined) {
            queryParameters['tag'] = parameters['tag'];
        }

        if (parameters['operation'] !== undefined) {
            queryParameters['operation'] = parameters['operation'];
        }

        if (parameters['beginTimestamp'] !== undefined) {
            queryParameters['begin_timestamp'] = parameters['beginTimestamp'];
        }

        if (parameters['endTimestamp'] !== undefined) {
            queryParameters['end_timestamp'] = parameters['endTimestamp'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        if (parameters['pageSize'] !== undefined) {
            queryParameters['page_size'] = parameters['pageSize'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user list filters jobs according to the policy and repository. (if start_time and end_time are both null, list jobs of last 10 days)

     * @method
     * @name Test#getJobsReplication
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.policyId - The ID of the policy that triggered this job.
         * @param {integer} parameters.num - The return list length number.
         * @param {integer} parameters.endTime - The end time of jobs done. (Timestamp)
         * @param {integer} parameters.startTime - The start time of jobs. (Timestamp)
         * @param {string} parameters.repository - The respond jobs list filter by repository name.
         * @param {string} parameters.status - The respond jobs list filter by status.
         * @param {integer} parameters.page - The page nubmer, default is 1.
         * @param {integer} parameters.pageSize - The size of per page, default is 10, maximum is 100.
     */
    Test.prototype.getJobsReplication = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/jobs/replication';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['policyId'] !== undefined) {
            queryParameters['policy_id'] = parameters['policyId'];
        }

        if (parameters['policyId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: policyId'));
            return deferred.promise;
        }

        if (parameters['num'] !== undefined) {
            queryParameters['num'] = parameters['num'];
        }

        if (parameters['endTime'] !== undefined) {
            queryParameters['end_time'] = parameters['endTime'];
        }

        if (parameters['startTime'] !== undefined) {
            queryParameters['start_time'] = parameters['startTime'];
        }

        if (parameters['repository'] !== undefined) {
            queryParameters['repository'] = parameters['repository'];
        }

        if (parameters['status'] !== undefined) {
            queryParameters['status'] = parameters['status'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        if (parameters['pageSize'] !== undefined) {
            queryParameters['page_size'] = parameters['pageSize'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is aimed to remove specific ID job from jobservice.

     * @method
     * @name Test#deleteJobsReplicationById
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.id - Delete job ID.
     */
    Test.prototype.deleteJobsReplicationById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/jobs/replication/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user search job logs filtered by specific ID.

     * @method
     * @name Test#getJobsReplicationByIdLog
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.id - Relevant job ID
     */
    Test.prototype.getJobsReplicationByIdLog = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/jobs/replication/{id}/log';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user get scan job logs filtered by specific ID.

     * @method
     * @name Test#getJobsScanByIdLog
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.id - Relevant job ID
     */
    Test.prototype.getJobsScanByIdLog = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/jobs/scan/{id}/log';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user list filters policies by name and project_id, if name and project_id are nil, list returns all policies

     * @method
     * @name Test#getPoliciesReplication
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.name - The replication's policy name.
         * @param {integer} parameters.projectId - Relevant project ID.
     */
    Test.prototype.getPoliciesReplication = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/policies/replication';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        if (parameters['projectId'] !== undefined) {
            queryParameters['project_id'] = parameters['projectId'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user creates a policy, and if it is enabled, the replication will be triggered right now.

     * @method
     * @name Test#postPoliciesReplication
     * @param {object} parameters - method options and parameters
         * @param {} parameters.policyinfo - Create new policy.
     */
    Test.prototype.postPoliciesReplication = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/policies/replication';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['policyinfo'] !== undefined) {
            body = parameters['policyinfo'];
        }

        if (parameters['policyinfo'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: policyinfo'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user search replication policy by specific ID.

     * @method
     * @name Test#getPoliciesReplicationById
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.id - policy ID
     */
    Test.prototype.getPoliciesReplicationById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/policies/replication/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user update policy name, description, target and enablement.

     * @method
     * @name Test#putPoliciesReplicationById
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.id - policy ID
         * @param {} parameters.policyupdate - Update policy name, description, target and enablement.
     */
    Test.prototype.putPoliciesReplicationById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/policies/replication/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['policyupdate'] !== undefined) {
            body = parameters['policyupdate'];
        }

        if (parameters['policyupdate'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: policyupdate'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user update policy enablement flag.

     * @method
     * @name Test#putPoliciesReplicationByIdEnablement
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.id - policy ID
         * @param {} parameters.enabledflag - The policy enablement flag.
     */
    Test.prototype.putPoliciesReplicationByIdEnablement = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/policies/replication/{id}/enablement';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['enabledflag'] !== undefined) {
            body = parameters['enabledflag'];
        }

        if (parameters['enabledflag'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: enabledflag'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint let user list filters targets by name, if name is nil, list returns all targets.

     * @method
     * @name Test#getTargets
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.name - The replication's target name.
     */
    Test.prototype.getTargets = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/targets';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for user to create a new replication target.

     * @method
     * @name Test#postTargets
     * @param {object} parameters - method options and parameters
         * @param {} parameters.reptarget - New created replication target.
     */
    Test.prototype.postTargets = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/targets';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['reptarget'] !== undefined) {
            body = parameters['reptarget'];
        }

        if (parameters['reptarget'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: reptarget'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for ping validates whether the target is reachable and whether the credential is valid.

     * @method
     * @name Test#postTargetsPing
     * @param {object} parameters - method options and parameters
         * @param {} parameters.target - The target object.
     */
    Test.prototype.postTargetsPing = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/targets/ping';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['target'] !== undefined) {
            body = parameters['target'];
        }

        if (parameters['target'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: target'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for ping target.

     * @method
     * @name Test#postTargetsByIdPing
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.id - The replication's target ID.
     */
    Test.prototype.postTargetsByIdPing = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/targets/{id}/ping';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for update specific replication's target.

     * @method
     * @name Test#putTargetsById
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.id - The replication's target ID.
         * @param {} parameters.repoTarget - Updates of replication's target.
     */
    Test.prototype.putTargetsById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/targets/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['repoTarget'] !== undefined) {
            body = parameters['repoTarget'];
        }

        if (parameters['repoTarget'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: repoTarget'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for get specific replication's target.
     * @method
     * @name Test#getTargetsById
     * @param {object} parameters - method options and parameters
     * @param {integer} parameters.id - The replication's target ID.
     */
    Test.prototype.getTargetsById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/targets/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for to delete specific replication's target.

     * @method
     * @name Test#deleteTargetsById
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.id - The replication's target ID.
     */
    Test.prototype.deleteTargetsById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/targets/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint list policies filter with specific replication's target ID.

     * @method
     * @name Test#getTargetsByIdPolicies
     * @param {object} parameters - method options and parameters
         * @param {integer} parameters.id - The replication's target ID.
     */
    Test.prototype.getTargetsByIdPolicies = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/targets/{id}/policies/';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for syncing all repositories of registry with database.

     * @method
     * @name Test#postInternalSyncregistry
     * @param {object} parameters - method options and parameters
     */
    Test.prototype.postInternalSyncregistry = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/internal/syncregistry';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This API is for retrieving general system info, this can be called by anonymous request.

     * @method
     * @name Test#getSysteminfo
     * @param {object} parameters - method options and parameters
     */
    Test.prototype.getSysteminfo = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/systeminfo';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for retrieving system volume info that only provides for admin user.

     * @method
     * @name Test#getSysteminfoVolumes
     * @param {object} parameters - method options and parameters
     */
    Test.prototype.getSysteminfoVolumes = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/systeminfo/volumes';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for downloading a default root certificate that only provides for admin user under OVA deployment.

     * @method
     * @name Test#getSysteminfoGetcert
     * @param {object} parameters - method options and parameters
     */
    Test.prototype.getSysteminfoGetcert = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/systeminfo/getcert';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint ping the available ldap service for test related configuration parameters.

     * @method
     * @name Test#postLdapPing
     * @param {object} parameters - method options and parameters
         * @param {} parameters.ldapconf - ldap configuration. support input ldap service configuration. If it's a empty request, will load current configuration from the system.
     */
    Test.prototype.postLdapPing = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/ldap/ping';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['ldapconf'] !== undefined) {
            body = parameters['ldapconf'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint searches the available ldap users based on related configuration parameters. Support searched by input ladp configuration, load configuration from the system and specific filter.

     * @method
     * @name Test#postLdapUsersSearch
     * @param {object} parameters - method options and parameters
         * @param {string} parameters.username - Registered user ID
         * @param {} parameters.ldapConf - ldap search configuration. ldapconf field can input ldap service configuration. If this item are blank, will load default configuration will load current configuration from the system.
     */
    Test.prototype.postLdapUsersSearch = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/ldap/users/search';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['username'] !== undefined) {
            queryParameters['username'] = parameters['username'];
        }

        if (parameters['ldapConf'] !== undefined) {
            body = parameters['ldapConf'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint adds the selected available ldap users to harbor based on related configuration parameters from the system. System will try to guess the user email address and realname, add to harbor user information.
    If have errors when import user, will return the list of importing failed uid and the failed reason.

     * @method
     * @name Test#postLdapUsersImport
     * @param {object} parameters - method options and parameters
         * @param {} parameters.uidList - The uid listed for importing. This list will check users validity of ldap service based on configuration from the system.
     */
    Test.prototype.postLdapUsersImport = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/ldap/users/import';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['uidList'] !== undefined) {
            body = parameters['uidList'];
        }

        if (parameters['uidList'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: uidList'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for retrieving system configurations that only provides for admin user.

     * @method
     * @name Test#getConfigurations
     * @param {object} parameters - method options and parameters
     */
    Test.prototype.getConfigurations = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/configurations';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * This endpoint is for modifying system configurations that only provides for admin user.

     * @method
     * @name Test#putConfigurations
     * @param {object} parameters - method options and parameters
         * @param {} parameters.configurations - The configuration map can contain a subset of the attributes of the schema, which are to be updated.
     */
    Test.prototype.putConfigurations = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/configurations';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['configurations'] !== undefined) {
            body = parameters['configurations'];
        }

        if (parameters['configurations'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: configurations'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Reset system configurations from environment variables. Can only be accessed by admin user.

     * @method
     * @name Test#postConfigurationsReset
     * @param {object} parameters - method options and parameters
     */
    Test.prototype.postConfigurationsReset = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/configurations/reset';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Test connection and authentication with email server.

     * @method
     * @name Test#postEmailPing
     * @param {object} parameters - method options and parameters
         * @param {} parameters.settings - Email server settings, if some of the settings are not assigned, they will be read from system configuration.
     */
    Test.prototype.postEmailPing = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/email/ping';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json, text/plain'];
        headers['Content-Type'] = ['text/plain,application/json'];

        if (parameters['settings'] !== undefined) {
            body = parameters['settings'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };

    return Test;
})();

exports.Test = Test;