/* eslint-disable camelcase */
import {
  createExperiment,
  createPipelineRun,
  createPipelineRunJob,
  deletePipeline,
  deletePipelineRun,
  deletePipelineRunJob,
  deletePipelineVersion,
  getExperiment,
  getPipeline,
  getPipelineRun,
  getPipelineRunJob,
  getPipelineVersion,
  listExperiments,
  listPipelineRunJobs,
  listPipelineRuns,
  listPipelineVersions,
  listPipelines,
  stopPipelineRun,
  updatePipelineRunJob,
  uploadPipeline,
  uploadPipelineVersion,
} from '~/api/pipelines/custom';
import { handlePipelineFailures } from '~/api/pipelines/errorUtils';
import { proxyCREATE, proxyDELETE, proxyENDPOINT, proxyFILE, proxyGET } from '~/api/proxyUtils';
import {
  CreatePipelineRunJobKFData,
  CreatePipelineRunKFData,
  RecurringRunMode,
} from '~/concepts/pipelines/kfTypes';
import { PipelineParams } from '~/concepts/pipelines/types';

const mockProxyPromise = Promise.resolve();

jest.mock('~/api/proxyUtils', () => ({
  proxyCREATE: jest.fn(() => mockProxyPromise),
  proxyGET: jest.fn(() => mockProxyPromise),
  proxyDELETE: jest.fn(() => mockProxyPromise),
  proxyENDPOINT: jest.fn(() => mockProxyPromise),
  proxyFILE: jest.fn(() => mockProxyPromise),
}));

const mockResultPromise = Promise.resolve();

jest.mock('~/api/pipelines/errorUtils', () => ({
  handlePipelineFailures: jest.fn(() => mockResultPromise),
}));

const handlePipelineFailuresMock = jest.mocked(handlePipelineFailures);
const proxyCREATEMock = jest.mocked(proxyCREATE);
const proxyGETMock = jest.mocked(proxyGET);
const proxyDELETEMock = jest.mocked(proxyDELETE);
const proxyENDPOINTMock = jest.mocked(proxyENDPOINT);
const proxyFILEMock = jest.mocked(proxyFILE);

const mockOptions = {};
const createParam = (data: Record<string, string> = {}): PipelineParams => ({
  pageSize: 2,
  pageToken: 'token',
  sortDirection: undefined,
  sortField: 'created_at',
  filter: {
    ...data,
    predicates: [],
  },
});

const createQuery = () => ({
  filter: '{"predicates":[]}',
  page_size: 2,
  page_token: 'token',
  sort_by: 'created_at asc',
});

