import * as React from 'react';
import { Alert, FormGroup } from '@patternfly/react-core';
import { ExistingStorageObject } from '~/pages/projects/types';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { getDisplayNameFromK8sResource } from '~/concepts/k8s/utils';
import TypeaheadSelect from '~/components/TypeaheadSelect';
import useProjectPvcs from '~/pages/projects/screens/detail/storage/useProjectPvcs';

type AddExistingStorageFieldProps = {
  data: ExistingStorageObject;
  setData: (data: ExistingStorageObject) => void;
  selectDirection?: 'up' | 'down';
  menuAppendTo?: HTMLElement;
};

const AddExistingStorageField: React.FC<AddExistingStorageFieldProps> = ({
  data,
  setData,
  selectDirection,
  menuAppendTo,
}) => {
  const { currentProject } = React.useContext(ProjectDetailsContext);
  const [storages, loaded, loadError] = useProjectPvcs(currentProject.metadata.name);

  const selectDescription = (size: string, description?: string) => (
    <div>
      <div>Size: {size}</div>
      {description && <div>Description: {description}</div>}
    </div>
  );

  const selectOptions = React.useMemo(
    () =>
      loaded
        ? storages.map((pvc) => ({
            value: pvc.metadata.name,
            content: getDisplayNameFromK8sResource(pvc),
            description: selectDescription(
              pvc.spec.resources.requests.storage,
              pvc.metadata.annotations?.['openshift.io/description'],
            ),
          }))
        : [],
    [loaded, storages],
  );

  if (loadError) {
    return (
      <Alert title="Error loading pvcs" variant="danger">
        {loadError.message}
      </Alert>
    );
  }

  let placeholderText: string;

  if (!loaded) {
    placeholderText = 'Loading storages';
  } else if (storages.length === 0) {
    placeholderText = 'No existing storages available';
  } else {
    placeholderText = 'Select a persistent storage';
  }

  return (
    <FormGroup
      isRequired
      label="Persistent storage"
      fieldId="add-existing-storage-pv-selection"
      data-testid="persistent-storage-group"
    >
      <TypeaheadSelect
        selectOptions={selectOptions}
        selected={data.storage}
        onSelect={(_ev, storage) => setData({ ...data, storage: String(storage) || '' })}
        placeholder={placeholderText}
        noOptionsFoundMessage={(filter) => `No persistent storage was found for "${filter}"`}
        popperProps={{ direction: selectDirection, appendTo: menuAppendTo }}
        isDisabled={!loaded || storages.length === 0}
        data-testid="persistent-storage-typeahead"
      />
    </FormGroup>
  );
};

export default AddExistingStorageField;
