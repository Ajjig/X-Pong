import { Button, ButtonProps } from '@mantine/core';
import { GoogleIcon } from './GoogleIcon';
import { Network42Icon } from './Network42Icon';

export function GoogleButton(props: ButtonProps) {
  return <Button leftIcon={<GoogleIcon />} variant="default" color="gray" {...props} />;
}

export function Network42Button(props: ButtonProps) {
  return <Button leftIcon={<Network42Icon />} variant="default" color="gray" {...props} />;
}