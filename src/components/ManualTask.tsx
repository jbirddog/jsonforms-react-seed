import { marked } from 'marked';
import Button from '@mui/material/Button';

interface Keyable {
  [key: string]: any; // eslint-disable-line
}

interface ManualTaskProps {
  taskId: string;
  bpmnId: string;
  taskData: Keyable;
  instructions: string;
  completer(bpmnId: string, data: object): void;
}

const classes = {
  container: {
    padding: '1em',
    width: '100%',
  },
  resetButton: {
    margin: 'auto !important',
    'margin-right': '1em',
    display: 'block !important',
  },
};

export const ManualTask = ({
  taskId,
  taskData,
  instructions,
  completer,
}: ManualTaskProps) => {
  const markedInstructions = marked.parse(
    instructions.replace(
      /\{\{(.+)\}\}/,
      (_, p1: string) => taskData[p1.trim()],
    ),
  );

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: markedInstructions }} />
      <Button
        style={classes.resetButton}
        onClick={() => completer(taskId, {})}
        color="primary"
        variant="contained"
        data-testid="clear-data">
        Continue
      </Button>
    </>
  );
};
