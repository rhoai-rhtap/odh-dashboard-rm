import * as React from 'react';
import { Alert, FormGroup, Text } from '@patternfly/react-core';
import { UpdateObjectAtPropAndValue } from '~/pages/projects/types';
import { CreatingInferenceServiceObject } from '~/pages/modelServing/screens/types';
import { ServingRuntimeKind } from '~/k8sTypes';
import useServingRuntimes from '~/pages/modelServing/useServingRuntimes';
import { getDisplayNameFromK8sResource } from '~/concepts/k8s/utils';
import SimpleSelect from '~/components/SimpleSelect';

type InferenceServiceServingRuntimeSectionProps = {
  data: CreatingInferenceServiceObject;
  setData: UpdateObjectAtPropAndValue<CreatingInferenceServiceObject>;
  currentServingRuntime?: ServingRuntimeKind;
};

const InferenceServiceServingRuntimeSection: React.FC<
  InferenceServiceServingRuntimeSectionProps
> = ({ data, setData, currentServingRuntime }) => {
  const [servingRuntimes, loaded, loadError] = useServingRuntimes(
    data.project,
    data.project === '' || !!currentServingRuntime,
  );

  const selectedServingRuntime = servingRuntimes.find(
    (servingRuntime) => servingRuntime.metadata.name === data.servingRuntimeName,
  );

  const placeholderText =
    servingRuntimes.length === 0 ? 'No model servers available to select' : 'Select a model server';

  if (loadError) {
    return (
      <Alert title="Error loading model servers" variant="danger">
        {loadError.message}
      </Alert>
    );
  }

  if (currentServingRuntime) {
    return (
      <FormGroup label="Model server">
        <Text>{getDisplayNameFromK8sResource(currentServingRuntime)}</Text>
      </FormGroup>
    );
  }

  return (
    <FormGroup label="Model server" fieldId="inference-service-model-selection" isRequired>
      <SimpleSelect
        dataTestId="inference-service-model-selection"
        options={servingRuntimes.map((servingRuntime) => ({
          key: servingRuntime.metadata.name,
          label: getDisplayNameFromK8sResource(servingRuntime),
        }))}
        isSkeleton={!loaded && data.project !== ''}
        toggleProps={{ id: 'inference-service-model-selection' }}
        isFullWidth
        value={data.servingRuntimeName}
        toggleLabel={
          (selectedServingRuntime && getDisplayNameFromK8sResource(selectedServingRuntime)) ||
          placeholderText
        }
        onChange={(option) => {
          if (option !== data.servingRuntimeName) {
            setData('servingRuntimeName', option);
            setData('format', {
              name: '',
            });
          }
        }}
      />
    </FormGroup>
  );
};

export default InferenceServiceServingRuntimeSection;
