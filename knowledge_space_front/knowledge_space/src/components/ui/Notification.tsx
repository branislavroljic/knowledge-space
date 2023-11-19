import { Alert, Portal, Slide, SlideProps, Snackbar } from '@mui/material';

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

export interface NotificationProps {
  isShowing: boolean;
  closeNotification: () => void;
  primaryText: string;
  secondaryText?: string;
  isError?: boolean;
}

export default function Notification({
  isShowing,
  closeNotification,
  primaryText,
  secondaryText,
  isError,
}: NotificationProps) {
  return (
    <Portal>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={isShowing}
        onClose={closeNotification}
        TransitionComponent={TransitionUp}

        //   key={vertical + horizontal}
      >
        <Alert severity={isError ? 'error' : 'success'}>
          {primaryText} <br /> {secondaryText}
        </Alert>
      </Snackbar>
    </Portal>
  );
}
