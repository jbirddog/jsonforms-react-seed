import Button from '@mui/material/Button';

interface BoundaryEventProps {
  taskId: string;
  bpmnId: string;
  buttonLabel?: string;
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

export const BoundaryEvent = ({
  taskId,
  bpmnId,
  buttonLabel,
  completer,
}: BoundaryEventProps) => (
  <Button
    style={classes.resetButton}
    onClick={() => completer(taskId, {})}
    color="primary"
    variant="contained"
    data-testid="clear-data">
    {buttonLabel ?? `Complete Boundary Event ${bpmnId}`}
  </Button>
);
