import React from 'react';
import axios from 'axios';

import './ProfileCard.css';

type ProfileCardState = {
  emailAddress: string;
  displayName: string;
  profilePic: string;
  createdAt: string;
};

class ProfileCard extends React.Component<Record<string, unknown>, ProfileCardState> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      emailAddress: '',
      displayName: '',
      profilePic: '',
      createdAt: '',
    };
  }

  async componentDidMount(): Promise<void> {
    const { data } = await axios.get('/api/user/');

    this.setState({
      emailAddress: data.emailAddress,
      displayName: data.displayName,
      profilePic: data.profilePic,
      createdAt: data.createdAt,
    });
  }

  render(): JSX.Element {
    const {
      emailAddress, displayName, profilePic, createdAt,
    } = this.state;

    const profilePicURL = {
      backgroundImage: `url(${profilePic})`,
    };

    return (
      <div className="profile-card-wrap">
        <div className="profile-card">
          <div className="profile-cl">
            <div className="user-profile-pic" style={profilePicURL} />
          </div>
          <div className="profile-cl">
            <div className="user-info">
              <div className="mb-2">
                <div className="label">Display Name</div>
                <div>{displayName}</div>
              </div>
              <div className="mb-2">
                <div className="label">Email Address</div>
                <div>{emailAddress}</div>
              </div>
              <div className="mb-2">
                <div className="label">User since</div>
                <div>{createdAt}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileCard;