describe('createExperiment', () => {
  it('should call proxyCREATE and handlePipelineFailures to create experiment', () => {
    expect(
      createExperiment('hostPath')(mockOptions, {
        display_name: 'name',
        description: 'description',
      }),
    ).toBe(mockResultPromise);
    expect(proxyCREATEMock).toHaveBeenCalledTimes(1);
    expect(proxyCREATEMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/experiments',
      { display_name: 'name', description: 'description' },
      {},
      mockOptions,
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('createPipelineRun', () => {
  const data: CreatePipelineRunKFData = {
    display_name: 'name',
    service_account: 'serviceAccount',
    experiment_id: '123',
    pipeline_version_reference: {
      pipeline_id: 'pipelineId',
      pipeline_version_id: 'pipelineVersionId',
    },
    runtime_config: {
      parameters: {},
    },
  };
  it('should call proxyCREATE and handlePipelineFailures to create pipeline run', () => {
    expect(createPipelineRun('hostPath')({}, data)).toBe(mockResultPromise);
    expect(proxyCREATEMock).toHaveBeenCalledTimes(1);
    expect(proxyCREATEMock).toHaveBeenCalledWith('hostPath', '/apis/v2beta1/runs', data, {}, {});
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('createPipelineRunJob', () => {
  const data: CreatePipelineRunJobKFData = {
    display_name: 'name',
    max_concurrency: 'max_concurrency',
    trigger: {
      cron_schedule: undefined,
      periodic_schedule: undefined,
    },
    experiment_id: 'experimentId',
    pipeline_version_reference: {
      pipeline_id: 'pipelineId',
      pipeline_version_id: 'pipelineVersionId',
    },
    mode: RecurringRunMode.ENABLE,
  };
  it('should call proxyCREATE and handlePipelineFailures to create pipeline run job', () => {
    expect(createPipelineRunJob('hostPath')({}, data)).toBe(mockResultPromise);
    expect(proxyCREATEMock).toHaveBeenCalledTimes(1);
    expect(proxyCREATEMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/recurringruns',
      data,
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getExperiment', () => {
  it('should call proxyGET and handlePipelineFailures to fetch experiment', () => {
    expect(getExperiment('hostPath')({}, 'experimentId')).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/experiments/experimentId',
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getPipeline', () => {
  it('should call proxyGET and handlePipelineFailures to fetch pipeline', () => {
    expect(getPipeline('hostPath')({}, 'pipelineId')).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenLastCalledWith(
      'hostPath',
      '/apis/v2beta1/pipelines/pipelineId',
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getPipelineRun', () => {
  it('should call proxyGET and handlePipelineFailures to fetch pipeline run', () => {
    expect(getPipelineRun('hostPath')({}, 'pipelineRunId')).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/runs/pipelineRunId',
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getPipelineRunJob', () => {
  it('should call proxyGET and handlePipelineFailures to fetch pipeline run job', () => {
    expect(getPipelineRunJob('hostPath')({}, 'pipelineRunJobId')).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/recurringruns/pipelineRunJobId',
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('getPipelineVersion', () => {
  it('should call proxyGET and handlePipelineFailures to fetch pipeline version', () => {
    expect(getPipelineVersion('hostPath')({}, 'pipelineId', 'pipelineVersionId')).toBe(
      mockResultPromise,
    );
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/pipelines/pipelineId/versions/pipelineVersionId',
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('deletePipeline', () => {
  it('should call proxyDELETE and handlePipelineFailures to delete pipeline', () => {
    expect(deletePipeline('hostPath')({}, 'pipelineId')).toBe(mockResultPromise);
    expect(proxyDELETEMock).toHaveBeenCalledTimes(1);
    expect(proxyDELETEMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/pipelines/pipelineId',
      {},
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('deletePipelineRun', () => {
  it('should call proxyDELETE and handlePipelineFailures to delete pipeline run', () => {
    expect(deletePipelineRun('hostPath')({}, 'runId')).toBe(mockResultPromise);
    expect(proxyDELETEMock).toHaveBeenCalledTimes(1);
    expect(proxyDELETEMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/runs/runId',
      {},
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('deletePipelineRunJob', () => {
  it('should call proxyDELETE and handlePipelineFailures to delete pipeline run job', () => {
    expect(deletePipelineRunJob('hostPath')({}, 'jobId')).toBe(mockResultPromise);
    expect(proxyDELETEMock).toHaveBeenCalledTimes(1);
    expect(proxyDELETEMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/recurringruns/jobId',
      {},
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('deletePipelineVersion', () => {
  it('should call proxyDELETE and handlePipelineFailures to delete pipeline version', () => {
    expect(deletePipelineVersion('hostPath')({}, 'pipelineId', 'pipelineVersionId')).toBe(
      mockResultPromise,
    );
    expect(proxyDELETEMock).toHaveBeenCalledTimes(1);
    expect(proxyDELETEMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/pipelines/pipelineId/versions/pipelineVersionId',
      {},
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('listExperiments', () => {
  it('should call proxyGET and handlePipelineFailures to list experiments', () => {
    expect(listExperiments('hostPath')({}, createParam())).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/experiments',
      createQuery(),
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('listPipelines', () => {
  it('should call proxyGET and handlePipelineFailures to list pipelines', () => {
    expect(listPipelines('hostPath')({}, createParam())).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/pipelines',
      createQuery(),
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('listPipelineRuns', () => {
  it('should call proxyGET and handlePipelineFailures to list pipeline runs', () => {
    expect(listPipelineRuns('hostPath')({}, createParam())).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith('hostPath', '/apis/v2beta1/runs', createQuery(), {});
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('listPipelineRunJobs', () => {
  it('should call proxyGET and handlePipelineFailures to list pipeline run jobs', () => {
    expect(listPipelineRunJobs('hostPath')({}, createParam())).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/recurringruns',
      createQuery(),
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('listPipelineVersionsByPipeline', () => {
  it('should call proxyGET and handlePipelineFailures to list pipeline version by pipeline', () => {
    expect(listPipelineVersions('hostPath')({}, 'pipelineId', {})).toBe(mockResultPromise);
    expect(proxyGETMock).toHaveBeenCalledTimes(1);
    expect(proxyGETMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/pipelines/pipelineId/versions',
      {
        filter: undefined,
        page_size: undefined,
        page_token: undefined,
        pipeline_id: 'pipelineId',
        sort_by: 'created_at desc',
      },
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('stopPipelineRun', () => {
  it('should call proxyENDPOINT and handlePipelineFailures to stop pipeline run', () => {
    expect(stopPipelineRun('hostPath')({}, 'runId')).toBe(mockResultPromise);
    expect(proxyENDPOINTMock).toHaveBeenCalledTimes(1);
    expect(proxyENDPOINTMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/runs/runId:terminate',
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('updatePipelineRunJob', () => {
  it('should call proxyENDPOINT and handlePipelineFailures to update pipeline run job, when enabled is true', () => {
    expect(updatePipelineRunJob('hostPath')({}, 'jobId', true)).toBe(mockResultPromise);
    expect(proxyENDPOINTMock).toHaveBeenCalledTimes(1);
    expect(proxyENDPOINTMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/recurringruns/jobId:enable',
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
  it('should call proxyENDPOINT and handlePipelineFailures to update pipeline run job, when enabled is false', () => {
    expect(updatePipelineRunJob('hostPath')({}, 'jobId', false)).toBe(mockResultPromise);
    expect(proxyENDPOINTMock).toHaveBeenCalledTimes(1);
    expect(proxyENDPOINTMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/recurringruns/jobId:disable',
      {},
      {},
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('uploadPipeline', () => {
  it('should call proxyFILE and handlePipelineFailures to upload pipeline', () => {
    expect(uploadPipeline('hostPath')({}, 'name', 'description', 'fileContents')).toBe(
      mockResultPromise,
    );
    expect(proxyFILEMock).toHaveBeenCalledTimes(1);
    expect(proxyFILEMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/pipelines/upload',
      'fileContents',
      { description: 'description', name: 'name' },
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});

describe('uploadPipelineVersion', () => {
  it('should call proxyFILE and handlePipelineFailures to upload pipeline version', () => {
    expect(
      uploadPipelineVersion('hostPath')({}, 'name', 'description', 'fileContents', 'pipelineId'),
    ).toBe(mockResultPromise);
    expect(proxyFILEMock).toHaveBeenCalledTimes(1);
    expect(proxyFILEMock).toHaveBeenCalledWith(
      'hostPath',
      '/apis/v2beta1/pipelines/upload_version',
      'fileContents',
      { description: 'description', name: 'name', pipelineid: 'pipelineId' },
    );
    expect(handlePipelineFailuresMock).toHaveBeenCalledTimes(1);
    expect(handlePipelineFailuresMock).toHaveBeenCalledWith(mockProxyPromise);
  });
});
