import { FC, useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { ManualTask } from './ManualTask'
import { UserTask } from './UserTask'

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
};

const workflowRunner = 'http://localhost:8100'
//const workflowApiKey = '9dbf5fd3-3729-4171-bc9a-737d60d757e8'
const workflowApiKey = '31200470-da18-48f9-8ba1-6225be674c33'
const initialWorkflowState = {};

export const JsonFormsDemo: FC = () => {
  const [data, setData] = useState<object>({});
  
  const [completed, setCompleted] = useState(false);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [workflowState, setWorkflowState] = useState(initialWorkflowState);
  const [result, setResult] = useState({});

  const runWorkflow = async (additionalBody: object) => {
    const resp = await fetch(`${workflowRunner}/v0/do/${workflowApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...workflowState,
	...additionalBody,
      })
    })

    const json = await resp.json()
    console.log(json)
      
    setCompleted(json.completed ?? false)
    setPendingTasks(json.pending_tasks ?? [])
    setWorkflowState(json.state ? { state: json.state } : {})
    setResult(json.result ?? {})
  }
  
  useEffect(() => {
    runWorkflow({})
  }, []);

  const completeTask = (id: string, data: object) => {
    runWorkflow({completed_tasks: [{id, data}]})
  }

  const componentForTaskSpec = (task: object) =>
    task.task_spec.typename == 'ManualTask' ?
      <ManualTask
        taskId={task.id}
        bpmnId={task.task_spec.bpmn_id}
	instructions={task.task_spec.extensions.instructionsForEndUser}
	completer={completeTask}
      />
    : task.task_spec.typename == 'UserTask' ?
      <UserTask
        taskId={task.id}
	bpmnId={task.task_spec.bpmn_id}
	instructions={task.task_spec.extensions.instructionsForEndUser}
	jsonSchemaFilename={task.task_spec.extensions.properties.formJsonSchemaFilename}
	uiSchemaFilename={task.task_spec.extensions.properties.formUiSchemaFilename}
	completer={completeTask}
      />
    : <div>Unsupported task type: {task.task_spec.typename}</div>
  
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
	    <div>
	      <h3>Workflow Complete!</h3>
	      <p>The workflow finished with the resulting data:</p>
              <div>
                <pre id="boundData">{JSON.stringify(result, null, 2)}</pre>
              </div>
	    </div>
	  : <div>{pendingTasks.map((p, i) => componentForTaskSpec(p))}</div>
	    
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
