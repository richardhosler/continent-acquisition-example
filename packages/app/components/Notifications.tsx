import { useEffect } from "react";
import toast from "react-hot-toast";
interface NotificationsInterface {
  errors: (Error | undefined)[];
}

export const Notifications = ({ errors }: NotificationsInterface) => {
  useEffect(() => {
    if (errors) {
      errors.map((error) => {
        if (error?.message) {
          console.log({ shouldLog: error.message });
          toast.error(error.message);
        }
      });
    }
  }, [errors]);

  return <></>;
};
