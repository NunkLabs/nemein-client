import React from 'react';
import axios from 'axios';

import './ProfileCard.css';

type ProfileCardState = {
  emailAddress: string;
  displayName: string;
  profilePic: string;
  scores: Array<{
    score: number;
    timestamp: string;
  }>;
};

class ProfileCard
  extends React.Component<Record<string, unknown>, ProfileCardState> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      emailAddress: '',
      displayName: '',
      profilePic: '',
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
      scores: userScores.scores,
    });
  }

  renderScores(): JSX.Element {
    const { scores: userScores } = this.state;

    return userScores.length ? (
      <div className="high-score">
        <p className="mb-4">YOUR HIGH SCORES</p>
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
      emailAddress, displayName, profilePic,
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
                DISPLAY NAME
                <p>{displayName}</p>
              </div>
              <div className="mb-2">
                EMAIL ADDRESS
                <p>{emailAddress}</p>
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
