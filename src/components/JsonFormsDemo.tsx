import { FC, useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { BoundaryEvent } from './BoundaryEvent';
import { ManualTask } from './ManualTask';
import { UserTask } from './UserTask';

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

// local
//const workflowRunner = 'http://localhost:8100'
//const workflowApiKey = '31200470-da18-48f9-8ba1-6225be674c33'

// prod
const workflowRunner = 'https://john-dark-meadow-5957.fly.dev';
const workflowApiKey = 'e5116459-c1d2-4dbe-aaea-7911a0c115bc';

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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...workflowState,
        ...additionalBody,
      }),
    });

    const json = await resp.json();

    setCompleted(json.completed ?? false);
    setPendingTasks(json.pending_tasks ?? []);
    setWorkflowState(json.state ? { state: json.state } : {});
    setResult(json.result ?? {});
  };

  useEffect(() => {
    runWorkflow({});
  }, []);

  const completeTask = (id: string, data: object) => {
    runWorkflow({ completed_tasks: [{ id, data }] });
  };

  const componentForTaskSpec = (task: object) =>
    task.task_spec.typename == 'ManualTask' ? (
      <ManualTask
        taskId={task.id}
        bpmnId={task.task_spec.bpmn_id}
        taskData={task.data}
        instructions={task.task_spec.extensions.instructionsForEndUser ?? ''}
        completer={completeTask}
      />
    ) : task.task_spec.typename == 'UserTask' ? (
      <UserTask
        taskId={task.id}
        bpmnId={task.task_spec.bpmn_id}
        taskData={task.data}
        instructions={task.task_spec.extensions.instructionsForEndUser}
        jsonSchemaFilename={
          task.task_spec.extensions.properties.formJsonSchemaFilename
        }
        uiSchemaFilename={
          task.task_spec.extensions.properties.formUiSchemaFilename
        }
        completer={completeTask}
      />
    ) : task.task_spec.typename == 'BoundaryEvent' ? (
      <BoundaryEvent
        taskId={task.id}
        bpmnId={task.task_spec.bpmn_id}
        buttonLabel={task.task_spec.extensions.signalButtonLabel}
        completer={completeTask}
      />
    ) : (
      <div>Unsupported task type: {task.task_spec.typename}</div>
    );

  return (
    <Grid
      container
      justifyContent={'center'}
      spacing={1}
      style={classes.container}>
      <Grid item sm={6}>
        {completed === false && pendingTasks.length === 0 ? (
          <div>Loading...</div>
        ) : completed === true ? (
          <div>
            <h3>Workflow Complete!</h3>
            <p>The data at the end of the workflow was:</p>
            <div>
              <pre id="boundData">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        ) : (
          <div>{pendingTasks.map((p, i) => componentForTaskSpec(p))}</div>
        )}
      </Grid>
    </Grid>
  );
};
