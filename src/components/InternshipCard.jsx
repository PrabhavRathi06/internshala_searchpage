import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import '../styles/InternshipCard.css';

const InternshipCard = ({ internship }) => {
  const {
    title,
    company_name,
    locations,
    duration,
    stipend,
    company_logo,
    posted_by_label,
    posted_by_label_type
  } = internship;

  const locationString = Array.isArray(locations)
    ? locations.map(loc => loc && loc.locationName).filter(Boolean).join(', ')
    : 'Remote';

  const [imgSrc, setImgSrc] = React.useState(() =>
    company_logo && company_logo !== 'undefined'
      ? `https://internshala.com/cached_uploads/logo/${company_logo}`
      : 'https://internshala.com/static/images/search/placeholder_logo.svg'
  );

  const handleImageError = () => {
    setImgSrc('https://internshala.com/static/images/search/placeholder_logo.svg');
  };

  const mockDescription =
    '1. Conduct 30-35 structured field interviews per district using the questionnaire provided. 2. Coordinate with...';
  const mockTags = [
    'MS-Word',
    'MS-PowerPoint',
    'MS-Excel',
    'Field Work',
    'English Proficiency (Spoken)'
  ];

  return (
    <div className="container-fluid individual_internship view_detail_button">
      <div className="internship_meta duration_meta">
        <div className="internship-heading-container">
          <div className="company generic_company">
            <div className="generic_container">
              <h2 className="job-internship-name">
                <a className="job-title-href" href="#">
                  {title}
                </a>
              </h2>
            </div>
            <div className="heading_6 company_name">
              <div className="company_and_premium">
                <p className="company-name">{company_name}</p>
                <div className="actively-hiring-badge">Actively hiring</div>
              </div>
            </div>
          </div>
          <div className="internship_logo">
            <img src={imgSrc} alt={company_name} onError={handleImageError} />
          </div>
        </div>

        <div className="individual_internship_details individual_internship_internship">
          <div className="detail-row-1">
            <div className="row-1-item locations">
              <MapPin size={16} className="detail_icon" />
              <span>
                <a className="location_link" href="#">
                  {locationString}
                </a>
              </span>
            </div>
            <div className="row-1-item">
              <span className="stipend">{stipend?.salary || 'Unpaid'}</span>
            </div>
            <div className="row-1-item">
              <Calendar size={16} className="detail_icon" />
              <span>{duration}</span>
            </div>
          </div>

          <div className="about_job">
            <div className="about_job_icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1 2v8h8V4H4zm2 1h4v1H6V5zm0 2h4v1H6V7z"
                  fill="#c4c4c4"
                />
              </svg>
            </div>
            <div className="text">{mockDescription}</div>
          </div>

          <div className="job_skills">
            {mockTags.map((tag, index) => (
              <React.Fragment key={tag}>
                <div className="skill_container">
                  <div className="job_skill">{tag}</div>
                </div>
                {index < mockTags.length - 1 && <span className="dot" />}
              </React.Fragment>
            ))}
            <div className="skill_container">
              <a className="more-skills" href="#">
                +5 more
              </a>
            </div>
          </div>

          <div className="detail-row-2">
            <div className="color-labels">
              <div className={`status-info posted-label ${posted_by_label_type === 'success' ? 'posted-label-success' : ''}`}>
                <Clock size={12} />
                <span>{posted_by_label || '4 days ago'}</span>
              </div>
              <div className="early-applicant">
                <span className="early-applicant-dot"></span>
                <span>Be an early applicant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;
