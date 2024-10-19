import { useState } from 'react';
import { marked } from 'marked';
import { JsonForms } from '@jsonforms/react';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import Button from '@mui/material/Button';
import schema from '../schema.json';
import uischema from '../uischema.json';

interface Keyable {
  [key: string]: any; // eslint-disable-line
}

interface UserTaskProps {
  taskId: string;
  bpmnId: string;
  taskData: Keyable;
  instructions?: string;
  jsonSchemaFilename: string;
  uiSchemaFilename: string;
  completer(bpmnId: string, data: object): void;
}

const classes = {
  container: {
    padding: '1em',
    width: '100%',
  },
  demoform: {
    margin: 'auto',
    padding: '1rem',
  },
  resetButton: {
    margin: 'auto !important',
    display: 'block !important',
  },
};

const renderers = [
  ...materialRenderers,
  //register custom renderers
];

export const UserTask = ({
  taskId,
  taskData,
  instructions,
  completer,
}: UserTaskProps) => {
  const [data, setData] = useState(taskData);
  const [hasErrors, setHasErrors] = useState(false);
  const markedInstructions = marked.parse(
    instructions ?? '# No Instructions Provided.',
  );

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: markedInstructions }}></div>
      <div style={classes.demoform}>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={renderers}
          cells={materialCells}
          onChange={({ data, errors }) => {
            setData(data);
            setHasErrors(Array.isArray(errors) && errors.length > 0);
            console.log(errors);
          }}
        />
      </div>
      <Button
        style={classes.resetButton}
        onClick={() => completer(taskId, data)}
        color="primary"
        variant="contained"
        disabled={hasErrors}
        data-testid="clear-data">
        Continue
      </Button>
    </>
  );
};
