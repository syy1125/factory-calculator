import { useMemo } from "react";
import Select from "react-select";
import { ResourceData } from "../factory/factory";
import { styled } from "styled-components";

interface Props {
  resources: { [resourceId: string]: ResourceData };
  resourceId: string | null;
  onChange: (resourceId: string | null) => void;
}

const OptionLabel = styled.div`
  font-size: 16px;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;

  & > span:not(:first-child) {
    margin-left: 4px;
  }
`;

export function ResourceSelect(props: Props) {
  const { resources, resourceId, onChange } = props;

  const options = useMemo(
    () =>
      Object.keys(resources)
        .sort()
        .map((resourceId) => ({
          value: resourceId,
          label: resources[resourceId].name,
          icon: resources[resourceId].icon,
        })),
    [resources]
  );

  return (
    <Select
      options={options}
      value={
        resourceId != null
          ? {
              value: resourceId,
              label: resources[resourceId].name,
              icon: resources[resourceId].icon,
            }
          : null
      }
      onChange={(option) =>
        option != null ? onChange(option.value) : onChange(null)
      }
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: "#282c34",
        }),
        placeholder: (baseStyles) => ({
          ...baseStyles,
          fontSize: 16,
          textAlign: "left",
        }),
        input: (baseStyles) => ({
          ...baseStyles,
          fontSize: 16,
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          backgroundColor: "#282c34",
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isFocused ? "grey" : "inherit",
        }),
      }}
      formatOptionLabel={({ label, icon }) => (
        <OptionLabel>
          {icon != null ? (
            <img
              src={process.env.PUBLIC_URL + icon}
              width={16}
              height={16}
              alt={label}
            />
          ) : null}
          <span>{label}</span>
        </OptionLabel>
      )}
    />
  );
}
