import { FC, useState } from 'react';
import { marked } from 'marked'
import { JsonForms } from '@jsonforms/react';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import Button from '@mui/material/Button';
import schema from '../schema.json';
import uischema from '../uischema.json';

interface UserTaskProps {
  taskId: string
  bpmnId: string
  instructions?: string
  jsonSchemaFilename: string
  uiSchemaFilename: string
  completer(bpmnId: string, data: object): void
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
}

const renderers = [
  ...materialRenderers,
  //register custom renderers
]

export const UserTask: FC = ({
  taskId,
  bpmnId,
  instructions,
  jsonSchemaFilename,
  uiSchemaFilename,
  completer,
}: UserTaskProps) => {
  const [data, setData] = useState({})
  const markedInstructions = marked.parse(instructions ?? '# No Instructions Provided.')
  
  return (
    <>
      <div dangerouslySetInnerHTML={{__html: markedInstructions}}></div>
      <div style={classes.demoform}>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={renderers}
          cells={materialCells}
          onChange={({ data }) => setData(data)}
        />
      </div>
      <Button
        style={classes.resetButton}
        onClick={() => completer(taskId, data)}
        color="primary"
        variant="contained"
        data-testid="clear-data">
        Continue
      </Button>
    </>
  )
}
