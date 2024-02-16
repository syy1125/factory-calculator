import { Dispatch, SetStateAction, useMemo } from "react";
import { FactoryData, ResourceData } from "../../factory/factory";
import { ResourceSelect } from "../../components/ResourceSelect";
import { styled } from "styled-components";
import { DeleteButton } from "../../components/DeleteButton";

interface Props {
  factoryData: FactoryData;
  relevantResourceIds: string[];
  resourceAmounts: Array<{ resourceId: string | null; amount: number }>;
  setResourceAmounts: Dispatch<SetStateAction<Props["resourceAmounts"]>>;
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 600px;
  max-height: 25vh;
  padding: 0.2em;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const QuantityInput = styled.input`
  margin-left: 1em;
  margin-right: 0.5em;
  font-size: 16px;
  border-radius: 2px;
  width: 5em;
`;

const AddResourceButton = styled.button`
  border: none;
  background-color: transparent;
  color: white;
  font-size: 16px;
  align-self: center;
  border-radius: 5px;
  padding: 2px 5px;
  margin: 5px;

  transition: background-color 0.1s ease;
  &:hover {
    background-color: grey;
  }
`;

export function ResourceQuantityList(props: Props) {
  const {
    factoryData,
    relevantResourceIds,
    resourceAmounts,
    setResourceAmounts,
  } = props;

  const relevantResources = useMemo(
    () =>
      relevantResourceIds.reduce(
        (relevantResources, resourceId) => ({
          ...relevantResources,
          [resourceId]: factoryData.resources[resourceId],
        }),
        {} as { [resourceId: string]: ResourceData }
      ),
    [factoryData, relevantResourceIds]
  );

  return (
    <List>
      {resourceAmounts.map(({ resourceId, amount }, index) => (
        <ListItem key={index}>
          <ResourceSelect
            resources={relevantResources}
            resourceId={resourceId}
            onChange={(newResourceId) =>
              setResourceAmounts((resourceAmounts) =>
                resourceAmounts.toSpliced(index, 1, {
                  resourceId: newResourceId,
                  amount,
                })
              )
            }
          />
          <QuantityInput
            type="number"
            value={amount}
            onChange={(e) =>
              setResourceAmounts((resourceAmounts) =>
                resourceAmounts.toSpliced(index, 1, {
                  resourceId,
                  amount: Number(e.target.value),
                })
              )
            }
          />
          <DeleteButton
            holdTime={500}
            onDelete={() =>
              setResourceAmounts((resourceAmounts) =>
                resourceAmounts.toSpliced(index, 1)
              )
            }
          />
        </ListItem>
      ))}
      <AddResourceButton
        onClick={() =>
          setResourceAmounts((resourceAmounts) => [
            ...resourceAmounts,
            { resourceId: null, amount: 0 },
          ])
        }
      >
        + Add Resource
      </AddResourceButton>
    </List>
  );
}
