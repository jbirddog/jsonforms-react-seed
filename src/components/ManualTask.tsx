import { FC } from 'react';
import { marked } from 'marked';
import Button from '@mui/material/Button';

interface ManualTaskProps {
  taskId: string;
  bpmnId: string;
  taskData: object;
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
    display: 'block !important',
  },
};

export const ManualTask: FC = ({
  taskId,
  bpmnId,
  taskData,
  instructions,
  completer,
}: ManualTaskProps) => {
  const markedInstructions = marked
    .parse(instructions)
    .replace(/\{\{(.+)\}\}/, (m, p1) => taskData[p1.trim()]);

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
