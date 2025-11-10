import { Card } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';
import { Button } from 'react-bootstrap';
import { useLogout } from '@/hooks/useLogout';

const TeacherPanel = () => {
  const { user } = useAuth();
    const { logout ,loading} = useLogout();
  return (
    <div>
      <h2 className="mb-3">Teacher Panel</h2>
      <Card className="p-3">
        <h5>Your profile</h5>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(user, null, 2)}</pre>
      </Card>
      <Button onClick={() => logout()} className="ms-2" disabled={loading}>
            {loading ? "Logging out..." : "Logout"}
        </Button>
    </div>
  );
};

export default TeacherPanel;
