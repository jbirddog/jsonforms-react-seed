import { FC } from 'react';
import { marked } from 'marked'
import Button from '@mui/material/Button';

interface ManualTaskProps {
  taskId: string
  bpmnId: string
  instructions?: string
  completer(bpmnId: string, data: object): void
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
}

export const ManualTask: FC = ({
  taskId,
  bpmnId,
  instructions,
  completer
}: ManualTaskProps) => {
  const markedInstructions = marked.parse(instructions ?? '# No Instructions Provided.')
  return (
    <>
      <div dangerouslySetInnerHTML={{__html: markedInstructions}} />
      <Button
        style={classes.resetButton}
        onClick={() => completer(taskId, {})}
        color="primary"
        variant="contained"
        data-testid="clear-data">
        Continue
      </Button>
    </>
  )
}
