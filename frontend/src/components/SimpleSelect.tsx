import * as React from 'react';
import {
  Truncate,
  MenuToggle,
  // eslint-disable-next-line no-restricted-imports
  Select,
  SelectList,
  SelectOption,
  SelectGroup,
  Divider,
  MenuToggleProps,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Skeleton,
} from '@patternfly/react-core';
import TruncatedText from '~/components/TruncatedText';

import './SimpleSelect.scss';

export type SimpleSelectOption = {
  key: string;
  label: string;
  description?: React.ReactNode;
  dropdownLabel?: React.ReactNode;
  isPlaceholder?: boolean;
  isDisabled?: boolean;
  isFavorited?: boolean;
  dataTestId?: string;
};

export type SimpleGroupSelectOption = {
  key: string;
  label: string;
  options: SimpleSelectOption[];
};

type SimpleSelectProps = {
  options?: SimpleSelectOption[];
  isLoadingOptions?: boolean;
  groupedOptions?: SimpleGroupSelectOption[];
  value?: string;
  toggleLabel?: React.ReactNode;
  placeholder?: string;
  onChange: (key: string, isPlaceholder: boolean) => void;
  isFullWidth?: boolean;
  toggleProps?: MenuToggleProps;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  dataTestId?: string;
  previewDescription?: boolean;
  isSkeleton?: boolean;
} & Omit<
  React.ComponentProps<typeof Select>,
  'isOpen' | 'toggle' | 'dropdownItems' | 'onChange' | 'selected'
>;

const SimpleSelect: React.FC<SimpleSelectProps> = ({
  isDisabled,
  onChange,
  options,
  isLoadingOptions = false,
  groupedOptions,
  placeholder = 'Select...',
  value,
  toggleLabel,
  isFullWidth,
  icon,
  dataTestId,
  toggleProps,
  previewDescription = true,
  popperProps,
  isSkeleton,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);

  const groupedOptionsFlat = React.useMemo(
    () =>
      groupedOptions?.reduce<SimpleSelectOption[]>((acc, group) => [...acc, ...group.options], []),
    [groupedOptions],
  );

  const findOptionForKey = (key: string) =>
    options?.find((option) => option.key === key) || groupedOptionsFlat?.find((o) => o.key === key);

  const selectedOption = value ? findOptionForKey(value) : undefined;
  const selectedLabel = selectedOption?.label ?? placeholder;

  const totalOptions = React.useMemo(
    () => [...(options || []), ...(groupedOptionsFlat || [])],
    [options, groupedOptionsFlat],
  );

  // If there is only one option, call the onChange function
  React.useEffect(() => {
    const singleOptionKey = totalOptions.length === 1 ? totalOptions[0].key : null;
    if (singleOptionKey && !isLoadingOptions) {
      onChange(singleOptionKey, false);
    }
    // We don't want the callback function to be a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalOptions, isLoadingOptions]);

  if (isSkeleton) {
    return (
      <Skeleton
        style={{
          height:
            // Skeleton height = Select padding top + Select padding bottom + Select font line height
            // In App.scss we override the form font size from --pf-v5-global--FontSize--md to --pf-v5-global--FontSize--sm
            'calc(calc(var(--pf-v5-global--spacer--form-element) * 2) + calc(var(--pf-v5-global--LineHeight--md) * var(--pf-v5-global--FontSize--sm)))',
        }}
      />
    );
  }

  return (
    <>
      <Select
        {...props}
        isOpen={open}
        selected={value || toggleLabel}
        onSelect={(e, selectValue) => {
          onChange(
            String(selectValue),
            !!selectValue && (findOptionForKey(String(selectValue))?.isPlaceholder ?? false),
          );
          setOpen(false);
        }}
        onOpenChange={setOpen}
        toggle={(toggleRef) => (
          <MenuToggle
            ref={toggleRef}
            data-testid={dataTestId}
            aria-label="Options menu"
            onClick={() => setOpen(!open)}
            icon={icon}
            isExpanded={open}
            isDisabled={totalOptions.length <= 1 || isDisabled}
            isFullWidth={isFullWidth}
            {...toggleProps}
          >
            {toggleLabel || <Truncate content={selectedLabel} className="truncate-no-min-width" />}
          </MenuToggle>
        )}
        shouldFocusToggleOnSelect
        popperProps={{ maxWidth: 'trigger', ...popperProps }}
      >
        {groupedOptions?.map((group, index) => (
          <>
            {index > 0 ? <Divider /> : null}
            <SelectGroup key={group.key} label={group.label}>
              <SelectList>
                {group.options.map(
                  ({
                    key,
                    label,
                    dropdownLabel,
                    description,
                    isFavorited,
                    isDisabled: optionDisabled,
                    dataTestId: optionDataTestId,
                  }) => (
                    <SelectOption
                      key={key}
                      value={key}
                      description={<TruncatedText maxLines={2} content={description} />}
                      isDisabled={optionDisabled}
                      isFavorited={isFavorited}
                      data-testid={optionDataTestId || key}
                    >
                      {dropdownLabel || label}
                    </SelectOption>
                  ),
                )}
              </SelectList>
            </SelectGroup>
          </>
        )) ?? null}
        {options?.length ? (
          <SelectList>
            {groupedOptions?.length ? <Divider /> : null}
            {options.map(
              ({
                key,
                label,
                dropdownLabel,
                description,
                isFavorited,
                isDisabled: optionDisabled,
                dataTestId: optionDataTestId,
              }) => (
                <SelectOption
                  key={key}
                  value={key}
                  description={<TruncatedText maxLines={2} content={description} />}
                  isFavorited={isFavorited}
                  isDisabled={optionDisabled}
                  data-testid={optionDataTestId || key}
                >
                  {dropdownLabel || label}
                </SelectOption>
              ),
            )}
          </SelectList>
        ) : null}
      </Select>
      {previewDescription && selectedOption?.description ? (
        <FormHelperText>
          <HelperText>
            <HelperTextItem>
              <TruncatedText maxLines={2} content={selectedOption.description} />
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      ) : null}
    </>
  );
};

export default SimpleSelect;
