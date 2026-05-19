import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ChevronDown, Menu, Filter, Home, Briefcase, BookOpen, Rocket, X, ArrowLeft } from 'lucide-react';
import FilterPanel from './components/FilterPanel';
import InternshipList from './components/InternshipList';
import './index.css';

const API_URL = 'https://internshala.com/hiring/search';

function App() {
  const [internships, setInternships] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileFilterOpen]);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    profile: '',
    location: '',
    wfh: false,
    partTime: false,
    stipend: 0,
    keyword: '',
    startDate: '',
    maxDuration: '',
    jobOffer: false,
    fastResponse: false,
    earlyApplicant: false,
    women: false
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL);
        const data = response.data;

        if (data && data.internships_meta && data.internship_ids) {
          const fetchedInternships = data.internship_ids.map(
            id => ({ ...data.internships_meta[id], id })
          );
          setInternships(fetchedInternships);
        } else {
          setError('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching internships:', err);
        setError('Failed to fetch internships. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      profile: '',
      location: '',
      wfh: false,
      partTime: false,
      stipend: 0,
      keyword: '',
      startDate: '',
      maxDuration: '',
      jobOffer: false,
      fastResponse: false,
      earlyApplicant: false,
      women: false
    });
  };

  const filteredInternships = useMemo(() => {
    return internships.filter(internship => {
      if (!internship) return false;

      if (filters.profile) {
        const search = String(filters.profile).toLowerCase();
        const matchProfile = internship.profile_name && String(internship.profile_name).toLowerCase().includes(search);
        const matchTitle = internship.title && String(internship.title).toLowerCase().includes(search);
        if (!matchProfile && !matchTitle) return false;
      }

      if (filters.location) {
        const search = String(filters.location).toLowerCase();
        const locationMatch = Array.isArray(internship.locations) && internship.locations.some(loc =>
          loc && loc.locationName && String(loc.locationName).toLowerCase().includes(search)
        );
        const isRemoteMatch = search.includes('remote') && internship.work_from_home;
        if (!locationMatch && !isRemoteMatch) return false;
      }

      if (filters.wfh && !internship.work_from_home) return false;
      if (filters.partTime && !internship.part_time) return false;

      if (filters.stipend > 0) {
        const stipendValue = internship.stipend?.salaryValue1 || 0;
        if (stipendValue < parseInt(filters.stipend, 10)) return false;
      }

      if (filters.keyword) {
        const searchStr = `${internship.title || ''} ${internship.company_name || ''} ${internship.profile_name || ''}`.toLowerCase();
        if (!searchStr.includes(String(filters.keyword).toLowerCase())) return false;
      }

      if (filters.startDate) {
        if (internship.start_date_comparison_format) {
          if (internship.start_date_comparison_format < filters.startDate) return false;
        }
      }

      if (filters.maxDuration) {
        const durationMatch = String(internship.duration || '').match(/\d+/);
        if (durationMatch) {
          const durationVal = parseInt(durationMatch[0], 10);
          if (durationVal > parseInt(filters.maxDuration, 10)) return false;
        }
      }

      if (filters.jobOffer) {
        if (!internship.is_ppo && internship.ppo_label_value !== 'With job offer') return false;
      }
      
      if (filters.fastResponse) {
        const labelsStr = JSON.stringify(internship.labels || []).toLowerCase();
        if (!labelsStr.includes('fast response') && !labelsStr.includes('fast_response')) return false;
      }
      
      if (filters.earlyApplicant) {
         const labelsStr = JSON.stringify(internship.labels || []).toLowerCase();
         if (!labelsStr.includes('early applicant') && !labelsStr.includes('early_applicant')) return false;
      }

      if (filters.women) {
         const labelsStr = JSON.stringify(internship.labels || []).toLowerCase();
         if (!labelsStr.includes('women')) return false;
      }

      return true;
    });
  }, [internships, filters]);

  return (
    <div className="app-container">
      <header className="app-header" id="header">
        <div className="max-width-container header-inner">
          {/* Mobile hamburger */}
          <button className="mobile-hamburger" aria-label="Menu"><Menu size={24} /></button>
          
          <a className="navbar-brand" href="/">
            <img
              src="https://internshala.com/static/images/common/new_internshala_logo.svg"
              alt="Internshala"
              className="internshala-logo-img"
            />
          </a>
          <nav className="header-nav nav_menu_container">
            <div className="nav-item nav-item-active">
              <span className="nav-item-content">Internships <ChevronDown size={14} className="nav-chevron" /></span>
              <div className="dropdown-menu dropdown-menu-mega">
                <div className="mega-menu-container">
                  <div className="mega-menu-sidebar">
                    <ul>
                      <li className="active-menu-item">Top Locations</li>
                      <li>Profile</li>
                      <li>Top Categories</li>
                      <li>Explore More Internships</li>
                      <li>Career Launchpads <span className="badge-orange">Get hired faster</span></li>
                    </ul>
                  </div>
                  <div className="mega-menu-content">
                    <ul>
                      <li>Work from Home</li>
                      <li>Internship in Bangalore</li>
                      <li>Internship in Delhi</li>
                      <li>Internship in Hyderabad</li>
                      <li>Internship in Mumbai</li>
                      <li>Internship in Chennai</li>
                      <li>Internship in Pune</li>
                      <li>Internship in Kolkata</li>
                      <li>Internship in Jaipur</li>
                      <li>International Internship</li>
                      <li>View all internships</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <span className="nav-item-content">Courses <span className="offer-tag">OFFER</span> <ChevronDown size={14} className="nav-chevron" /></span>
              <div className="dropdown-menu dropdown-menu-courses">
                <div className="mega-menu-4-col">
                  <div className="mega-col">
                    <h4>Certification Courses</h4>
                    <ul>
                      <li>Artificial Intelligence and Machine Learning <span className="badge-purple">Trending in AI</span></li>
                      <li>Microsoft Generative AI</li>
                      <li>Full Stack Web Development with AI</li>
                      <li>Programming with Python with AI</li>
                      <li>Complete Digital Marketing with AI</li>
                      <li>Machine Learning with AI</li>
                      <li>Advanced Excel with AI</li>
                      <li>View 70+ more courses</li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h4>Career Launchpads <span className="badge-green">Get hired faster</span></h4>
                    <ul>
                      <li>Web Developer Launchpad</li>
                      <li>Data Science Launchpad</li>
                      <li>Digital Marketing Launchpad</li>
                      <li>HR Management Launchpad</li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h4>Online Degrees</h4>
                    <ul>
                      <li>Online MBA</li>
                      <li>Online BCA</li>
                      <li>Online MCA</li>
                      <li>Online BBA</li>
                      <li>Online MA</li>
                      <li>Online MSc</li>
                      <li>View all</li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h4>Study Abroad</h4>
                    <ul>
                      <li>USA</li>
                      <li>UK</li>
                      <li>Canada</li>
                      <li>Germany</li>
                      <li>Australia</li>
                      <li>France</li>
                      <li>UAE</li>
                      <li>View all</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <span className="nav-item-content">Jobs <ChevronDown size={14} className="nav-chevron" /></span>
              <div className="dropdown-menu dropdown-menu-mega">
                <div className="mega-menu-container">
                  <div className="mega-menu-sidebar">
                    <ul>
                      <li className="active-menu-item">Top Locations</li>
                      <li>Top Categories</li>
                      <li>Fresher Jobs</li>
                      <li>Explore More Jobs</li>
                      <li>Career Launchpads <span className="badge-orange">Get hired faster</span></li>
                    </ul>
                  </div>
                  <div className="mega-menu-content">
                    <ul>
                      <li>Work from home</li>
                      <li>Jobs in Bangalore</li>
                      <li>Jobs in Delhi</li>
                      <li>Jobs in Hyderabad</li>
                      <li>Jobs in Gurgaon</li>
                      <li>Jobs in Kolkata</li>
                      <li>Jobs in Mumbai</li>
                      <li>Jobs in Pune</li>
                      <li>Jobs in Chennai</li>
                      <li>Jobs in Noida</li>
                      <li>Jobs in Jaipur</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <span className="nav-item-content">Login / Register <ChevronDown size={14} className="nav-chevron" /></span>
              <div className="dropdown-menu login-dropdown">
                <ul>
                  <li>Register as a student</li>
                  <li>Register as an employer</li>
                  <li>Login</li>
                </ul>
              </div>
            </div>
          </nav>
          {/* Mobile Register button */}
          <a className="mobile-register-btn" href="#">Register</a>
        </div>
      </header>

      {/* Mobile Filter Bar */}
      <div className="mobile-filter-bar">
        <button className="mobile-filter-btn" onClick={() => setIsMobileFilterOpen(true)}><Filter size={14} /> Filters</button>
        <button className="mobile-filter-btn" onClick={() => setIsMobileFilterOpen(true)}>All Filters</button>
      </div>

      <main id="content" className="search_content">
        <div className="max-width-container with_breadcrumbs" id="internships_list_container">
          <nav className="breadcrumb nav" aria-label="Breadcrumb">
            <span className="breadcrumb-item">
              <a className="breadcrumb-link" href="/">Home</a>
            </span>
            <span className="breadcrumb-item">
              <a className="breadcrumb-link active" href="/internships/">Internships</a>
            </span>
          </nav>

          <div id="reference" className="search-columns">
            <aside id="search_criteria_container" className="filters-column">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </aside>

            <div id="list_container" className="list-column">
              <div id="internship_seo_heading_container" className="internship_seo_heading_container">
                <h1 className="heading page-heading">
                  {filteredInternships.length} Total Internships
                </h1>
              </div>
              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner" />
                  <p>Loading internships...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <p>{error}</p>
                  <button type="button" onClick={() => window.location.reload()} className="retry-btn">
                    Retry
                  </button>
                </div>
              ) : (
                <InternshipList internships={filteredInternships} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="max-width-container">
          <div className="testimonials-grid">
            <div className="testimonials-cta">
              <div className="quote-icon">❝</div>
              <h2>Join the pool of 21Mn+ students and get started with your career</h2>
              <div className="play-store-info">
                <p className="play-store-label">PLAY STORE RATINGS</p>
                <div className="rating-row">
                  <span className="rating-number">4.4</span>
                  <span className="rating-stars">★★★★☆</span>
                  <span className="rating-count">(42K Reviews)</span>
                </div>
              </div>
              <a className="google-play-btn" href="#">
                <span>▶</span> Get it on Google Play ↗
              </a>
            </div>
            <div className="testimonial-card">
              <h3>Must-have app for students</h3>
              <p>I got my first internship from here. Internshala is must for career oriented students. This app has a lot of opportunities for every kind of students.</p>
              <div className="testimonial-author">
                <div className="author-avatar">YS</div>
                <div>
                  <strong>Yogesh Singh</strong>
                  <div className="author-stars">★★★★☆</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <h3>I landed a job at Amazon</h3>
              <p>I applied to Amazon and got the job! It was my dream. I wanted to get in tech but I was from electrical background. My friend suggested Data Science Placement Guarantee Course.</p>
              <div className="testimonial-author">
                <div className="author-avatar">YM</div>
                <div>
                  <strong>Yaswanth Mandapati</strong>
                  <div className="author-stars">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="footer-links-section">
        <div className="max-width-container">
          <div className="footer-link-group">
            <h4>Internship by Places</h4>
            <div className="footer-link-list">
              <a href="#">Internship in Bangalore</a><a href="#">Internship in Delhi</a><a href="#">Internships in Hyderabad</a><a href="#">Internship in Mumbai</a><a href="#">Internship in Chennai</a><a href="#">Internship in Pune</a><a href="#">Internship in Kolkata</a><a href="#">Internship in Gurgaon</a><a href="#">Work From Home Internships</a><a href="#" className="view-all-link">View all internship ›</a>
            </div>
          </div>
          <div className="footer-link-group">
            <h4>Internship by Stream</h4>
            <div className="footer-link-list">
              <a href="#">Computer Science Internship</a><a href="#">Electronics Internship</a><a href="#">Mechanical Internship</a><a href="#">Civil Internship</a><a href="#">Marketing Internship</a><a href="#">Chemical Internship</a><a href="#">Finance Internship</a><a href="#" className="view-all-link">View all internship ›</a>
            </div>
          </div>
          <div className="footer-link-group">
            <h4>Jobs by Places</h4>
            <div className="footer-link-list">
              <a href="#">Jobs in Bangalore</a><a href="#">Jobs in Delhi</a><a href="#">Jobs in Hyderabad</a><a href="#">Jobs in Gurgaon</a><a href="#">Jobs in Kolkata</a><a href="#">Jobs in Mumbai</a><a href="#">Jobs in Pune</a><a href="#">Jobs in Chennai</a><a href="#">Jobs in Noida</a><a href="#" className="view-all-link">View all jobs ›</a>
            </div>
          </div>
          <div className="footer-link-group">
            <h4>Jobs by Type</h4>
            <div className="footer-link-list">
              <a href="#">Data Entry jobs</a><a href="#">Content writing jobs</a><a href="#">Digital Marketing jobs</a><a href="#">Data Science jobs</a><a href="#">Cyber Security jobs</a><a href="#">Pharma jobs</a><a href="#">Teaching jobs</a><a href="#">HR jobs</a><a href="#">MBA jobs</a>
            </div>
          </div>
          <div className="footer-link-group">
            <h4>Fresher Jobs by Places</h4>
            <div className="footer-link-list">
              <a href="#">Fresher Jobs in Bangalore</a><a href="#">Fresher Jobs in Delhi</a><a href="#">Fresher Jobs in Hyderabad</a><a href="#">Fresher Jobs in Chennai</a><a href="#">Fresher Jobs in Pune</a><a href="#">Fresher Jobs in Mumbai</a><a href="#">Fresher Jobs in Noida</a><a href="#">Fresher Jobs in Kolkata</a><a href="#">Fresher Jobs in Gurgaon</a><a href="#" className="view-all-link">View all fresher jobs ›</a>
            </div>
          </div>
          <div className="footer-link-group">
            <h4>Fresher Jobs by Type</h4>
            <div className="footer-link-list">
              <a href="#">MBA Fresher Job</a><a href="#">HR Fresher Job</a><a href="#">Civil Fresher Job</a><a href="#">Digital Marketing Fresher Job</a><a href="#">Business Analyst Fresher Job</a><a href="#">Finance Fresher Job</a><a href="#">Accounts Fresher Job</a><a href="#">JAVA Fresher Job</a><a href="#">Software Testing Fresher Job</a><a href="#" className="view-all-link">View all fresher jobs ›</a>
            </div>
          </div>
          <div className="footer-link-group">
            <h4>Career Launchpads</h4>
            <div className="footer-link-list">
              <a href="#">Web Developer Launchpad</a><a href="#">Data Science Launchpad</a><a href="#">Digital Marketing Launchpad</a><a href="#">HR Management Launchpad</a><a href="#" className="view-all-link">View all courses ›</a>
            </div>
          </div>
          <div className="footer-link-group">
            <h4>Certification Courses <span className="offer-tag-sm">OFFER</span></h4>
            <div className="footer-link-list">
              <a href="#">Full Stack Web Development with AI</a><a href="#">Programming with Python with AI</a><a href="#">Complete Digital Marketing with AI</a><a href="#">Machine Learning with AI</a><a href="#">Advanced Excel with AI</a><a href="#">Data Science with AI</a><a href="#">Programming with C and C++ with AI</a><a href="#">Financial Modeling and Valuation with AI</a><a href="#" className="view-all-link">View all courses ›</a>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Footer */}
      <footer className="site-footer">
        <div className="max-width-container">
          <div className="footer-grid">
            <div className="footer-col">
              <a href="#">About us</a>
              <a href="#">We're hiring</a>
              <a href="#">Hire interns for your company</a>
              <a href="#">Post a Job</a>
              <a href="#">Competitions</a>
            </div>
            <div className="footer-col">
              <a href="#">Team Diary</a>
              <a href="#">Blog</a>
              <a href="#">Our Services</a>
              <a href="#">Free Job Alerts</a>
            </div>
            <div className="footer-col">
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy</a>
              <a href="#">Contact us</a>
              <a href="#">Annual Returns</a>
              <a href="#">Grievance Redressal</a>
              <a href="#">Resume Maker</a>
            </div>
            <div className="footer-col">
              <a href="#">Sitemap</a>
              <a href="#">College TPO registration</a>
              <a href="#">List of Companies</a>
              <a href="#">Jobs for Women</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-apps">
              <a href="#" className="app-badge">GET IT ON Google Play</a>
              <a href="#" className="app-badge">Download on the App Store</a>
              <div className="social-icons">
                <a href="#">📷</a>
                <a href="#">🐦</a>
                <a href="#">▶</a>
                <a href="#">in</a>
              </div>
            </div>
            <div className="footer-copyright">
              © Copyright 2026 Internshala<br/>(Scholiverse Educare Private Limited)
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <a href="#" className="mobile-nav-item">
          <Home size={20} />
          <span>Home</span>
        </a>
        <a href="#" className="mobile-nav-item active">
          <Briefcase size={20} />
          <span>Internships</span>
        </a>
        <a href="#" className="mobile-nav-item">
          <Briefcase size={20} />
          <span>Jobs</span>
        </a>
        <a href="#" className="mobile-nav-item">
          <BookOpen size={20} />
          <span>Courses</span>
        </a>
        <a href="#" className="mobile-nav-item">
          <Rocket size={20} />
          <span>Launchpads</span>
        </a>
      </nav>

      {/* Mobile Filter Modal Overlay */}
      {isMobileFilterOpen && (
        <div className="mobile-filter-modal">
          <div className="mobile-filter-header">
            <button className="mobile-filter-close-btn" onClick={() => setIsMobileFilterOpen(false)}>
              <X size={20} />
            </button>
            <h3>Filters</h3>
            <button className="mobile-filter-clear-btn" onClick={handleClearFilters}>
              Clear all
            </button>
          </div>
          <div className="mobile-filter-body">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
          <div className="mobile-filter-footer">
            <button className="mobile-filter-apply-btn" onClick={() => setIsMobileFilterOpen(false)}>
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
