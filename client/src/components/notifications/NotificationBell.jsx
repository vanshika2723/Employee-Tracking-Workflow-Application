
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import NotificationList from "./NotificationList";
import socket from "../../socket/socket";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  /* =====================================================
     FETCH NOTIFICATIONS
  ===================================================== */

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");

      console.log("🔔 NOTIFICATIONS:", res.data);

      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.notifications || [];

      setNotifications(list);
    } catch (error) {
      console.log(
        "❌ FETCH NOTIFICATION ERROR:",
        error.response?.data || error
      );
    }
  };

  /* =====================================================
     GET EMPLOYEE ID + JOIN ROOM
  ===================================================== */

const joinUserRoom = async () => {
  try {

    const res = await api.get("/profile");

    const userId =
      res.data?.user?._id ||
      res.data?.userId ||
      res.data?._id;

    if (!userId) {
      console.log("User ID not found");
      return;
    }

    socket.emit(
      "joinUserRoom",
      userId.toString()
    );

    console.log(
      "Joined user room:",
      userId
    );

  } catch(error) {
    console.log(error);
  }
};

  /* =====================================================
     MARK AS READ
  ===================================================== */

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.log(
        "❌ MARK READ ERROR:",
        error.response?.data || error
      );
    }
  };

  /* =====================================================
     SOCKET + INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    // Existing notifications
    fetchNotifications();

    /* ---------------------------------------------
       NEW NOTIFICATION
    --------------------------------------------- */

    const handleNewNotification = (notification) => {
      console.log(
        "🔔 NEW NOTIFICATION RECEIVED:",
        notification
      );

      setNotifications((prev) => {
        const exists = prev.some(
          (item) => item._id === notification._id
        );

        if (exists) {
          return prev;
        }

        return [
          {
            ...notification,
            isRead: false,
          },
          ...prev,
        ];
      });
    };

    /* ---------------------------------------------
       SOCKET CONNECT
    --------------------------------------------- */

    const handleConnect = () => {
      console.log(
        "🟢 SOCKET CONNECTED:",
        socket.id
      );

      // Socket connect hone ke baad room join
      joinEmployeeRoom();
    };

    /* ---------------------------------------------
       SOCKET DISCONNECT
    --------------------------------------------- */

    const handleDisconnect = (reason) => {
      console.log(
        "🔴 SOCKET DISCONNECTED:",
        reason
      );
    };

    socket.on(
      "newNotification",
      handleNewNotification
    );

    socket.on(
      "connect",
      handleConnect
    );

    socket.on(
      "disconnect",
      handleDisconnect
    );

    // Agar socket already connected hai
    if (socket.connected) {
      joinUserRoom()
    }

    return () => {
      socket.off(
        "newNotification",
        handleNewNotification
      );

      socket.off(
        "connect",
        handleConnect
      );

      socket.off(
        "disconnect",
        handleDisconnect
      );
    };
  }, []);

  /* =====================================================
     UNREAD COUNT
  ===================================================== */

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="relative notification-wrapper">

      {/* Bell */}

      <button
        onClick={() =>
          setOpen((prev) => !prev)
        }
        className="
          relative
          p-2
          rounded-full
          hover:bg-slate-100
          dark:hover:bg-slate-800
          transition
        "
      >
        <span className="text-xl">
          🔔
        </span>

        {/* Unread Badge */}

        {unreadCount > 0 && (
          <span
            className="
              absolute
              -top-1
              -right-1
              bg-red-500
              text-white
              text-xs
              font-bold
              w-5
              h-5
              rounded-full
              flex
              items-center
              justify-center
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-80
            bg-white
            dark:bg-slate-900
            shadow-xl
            rounded-xl
            border
            border-slate-200
            dark:border-slate-700
            z-[9999]
            overflow-hidden
          "
        >

          {/* Header */}

          <div
            className="
              px-4
              py-3
              border-b
              border-slate-200
              dark:border-slate-700
              flex
              items-center
              justify-between
            "
          >
            <h3
              className="
                font-semibold
                text-slate-800
                dark:text-white
              "
            >
              Notifications
            </h3>

            {unreadCount > 0 && (
              <span className="text-xs text-indigo-600">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Notification List */}

          <NotificationList
            notifications={notifications}
            onRead={markAsRead}
          />

        </div>
      )}
    </div>
  );
};

export default NotificationBell;

