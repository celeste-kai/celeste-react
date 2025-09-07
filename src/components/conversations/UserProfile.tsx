import { useAuth } from "../../lib/auth/context";
import styles from "./UserProfile.module.css";

export function UserProfile() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  // Extract user initials for avatar
  const getInitials = (email: string) => {
    if (!email) return "?";
    const parts = email.split("@")[0];
    return parts.slice(0, 2).toUpperCase();
  };

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>{getInitials(user.email)}</div>
        <div className={styles.userDetails}>
          <div className={styles.userName}>{user.email.split("@")[0]}</div>
          <div className={styles.userEmail}>{user.email}</div>
        </div>
      </div>

      <button className={styles.signOutButton} onClick={handleSignOut} title="Sign out">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  );
}
