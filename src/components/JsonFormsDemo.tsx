import { FC, useEffect, useMemo, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import RatingControl from './RatingControl';
import ratingControlTester from '../ratingControlTester';
import schema from '../schema.json';
import uischema from '../uischema.json';

import { ManualTask } from './ManualTask'

const classes = {
  container: {
    padding: '1em',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    padding: '0.25em',
  },
  dataContent: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0.25em',
    backgroundColor: '#cecece',
    marginBottom: '1rem',
  },
  demoform: {
    margin: 'auto',
    padding: '1rem',
  },
};

const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: ratingControlTester, renderer: RatingControl },
];

const workflowRunner = 'http://localhost:8100'
//const workflowApiKey = '9dbf5fd3-3729-4171-bc9a-737d60d757e8'
const workflowApiKey = '31200470-da18-48f9-8ba1-6225be674c33'
const initialWorkflowState = {};

export const JsonFormsDemo: FC = () => {
  const [data, setData] = useState<object>({});
  
  const [completed, setCompleted] = useState(false);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [workflowState, setWorkflowState] = useState(initialWorkflowState);

  const runWorkflow = async (additionalBody?: object) => {
    const resp = await fetch(`${workflowRunner}/v0/do/${workflowApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...(workflowState ? workflowState : {}),
	...(additionalBody ? additionalBody : {}),
      })
    })

    const json = await resp.json()
    console.log(json)
      
    setCompleted(json.completed)
    setPendingTasks(json.pending_tasks)
    setWorkflowState(json.state)
  }
  
  useEffect(() => {
    runWorkflow()
  }, []);

  const completeTask = (bpmnId: string, data?: object) => {
    console.log('here')
  }

  const componentForTaskSpec = (taskSpec: object) =>
    taskSpec.typename == 'ManualTask' ?
      <ManualTask
        bpmnId={taskSpec.bpmn_id}
	instructions={taskSpec.extensions.instructionsForEndUser}
	completer={completeTask}
      />
    : <div>Unsupported task type: {taskSpec.typename}</div>
  
  return (
    <Grid
      container
      justifyContent={'center'}
      spacing={1}
      style={classes.container}>
      <Grid item sm={6}>
	{
	  completed === false && pendingTasks.length === 0 ?
	    <div>Loading...</div>
	  : completed === true ?
	    <div>Done!</div>
	  : pendingTasks.length === 1 ?
	    <div>{componentForTaskSpec(pendingTasks[0].task_spec)}</div>
	  : <div>Multiple tasks pending...</div>
	    
	}
      </Grid>
    </Grid>
  );
};

/*
        <Typography variant={'h4'}>Rendered form</Typography>
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
*/

      /*
      <Grid item sm={6}>
        <Typography variant={'h4'}>Bound data</Typography>
        <div style={classes.dataContent}>
          <pre id="boundData">{stringifiedData}</pre>
        </div>
        <Button
          style={classes.resetButton}
          onClick={clearData}
          color="primary"
          variant="contained"
          data-testid="clear-data">
          Clear data
        </Button>
      </Grid>
      */
