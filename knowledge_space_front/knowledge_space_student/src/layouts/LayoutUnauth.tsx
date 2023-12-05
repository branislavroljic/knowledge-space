import useAuthStore from '@stores/authStore';
import { useNotificationStore } from '@stores/notificationStore';
import Notification from '@ui/Notification';
import { Navigate, Outlet } from 'react-router-dom';

export default function LayoutUnauth() {
  const valid = useAuthStore((state) => state.isValid);

  const { isOpen, data, closeNotification } = useNotificationStore();

  if (valid) {
    return <Navigate to={'/'} replace={true} />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-blue-50">
      <Outlet />
      <Notification
        isShowing={isOpen}
        primaryText={data.primaryText}
        secondaryText={data.secondaryText}
        isError={data.isError}
        closeNotification={closeNotification}
      />
    </div>
  );
}
