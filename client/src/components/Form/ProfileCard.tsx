import React from 'react';
import axios from 'axios';

import './ProfileCard.css';

type ProfileCardState = {
  emailAddress: string;
  displayName: string;
  profilePic: string;
  createdAt: string;
  scores: Array<{
    score: number;
    timestamp: string;
  }>;
};

class ProfileCard extends React.Component<Record<string, unknown>, ProfileCardState> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      emailAddress: '',
      displayName: '',
      profilePic: '',
      createdAt: '',
      scores: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const { data: userInfo } = await axios.get('/api/user/');
    const { data: userScores } = await axios.get('/api/user/scores');

    this.setState({
      emailAddress: userInfo.emailAddress,
      displayName: userInfo.displayName,
      profilePic: userInfo.profilePic,
      createdAt: userInfo.createdAt,
      scores: userScores.scores,
    });
  }

  renderScores(): JSX.Element {
    const { scores: userScores } = this.state;

    return userScores.length ? (
      <div className="high-score">
        <div className="mb-4">Your High Scores</div>
        {userScores.map((value) => {
          const { score, timestamp } = value;

          return (
            <div className="record">
              <div className="score">{score}</div>
              <div className="timestamp">{timestamp}</div>
            </div>
          );
        })}
      </div>
    ) : (
      <div />
    );
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
        {this.renderScores()}
      </div>
    );
  }
}

export default ProfileCard;
