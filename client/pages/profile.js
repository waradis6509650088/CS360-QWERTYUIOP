import ProtectedRoute from '../components/ProtectedRoute';

const Profile = () => {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1>Welcome to your profile!</h1>
        {/* Profile details here */}
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
