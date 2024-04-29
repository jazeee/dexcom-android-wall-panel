import React, { ReactNode } from 'react';

interface Props {
  header?: ReactNode;
  children: ReactNode;
}
export function ViewContainer(props: Props): JSX.Element {
  const { children } = props;
  return <>{children}</>;
}
