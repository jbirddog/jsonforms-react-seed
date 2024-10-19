import { FC } from 'react';
import { marked } from 'marked'

interface ManualTaskProps {
  bpmnId: string
  instructions?: string
}

export const ManualTask: FC = ({ instructions }: ManualTaskProps) => {
  const markedInstructions = marked.parse(instructions ?? '# No Instructions Provided.')
  return <div dangerouslySetInnerHTML={{__html: markedInstructions}} />
}
