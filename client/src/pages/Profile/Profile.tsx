import React from 'react';

import ProfileCard from '../../components/Form/ProfileCard';

const Profile: React.FC<Record<string, unknown>> = () => (
  <div id="profile-container">
    <ProfileCard />
  </div>
);

export default Profile;
